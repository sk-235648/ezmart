import { connectDB } from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import { NextResponse } from "next/server";
import crypto from "crypto";
import Payment from "@/models/payment";
import Order from "@/models/order";
import { headers } from "next/headers";

export async function POST(req) {
  try {
    console.log('Verifying payment...');
    await connectDB("ezmart");
    
    // Get token from cookie header
    const headersList = await headers();
    const cookieHeader = headersList.get("cookie") || "";
    const token = cookieHeader.match(/token=([^;]+)/)?.[1];

    if (!token) throw new Error("No token found");
    const { _id: userId } = await verifyToken(token);
    
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      amount,
      orderId
    } = await req.json();
    
    // Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !orderId) {
      console.error('Missing required payment verification fields');
      return NextResponse.json(
        { success: false, message: "Missing required payment information" },
        { status: 400 }
      );
    }
    
    console.log(`Verifying payment signature for payment ID: ${razorpay_payment_id}`);
    
    // Verify signature
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");
    
    if (generatedSignature !== razorpay_signature) {
      console.error('Payment signature verification failed');
      return NextResponse.json(
        { success: false, message: "Payment verification failed" },
        { status: 400 }
      );
    }
    
    console.log('Payment signature verified successfully');
    
    // Find the order
    console.log(`Finding order with ID: ${orderId}`);
    const order = await Order.findById(orderId);
    if (!order) {
      console.error(`Order not found with ID: ${orderId}`);
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }
    
    // Verify that the order belongs to the authenticated user
    if (order.userId.toString() !== userId.toString()) {
      console.error(`Order ${orderId} does not belong to user ${userId}`);
      return NextResponse.json(
        { success: false, message: "Unauthorized access to order" },
        { status: 403 }
      );
    }
    
    console.log(`Found order for user: ${userId}`);
    
    // Check if payment already exists to prevent duplicates
    console.log(`Checking for existing payment with txnId: ${razorpay_payment_id}`);
    const existingPayment = await Payment.findOne({
      txnId: razorpay_payment_id
    });
    
    if (existingPayment) {
      console.log(`Payment already processed with ID: ${existingPayment._id}`);
      return NextResponse.json({
        success: true,
        message: "Payment already processed",
        paymentId: existingPayment._id
      });
    }
    
    console.log('No existing payment found, creating new payment record');
    
    // Create payment record
    console.log('Creating payment record...');
    const paymentData = {
      userId,
      orderId: order._id,
      method: 'Card', // Default to Card, can be updated with actual method if available
      status: 'Paid',
      amount: amount,
      txnId: razorpay_payment_id,
      paymentDate: new Date()
    };
    
    const payment = await Payment.create(paymentData);
    console.log(`Payment record created with ID: ${payment._id}`);
    
    // Update order status
    console.log(`Updating order status to Paid for order: ${order._id}`);
    order.paymentStatus = 'Paid';
    await order.save();
    console.log('Order status updated successfully');
    
    return NextResponse.json({
      success: true,
      message: "Payment verified successfully",
      paymentId: payment._id
    });
  } catch (error) {
    console.error("Error verifying payment:", error);
    
    // More specific error handling
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { success: false, message: "Invalid payment data: " + error.message },
        { status: 400 }
      );
    } else if (error.name === 'MongoServerError' && error.code === 11000) {
      return NextResponse.json(
        { success: false, message: "Duplicate payment detected" },
        { status: 409 }
      );
    } else if (error.message === 'No token found' || error.message === 'Invalid token') {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { success: false, message: error.message || "Error verifying payment" },
      { status: 500 }
    );
  }
}