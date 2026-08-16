const razorpayService = require('../services/razorpay');
const woocommerceService = require('../services/woocommerce');

exports.createPaymentOrder = async (req, res) => {
  try {
    const { amount, receipt } = req.body;
    const order = await razorpayService.createOrder(amount, 'INR', receipt);
    res.json(order);
  } catch (error) {
    console.error('Razorpay Error:', error);
    res.status(500).json({ error: 'Failed to initialize payment' });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, wc_order_id } = req.body;
    
    const isValid = razorpayService.verifySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (isValid) {
      // Update WooCommerce Order status to 'processing' or 'completed'
      if (wc_order_id) {
        await woocommerceService.api.put(`/orders/${wc_order_id}`, {
          status: 'processing',
          transaction_id: razorpay_payment_id
        });
      }
      res.json({ success: true, message: 'Payment verified successfully' });
    } else {
      res.status(400).json({ error: 'Invalid payment signature' });
    }
  } catch (error) {
    console.error('Payment Verification Error:', error);
    res.status(500).json({ error: 'Failed to verify payment' });
  }
};
