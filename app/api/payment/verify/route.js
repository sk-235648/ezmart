import { connectDB } from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req) {
  try {
    await connectDB("ezmart");
    const { userId } = await verifyToken();
    
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      productId,
      amount,
    } = await req.json();
    
    // Verify signature
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");
    
    if (generatedSignature !== razorpay_signature) {
      return NextResponse.json(
        { success: false, message: "Payment verification failed" },
        { status: 400 }
      );
    }
    
    // Here you would typically update your database to record the successful payment
    // For example, create an order record, update inventory, etc.
    
    return NextResponse.json({
      success: true,
      message: "Payment verified successfully",
    });
  } catch (error) {
    console.error("Error verifying payment:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Error verifying payment" },
      { status: 500 }
    );
  }
}