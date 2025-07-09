// This file contains test functions for the payment integration
// You can use these functions to test the payment flow without going through the UI

/**
 * Test function to create an order
 * @param {number} amount - The amount to be paid
 * @param {string} currency - The currency (default: INR)
 * @returns {Promise<Object>} - The created order
 */
async function testCreateOrder(amount, currency = 'INR') {
  try {
    const response = await fetch('/api/payment/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, currency }),
    });

    const data = await response.json();
    console.log('Order created:', data);
    return data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
}

/**
 * Test function to verify a payment
 * @param {Object} paymentData - The payment data from Razorpay
 * @param {string} orderId - The MongoDB order ID
 * @param {number} amount - The amount paid
 * @returns {Promise<Object>} - The verification result
 */
async function testVerifyPayment(paymentData, orderId, amount) {
  try {
    const response = await fetch('/api/payment/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        razorpay_order_id: paymentData.razorpay_order_id,
        razorpay_payment_id: paymentData.razorpay_payment_id,
        razorpay_signature: paymentData.razorpay_signature,
        orderId,
        amount,
      }),
    });

    const data = await response.json();
    console.log('Payment verified:', data);
    return data;
  } catch (error) {
    console.error('Error verifying payment:', error);
    throw error;
  }
}

/**
 * Test the complete payment flow
 * @param {number} amount - The amount to be paid
 */
async function testPaymentFlow(amount = 1000) {
  try {
    // 1. Create an order
    const orderData = await testCreateOrder(amount);
    
    if (!orderData.success) {
      console.error('Failed to create order:', orderData.message);
      return;
    }
    
    console.log('Order created successfully!');
    console.log('Razorpay Order ID:', orderData.order.id);
    console.log('MongoDB Order ID:', orderData.orderId);
    
    // 2. In a real scenario, the user would complete the payment using Razorpay's checkout
    // and then the payment would be verified
    console.log('\nIn a real scenario, the user would now complete the payment using Razorpay\'s checkout.');
    console.log('After payment, the verification would happen automatically.');
    
    // 3. For testing webhook handling, you can use Razorpay's test webhook feature
    console.log('\nTo test webhook handling, use Razorpay\'s test webhook feature in the dashboard.');
  } catch (error) {
    console.error('Error in payment flow test:', error);
  }
}

// Export the test functions
export { testCreateOrder, testVerifyPayment, testPaymentFlow };

// Usage example (uncomment to run):
// testPaymentFlow(1000); // Test payment flow with amount 1000