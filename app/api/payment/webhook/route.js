import { NextResponse } from "next/server";
import crypto from "crypto";
import Payment from "@/models/payment";
import Order from "@/models/order";
import { connectDB } from "@/lib/db";

// This endpoint handles Razorpay webhooks
// Configure this URL in your Razorpay Dashboard: https://dashboard.razorpay.com/app/webhooks
export async function POST(req) {
  try {
    await connectDB("ezmart");
    
    // Get the webhook payload
    const payload = await req.json();
    
    // Get the Razorpay signature from headers
    const webhookSignature = req.headers.get('x-razorpay-signature');
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    
    if (!webhookSecret) {
      console.error('RAZORPAY_WEBHOOK_SECRET is not configured');
      return NextResponse.json(
        { success: false, message: "Webhook secret not configured" },
        { status: 500 }
      );
    }
    
    if (!webhookSignature) {
      console.error('Missing webhook signature in request headers');
      return NextResponse.json(
        { success: false, message: "Missing webhook signature" },
        { status: 400 }
      );
    }
    
    console.log('Webhook signature found, proceeding with verification');
    
    // Verify webhook signature
    console.log('Verifying webhook signature');
    const isValidSignature = verifyWebhookSignature(
      JSON.stringify(payload),
      webhookSignature,
      webhookSecret
    );
    
    if (!isValidSignature) {
      console.error('Invalid webhook signature detected');
      return NextResponse.json(
        { success: false, message: "Invalid signature" },
        { status: 400 }
      );
    }
    
    console.log('Webhook signature verified successfully');
    
    // Process the webhook event
    const event = payload.event;
    console.log(`Webhook event type: ${event}`);
    
    // Handle different event types
    try {
      switch (event) {
        case 'payment.authorized':
          console.log('Processing payment.authorized event');
          await handlePaymentAuthorized(payload.payload.payment.entity);
          break;
        case 'payment.failed':
          console.log('Processing payment.failed event');
          await handlePaymentFailed(payload.payload.payment.entity);
          break;
        case 'payment.captured':
          console.log('Processing payment.captured event');
          await handlePaymentCaptured(payload.payload.payment.entity);
          break;
        case 'refund.created':
          console.log('Processing refund.created event');
          await handleRefundCreated(payload.payload.refund.entity);
          break;
        default:
          console.log(`Unhandled webhook event type: ${event}`);
      }
      console.log(`Successfully processed webhook event: ${event}`);
    } catch (eventError) {
      console.error(`Error processing webhook event ${event}:`, eventError);
      // Continue processing to return 200 status to Razorpay
      // This prevents Razorpay from retrying the webhook
    }
    
    return NextResponse.json({ success: true, message: "Webhook processed" });
  } catch (error) {
    console.error("Error processing webhook:", error);
    
    // More specific error handling
    if (error.name === 'SyntaxError') {
      return NextResponse.json(
        { success: false, message: "Invalid webhook payload format" },
        { status: 400 }
      );
    } else if (error.name === 'ValidationError') {
      return NextResponse.json(
        { success: false, message: "Invalid webhook data: " + error.message },
        { status: 400 }
      );
    } else if (error.name === 'MongoServerError' && error.code === 11000) {
      // For duplicate key errors, still return 200 to prevent Razorpay from retrying
      console.log('Duplicate webhook event detected, returning 200 OK');
      return NextResponse.json(
        { success: true, message: "Webhook event already processed" }
      );
    }
    
    return NextResponse.json(
      { success: false, message: error.message || "Error processing webhook" },
      { status: 500 }
    );
  }
}

// Verify the webhook signature
function verifyWebhookSignature(payload, signature, secret) {
  try {
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(payload)
      .digest("hex");
    
    const isValid = crypto.timingSafeEqual(
      Buffer.from(expectedSignature, 'hex'),
      Buffer.from(signature, 'hex')
    );
    console.log(`Webhook signature validation: ${isValid ? 'Passed' : 'Failed'}`);
    return isValid;
  } catch (error) {
    console.error('Error verifying webhook signature:', error);
    return false;
  }
}

// Handle payment.authorized event
async function handlePaymentAuthorized(payment) {
  try {
    console.log(`Processing payment authorized for payment ID: ${payment.id}`);
    
    // Extract order ID from notes
    const orderId = payment.notes?.orderId;
    if (!orderId) {
      console.error('Order ID not found in payment notes');
      return;
    }
    
    console.log(`Found order ID in payment notes: ${orderId}`);
    
    // Check if payment already exists
    console.log(`Checking for existing payment with txnId: ${payment.id}`);
    const existingPayment = await Payment.findOne({ txnId: payment.id });
    if (existingPayment) {
      console.log(`Payment ${payment.id} already processed`);
      return;
    }
    
    // Find the order
    console.log(`Finding order with ID: ${orderId}`);
    const order = await Order.findById(orderId);
    if (!order) {
      console.error(`Order ${orderId} not found`);
      return;
    }
    
    console.log(`Found order for user: ${order.userId}`);
    
    // Create payment record with 'Authorized' status
    console.log('Creating payment record with Authorized status');
    const paymentData = {
      userId: order.userId,
      orderId: order._id,
      method: mapPaymentMethod(payment.method),
      status: 'Authorized',
      amount: payment.amount / 100, // Convert from paisa to rupees
      txnId: payment.id,
      paymentDate: new Date()
    };
    
    const newPayment = await Payment.create(paymentData);
    console.log(`Payment record created with ID: ${newPayment._id}`);
    
    // Update order status to 'Authorized'
    console.log(`Updating order status to Authorized for order: ${orderId}`);
    order.paymentStatus = 'Authorized';
    await order.save();
    console.log('Order status updated successfully');
    
    console.log(`Payment authorized for order: ${orderId}`);
  } catch (error) {
    console.error('Error handling payment.authorized event:', error);
    // Rethrow to be caught by the main try-catch block
    throw error;
  }
}

// Handle payment.failed event
async function handlePaymentFailed(payment) {
  try {
    console.log(`Processing payment failed for payment ID: ${payment.id}`);
    
    // Extract order ID from notes
    const orderId = payment.notes?.orderId;
    if (!orderId) {
      console.error('Order ID not found in payment notes');
      return;
    }
    
    console.log(`Found order ID in payment notes: ${orderId}`);
    
    // Check if payment already exists
    console.log(`Checking for existing payment with txnId: ${payment.id}`);
    let paymentRecord = await Payment.findOne({ txnId: payment.id });
    
    if (paymentRecord) {
      // Update existing payment record
      console.log(`Updating existing payment record to Failed status: ${paymentRecord._id}`);
      paymentRecord.status = 'Failed';
      await paymentRecord.save();
      console.log('Payment record updated successfully');
    } else {
      // Find the order
      console.log(`Finding order with ID: ${orderId}`);
      const order = await Order.findById(orderId);
      if (!order) {
        console.error(`Order ${orderId} not found`);
        return;
      }
      
      console.log(`Found order for user: ${order.userId}`);
      
      // Create payment record with 'Failed' status
      console.log('Creating payment record with Failed status');
      const paymentData = {
        userId: order.userId,
        orderId: order._id,
        method: mapPaymentMethod(payment.method),
        status: 'Failed',
        amount: payment.amount / 100, // Convert from paise to rupees
        txnId: payment.id,
        paymentDate: new Date(),
        failureReason: payment.error_description || payment.error_code || 'Unknown error'
      };
      
      paymentRecord = await Payment.create(paymentData);
      console.log(`Payment record created with ID: ${paymentRecord._id}`);
      
      // Update order status
      console.log(`Updating order status to Failed for order: ${orderId}`);
      order.paymentStatus = 'Failed';
      await order.save();
      console.log('Order status updated successfully');
    }
    
    console.log(`Failed payment ${payment.id} for order ${orderId} recorded`);
  } catch (error) {
    console.error('Error handling payment.failed event:', error);
    // Rethrow to be caught by the main try-catch block
    throw error;
  }
}

// Handle payment.captured event
async function handlePaymentCaptured(payment) {
  try {
    // Extract order ID from notes
    const orderId = payment.notes?.orderId;
    if (!orderId) {
      console.error('Order ID not found in payment notes');
      return;
    }
    
    // Find the order
    const order = await Order.findById(orderId);
    if (!order) {
      console.error(`Order ${orderId} not found`);
      return;
    }
    
    // Check if payment already exists
    let paymentRecord = await Payment.findOne({ txnId: payment.id });
    
    if (paymentRecord) {
      // Update existing payment record if status is not already 'Paid'
      if (paymentRecord.status !== 'Paid') {
        paymentRecord.status = 'Paid';
        await paymentRecord.save();
      }
    } else {
      // Create new payment record
      paymentRecord = await Payment.create({
        userId: order.userId,
        orderId: order._id,
        method: mapPaymentMethod(payment.method),
        status: 'Paid',
        amount: payment.amount / 100, // Convert from paise to rupees
        txnId: payment.id,
        paymentDate: new Date()
      });
    }
    
    // Update order status if not already paid
    if (order.paymentStatus !== 'Paid') {
      order.paymentStatus = 'Paid';
      await order.save();
    }
    
    console.log(`Captured payment ${payment.id} for order ${orderId} processed`);
  } catch (error) {
    console.error('Error processing payment.captured webhook:', error);
  }
}

// Handle refund.created event
async function handleRefundCreated(refund) {
  try {
    // Find the payment by payment ID
    const paymentRecord = await Payment.findOne({ txnId: refund.payment_id });
    if (!paymentRecord) {
      console.error(`Payment ${refund.payment_id} not found`);
      return;
    }
    
    // Update payment status
    paymentRecord.status = 'Refunded';
    await paymentRecord.save();
    
    // Find and update the order
    const order = await Order.findById(paymentRecord.orderId);
    if (order) {
      order.paymentStatus = 'Refunded';
      await order.save();
    }
    
    console.log(`Refund processed for payment ${refund.payment_id}`);
  } catch (error) {
    console.error('Error processing refund.created webhook:', error);
  }
}

// Map Razorpay payment method to our payment method enum
function mapPaymentMethod(razorpayMethod) {
  const methodMap = {
    'card': 'Card',
    'upi': 'UPI',
    'netbanking': 'NetBanking',
    'wallet': 'Wallet'
  };
  
  return methodMap[razorpayMethod] || 'Card'; // Default to Card if method not found
}