# EzMart Payment Integration

This document provides information about the payment integration in EzMart using Razorpay.

## Overview

The payment system consists of the following components:

1. **Order Creation**: When a user proceeds to checkout, an order is created in the database and a Razorpay order is initiated.
2. **Payment Processing**: The user completes the payment using Razorpay's checkout interface.
3. **Payment Verification**: The payment is verified using Razorpay's signature verification.
4. **Webhook Handling**: Razorpay webhooks are used to handle asynchronous payment status updates.

## Database Models

### Order Model

Stores information about orders:

- `userId`: Reference to the user who placed the order
- `products`: Array of products in the order (productId and quantity)
- `totalAmount`: Total amount of the order
- `paymentStatus`: Status of the payment (Pending, Paid)
- `orderStatus`: Status of the order (Pending, Shipped, Delivered)
- `createdAt`: Date when the order was created

### Payment Model

Stores information about payments:

- `userId`: Reference to the user who made the payment
- `orderId`: Reference to the order being paid for
- `method`: Payment method (Card, UPI, CashOnDelivery, NetBanking, Wallet)
- `status`: Status of the payment (Pending, Paid, Failed, Refunded)
- `amount`: Amount paid
- `paymentDate`: Date when the payment was made
- `txnId`: Transaction ID from Razorpay

## API Endpoints

### 1. Create Order

**Endpoint**: `/api/payment/order`
**Method**: POST

Creates an order in the database and initiates a Razorpay order.

**Request Body**:
```json
{
  "amount": 1000,
  "currency": "INR"
}
```

**Response**:
```json
{
  "success": true,
  "order": { /* Razorpay order details */ },
  "orderId": "mongodb_order_id",
  "message": "Order created successfully"
}
```

### 2. Verify Payment

**Endpoint**: `/api/payment/verify`
**Method**: POST

Verifies the payment using Razorpay's signature verification and updates the order and payment status.

**Request Body**:
```json
{
  "razorpay_order_id": "order_id_from_razorpay",
  "razorpay_payment_id": "payment_id_from_razorpay",
  "razorpay_signature": "signature_from_razorpay",
  "amount": 1000,
  "orderId": "mongodb_order_id"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Payment verified successfully",
  "paymentId": "mongodb_payment_id"
}
```

### 3. Webhook Handler

**Endpoint**: `/api/payment/webhook`
**Method**: POST

Handles Razorpay webhooks for asynchronous payment status updates.

## Setting Up Razorpay Webhooks

1. Go to the [Razorpay Dashboard](https://dashboard.razorpay.com/app/webhooks)
2. Click on "Add New Webhook"
3. Enter your webhook URL: `https://your-domain.com/api/payment/webhook`
4. Select the following events:
   - payment.authorized
   - payment.failed
   - payment.captured
   - refund.created
5. Generate a webhook secret and store it in your environment variables as `RAZORPAY_WEBHOOK_SECRET`

## Environment Variables

Make sure to set the following environment variables:

```
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret
```

## Best Practices

1. **Preventing Duplicate Payments**: The system checks for existing payments with the same transaction ID before creating a new payment record.

2. **Handling Failed Payments**: Failed payments are recorded in the database with a status of "Failed".

3. **Security**: Razorpay signatures are verified to ensure the authenticity of payment notifications.

4. **Error Handling**: Proper error handling is implemented to handle various edge cases.

5. **Logging**: Important events and errors are logged for debugging purposes.

## Troubleshooting

1. **Payment Verification Failed**: Check if the Razorpay key ID and secret are correctly set in the environment variables.

2. **Webhook Not Working**: Ensure that the webhook URL is publicly accessible and the webhook secret is correctly set.

3. **Order Not Found**: Make sure that the order ID is correctly passed from the frontend to the backend.

4. **Payment Status Not Updated**: Check the webhook logs to see if the webhook is being received and processed correctly.