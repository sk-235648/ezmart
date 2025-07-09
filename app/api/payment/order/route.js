import { headers } from "next/headers";
import { connectDB } from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import shortid from "shortid";
import Order from "@/models/order";
import mongoose from "mongoose";
// Import Cart model dynamically to avoid schema issues

export async function POST(req) {
  try {
    console.log('Creating order...');
    await connectDB("ezmart");

    // ✅ Get user ID from token
    console.log('Verifying user authentication...');
    const headersList = await headers();
    const cookieHeader = headersList.get("cookie") || "";
    const token = cookieHeader.match(/token=([^;]+)/)?.[1];

    if (!token) {
      console.error('No authentication token found');
      throw new Error("No token found");
    }
    const { _id: userId } = await verifyToken(token);
    console.log(`Authenticated user: ${userId}`);

    // ✅ Get order details from request
    const { amount, currency = "INR" } = await req.json();
    if (!amount || amount <= 0) {
      console.error(`Invalid amount: ${amount}`);
      return NextResponse.json(
        { success: false, message: "Invalid amount" },
        { status: 400 }
      );
    }
    
    console.log(`Creating order with amount: ${amount} ${currency}`);
    
    // ✅ Get cart items to create order
    console.log('Fetching cart items...');
    
    // Dynamically import Cart model to avoid schema issues
    let Cart;
    try {
      // First try to get the model if it's already registered
      Cart = mongoose.models.Cart || mongoose.model('Cart');
      console.log('Cart model retrieved from mongoose.models');
    } catch (error) {
      // If model is not registered, import it dynamically
      try {
        const CartModule = await import('@/models/cart');
        Cart = CartModule.default;
        console.log('Cart model initialized from dynamic import');
      } catch (importError) {
        console.error('Failed to import Cart model:', importError);
        return NextResponse.json(
          { success: false, message: "Error loading cart data" },
          { status: 500 }
        );
      }
    }
    
    // Find cart with user ID
    const cart = await Cart.findOne({ userId }).lean();
    console.log(`Cart found for user: ${userId}`);
    
    if (!cart || !cart.items || cart.items.length === 0) {
      console.error('Cart is empty');
      return NextResponse.json(
        { success: false, message: "Cart is empty" },
        { status: 400 }
      );
    }
    
    console.log(`Found ${cart.items.length} items in cart`);

    // ✅ Create order in database
    console.log('Creating order in database...');
    const orderData = {
      userId,
      products: cart.items.map(item => ({
        productId: item.productId,
        quantity: item.quantity
      })),
      totalAmount: amount,
      paymentStatus: 'Pending',
      orderStatus: 'Pending'
    };
    
    const order = await Order.create(orderData);
    console.log(`Order created with ID: ${order._id}`);

    // ✅ Initialize Razorpay
    console.log('Creating Razorpay order...');
    
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      console.error('Razorpay credentials not configured');
      return NextResponse.json(
        { success: false, message: "Payment gateway not configured" },
        { status: 500 }
      );
    }
    
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    // ✅ Create order options
    const options = {
      amount: (amount * 100).toString(), // Razorpay expects amount in paise
      currency,
      receipt: order._id.toString(), // Use our order ID as receipt
      payment_capture: 1, // Auto-capture payment
      notes: {
        userId: userId.toString(), // ✅ Attach userId as a note
        orderId: order._id.toString() // Store our order ID in notes
      }
    };

    console.log(`Creating Razorpay order with receipt: ${order._id.toString()}`);
    const razorpayOrder = await razorpay.orders.create(options);
    console.log(`Razorpay order created with ID: ${razorpayOrder.id}`);

    return NextResponse.json({
      success: true,
      order: razorpayOrder,
      orderId: order._id, // Send our internal order ID back to client
      message: "Order created successfully"
    });
  } catch (error) {
    console.error("Error creating order:", error);
    
    // More specific error handling
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { success: false, message: "Invalid order data: " + error.message },
        { status: 400 }
      );
    } else if (error.name === 'MongoServerError' && error.code === 11000) {
      return NextResponse.json(
        { success: false, message: "Duplicate order detected" },
        { status: 409 }
      );
    } else if (error.message === 'No token found' || error.message === 'Invalid token') {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { success: false, message: error.message || "Error creating order" },
      { status: 500 }
    );
  }
}
