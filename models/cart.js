//models/cart.js
import mongoose from 'mongoose';
import { connectDB } from '@/lib/db';

const conn = await connectDB('ezmart'); // Changed to 'ezmart' database

const cartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  color: String,
  size: String,
  price: {
    type: Number,
    required: true
  },
  image: String, // Added image field
  name: String   // Added name field for quick access
}, { _id: false });

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true
  },
  items: [cartItemSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp on save
cartSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Static methods
cartSchema.statics = {
  async addItem(userId, itemData) {
    // Get product details first
    const Product = conn.model('Product');
    const product = await Product.findById(itemData.productId);
    
    if (!product) {
      throw new Error('Product not found');
    }

    const cartItem = {
      productId: itemData.productId,
      quantity: itemData.quantity,
      color: itemData.color,
      size: itemData.size,
      price: itemData.price || product.price,
      image: itemData.image || (product.images && product.images[0]),
      name: itemData.name || product.title  // Use provided name or fall back to product.title
    };

    return this.findOneAndUpdate(
      { userId },
      { $push: { items: cartItem } },
      { new: true, upsert: true }
    );
  },

  async updateQuantity(userId, productId, quantity) {
    return this.findOneAndUpdate(
      { userId, 'items.productId': productId },
      { $set: { 'items.$.quantity': quantity } },
      { new: true }
    );
  },

  async removeItem(userId, productId) {
    return this.findOneAndUpdate(
      { userId },
      { $pull: { items: { productId } } },
      { new: true }
    );
  },

  async clearCart(userId) {
    return this.findOneAndUpdate(
      { userId },
      { $set: { items: [] } },
      { new: true }
    );
  }
};

// At the end of the file, ensure the model is properly exported
const Cart = conn.models.Cart || conn.model('Cart', cartSchema);

// Add this line to ensure the model is properly initialized
if (Cart) console.log("Cart model initialized");

export default Cart;