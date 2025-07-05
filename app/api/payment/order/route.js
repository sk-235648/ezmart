import { headers } from "next/headers";
import { connectDB } from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import shortid from "shortid";

export async function POST(req) {
  try {
    await connectDB("ezmart");

    // ✅ Get token from cookie header
    const headersList = await headers();
    const cookieHeader = headersList.get("cookie") || "";
    const token = cookieHeader.match(/token=([^;]+)/)?.[1];

    if (!token) throw new Error("No token found");
    const { _id: userId } = await verifyToken(token);

    // ✅ Get order details from request
    const { amount, currency = "INR" } = await req.json();
    if (!amount) {
      return NextResponse.json(
        { success: false, message: "Amount is required" },
        { status: 400 }
      );
    }

    // ✅ Initialize Razorpay
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    // ✅ Create order options
    const options = {
      amount: (amount * 100).toString(), // Razorpay expects amount in paise
      currency,
      receipt: shortid.generate(),
      payment_capture: 1, // Auto-capture payment
      notes: {
        userId: userId.toString(), // ✅ Attach userId as a note
      }
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({
      success: true,
      order,
      message: "Order created successfully"
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Error creating order" },
      { status: 500 }
    );
  }
}
