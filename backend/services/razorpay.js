const Razorpay = require('razorpay');
const crypto = require('crypto');

class RazorpayService {
  constructor() {
    // Will initialize on demand to ensure env vars are loaded
  }

  get instance() {
    if (!this._instance) {
      this._instance = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
      });
    }
    return this._instance;
  }

  async createOrder(amount, currency = 'INR', receipt) {
    return this.instance.orders.create({
      amount: amount * 100, // Amount in paise
      currency,
      receipt,
    });
  }

  verifySignature(orderId, paymentId, signature) {
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(orderId + '|' + paymentId)
      .digest('hex');
    
    return generatedSignature === signature;
  }
}

module.exports = new RazorpayService();
