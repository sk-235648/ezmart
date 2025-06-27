import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    const { id } = await params; // Await the params first
    await connectDB();
    const product = await Product.findById(id);
    if (!product) return NextResponse.json({ message: "Not found" }, { status: 404 });
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}
