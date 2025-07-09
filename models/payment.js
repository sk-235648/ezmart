// models/payment.js
import mongoose from 'mongoose';
import { connectDB } from '@/lib/db';

const conn = await connectDB('ezmart');

const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  method: {
    type: String,
    enum: ['Card', 'UPI', 'CashOnDelivery', 'NetBanking', 'Wallet'],
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Paid', 'Failed', 'Refunded'],
    default: 'Pending'
  },
  amount: Number,
  paymentDate: {
    type: Date,
    default: Date.now
  },
  txnId: String // Transaction ID from payment gateway
});

const Payment = conn.models.Payment || conn.model('Payment', paymentSchema);
export default Payment;