import mongoose from 'mongoose';
import { connectDB } from '@/lib/db';

const conn = await connectDB('ezmart');

const wishlistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  products: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Product'
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create a compound index to ensure a user can only like a product once
wishlistSchema.index({ userId: 1, 'products.productId': 1 }, { unique: true });

const Wishlist = conn.models.Wishlist || conn.model('Wishlist', wishlistSchema);
export default Wishlist;