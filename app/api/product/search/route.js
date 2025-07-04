import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    // Get the search query from URL parameters
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    
    if (!query) {
      return NextResponse.json({ products: [] });
    }
    
    await connectDB("ezmart");
    
    // Instead of using $or with $text, we'll run two separate queries and merge results
    // First, try text search
    let textSearchResults = [];
    try {
      textSearchResults = await Product.find(
        { $text: { $search: query } }
      ).limit(20);
    } catch (textError) {
      console.log("Text search error (non-critical):", textError.message);
      // Continue with regex search even if text search fails
    }
    
    // Then, try regex search
    const regexResults = await Product.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } }
      ]
    }).limit(20);
    
    // Combine results, remove duplicates by ID
    const combinedMap = new Map();
    
    // Add text search results first (they're usually more relevant)
    textSearchResults.forEach(product => {
      combinedMap.set(product._id.toString(), product);
    });
    
    // Add regex results
    regexResults.forEach(product => {
      if (!combinedMap.has(product._id.toString())) {
        combinedMap.set(product._id.toString(), product);
      }
    });
    
    // Convert map back to array
    const products = Array.from(combinedMap.values());
    
    return NextResponse.json({ products });
  } catch (error) {
    console.error("Error searching products:", error);
    return NextResponse.json(
      { message: "Error searching products" }, 
      { status: 500 }
    );
  }
}