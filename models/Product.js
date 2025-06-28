import mongoose from "mongoose";
import { connectDB } from "@/lib/db";

const conn = await connectDB('ezmart-admin');
const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true }, // Added title field
    price: { type: Number, required: true },
    expenses: { type: Number, required: true },
    images: { type: [String], required: true },
    category: { type: String, required: true },
    colors: String,
    sizes: String
  },
  { 
    collection: "products",
    timestamps: true // Optional: adds createdAt and updatedAt fields
  }
);

// Create text index for searching if needed
productSchema.index({ title: 'text', category: 'text' });

const Product = conn.models.Product || conn.model('Product', productSchema);

export default Product;