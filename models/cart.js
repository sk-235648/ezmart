//models/cart.js
import mongoose from 'mongoose';

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
  color: {
    type: String,
    required: false
  },
  size: {
    type: String,
    required: false
  },
  price: {
    type: Number,
    required: true
  }
}, { _id: false });

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
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

// Update the updatedAt field before saving
cartSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Static methods for cart operations
cartSchema.statics = {
  async getCartByUserId(userId) {
    return this.findOne({ userId })
      .populate('items.productId', 'title images price')
      .lean();
  },

  async addItemToCart(userId, productData) {
    const { productId, quantity, color, size, price } = productData;
    
    return this.findOneAndUpdate(
      { userId },
      {
        $push: {
          items: {
            productId,
            quantity,
            color,
            size,
            price
          }
        }
      },
      { new: true, upsert: true }
    ).populate('items.productId', 'title images price');
  },

  async updateItemQuantity(userId, productId, newQuantity) {
    return this.findOneAndUpdate(
      { userId, 'items.productId': productId },
      { $set: { 'items.$.quantity': newQuantity } },
      { new: true }
    ).populate('items.productId', 'title images price');
  },

  async removeItemFromCart(userId, productId) {
    return this.findOneAndUpdate(
      { userId },
      { $pull: { items: { productId } } },
      { new: true }
    ).populate('items.productId', 'title images price');
  },

  async clearCart(userId) {
    return this.findOneAndUpdate(
      { userId },
      { $set: { items: [] } },
      { new: true }
    );
  }
};

export default mongoose.models.Cart || mongoose.model('Cart', cartSchema);