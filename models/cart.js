// models/cart.js
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

// Auto-update updatedAt
cartSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Static methods
cartSchema.statics = {
  async getCartByUserId(userId) {
    const userObjectId = new mongoose.Types.ObjectId(userId);
    return this.findOne({ userId: userObjectId })
      .populate('items.productId', 'title images price');
  },

  async addItemToCart(userId, productData) {
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const productObjectId = new mongoose.Types.ObjectId(productData.productId);

    return this.findOneAndUpdate(
      { userId: userObjectId },
      {
        $push: {
          items: {
            productId: productObjectId,
            quantity: productData.quantity,
            color: productData.color,
            size: productData.size,
            price: productData.price
          }
        }
      },
      { new: true, upsert: true }
    ).populate('items.productId', 'title images price');
  },

  async updateItemQuantity(userId, productId, newQuantity) {
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const productObjectId = new mongoose.Types.ObjectId(productId);

    return this.findOneAndUpdate(
      { userId: userObjectId, 'items.productId': productObjectId },
      { $set: { 'items.$.quantity': newQuantity } },
      { new: true }
    ).populate('items.productId', 'title images price');
  },

  async removeItemFromCart(userId, productId) {
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const productObjectId = new mongoose.Types.ObjectId(productId);

    return this.findOneAndUpdate(
      { userId: userObjectId },
      { $pull: { items: { productId: productObjectId } } },
      { new: true }
    ).populate('items.productId', 'title images price');
  },

  async clearCart(userId) {
    const userObjectId = new mongoose.Types.ObjectId(userId);
    return this.findOneAndUpdate(
      { userId: userObjectId },
      { $set: { items: [] } },
      { new: true }
    );
  }
};

export default mongoose.models.Cart || mongoose.model('Cart', cartSchema);
