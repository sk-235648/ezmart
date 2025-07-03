import { connectDB } from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import shortid from "shortid";

export async function POST(req) {
  try {
    await connectDB("ezmart");
    const { userId } = await verifyToken();
    
    // Get order details from request
    const { amount, currency = "INR" } = await req.json();
    
    // Initialize Razorpay
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    
    // Create order
    const options = {
      amount: (amount * 100).toString(), // Razorpay expects amount in paise
      currency,
      receipt: shortid.generate(),
      payment_capture: 1, // Auto-capture payment
    };
    
    const order = await razorpay.orders.create(options);
    
    return NextResponse.json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Error creating order" },
      { status: 500 }
    );
  }
}