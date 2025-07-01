import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    const { id } = params;
    await connectDB("ezmart"); // Changed to ezmart database
    const product = await Product.findById(id);
    
    if (!product) {
      return NextResponse.json(
        { message: "Product not found" }, 
        { status: 404 }
      );
    }
    
    return NextResponse.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { message: "Error fetching product" }, 
      { status: 500 }
    );
  }
}