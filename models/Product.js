//models/product
import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    price: { type: Number, required: true },
    expenses: { type: Number, required: true },
    images: { type: [String], required: true },
    category: { type: String, required: true },
    colors: String,
    sizes: String
  },
  { collection: "products" }
);

export default mongoose.models.Product || mongoose.model("Product", productSchema);