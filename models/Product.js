import mongoose from "mongoose";

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

export default mongoose.models.Product || mongoose.model("Product", productSchema);