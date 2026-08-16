const woocommerceService = require('../services/woocommerce');

exports.createOrder = async (req, res) => {
  try {
    const orderData = req.body;
    const response = await woocommerceService.api.post('/orders', orderData);
    res.json(response.data);
  } catch (error) {
    console.error('Order creation failed:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to create order' });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const { customer } = req.query;
    const response = await woocommerceService.api.get('/orders', { params: { customer } });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await woocommerceService.api.get(`/orders/${id}`);
    res.json(response.data);
  } catch (error) {
    console.error('Order fetch by ID failed:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
};
