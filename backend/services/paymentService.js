class PaymentService {
  constructor() {
    this.razorpayKeyId = process.env.RAZORPAY_KEY_ID;
    this.razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;
    this.testMode = process.env.PAYMENT_TEST_MODE === 'true';
  }

  async createOrder(amount, currency = 'INR', receiptId) {
    if (!this.razorpayKeyId || !this.razorpayKeySecret) {
      console.log('Razorpay not configured. Returning mock order.');
      return {
        id: `order_mock_${Date.now()}`,
        amount: amount * 100,
        currency,
        receipt: receiptId,
        status: 'created',
        mock: true
      };
    }

    try {
      const Razorpay = require('razorpay');
      const razorpay = new Razorpay({
        key_id: this.razorpayKeyId,
        key_secret: this.razorpayKeySecret
      });

      const options = {
        amount: amount * 100,
        currency,
        receipt: receiptId,
        payment_capture: 1
      };

      const order = await razorpay.orders.create(options);
      return order;
    } catch (error) {
      console.error('Razorpay order creation error:', error);
      throw error;
    }
  }

  async verifyPayment(paymentId, orderId, signature) {
    if (!this.razorpayKeyId || !this.razorpayKeySecret) {
      console.log('Razorpay not configured. Returning mock verification.');
      return { success: true, mock: true };
    }

    try {
      const crypto = require('crypto');
      const hmac = crypto.createHmac('sha256', this.razorpayKeySecret);
      hmac.update(orderId + '|' + paymentId);
      const generatedSignature = hmac.digest('hex');
      
      if (generatedSignature === signature) {
        return { success: true };
      }
      return { success: false, error: 'Invalid signature' };
    } catch (error) {
      console.error('Payment verification error:', error);
      throw error;
    }
  }
}

module.exports = new PaymentService();
