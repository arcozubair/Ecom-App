const woocommerceService = require('../services/woocommerce');

exports.getProducts = async (req, res) => {
  try {
    // Support: page, per_page, search, category, min_price, max_price, order, orderby, featured
    const allowed = ['page', 'per_page', 'search', 'category', 'min_price', 'max_price', 'order', 'orderby', 'featured'];
    const params = {};
    allowed.forEach(key => { if (req.query[key] !== undefined) params[key] = req.query[key]; });

    const products = await woocommerceService.getProducts(params);
    res.json(products);
  } catch (error) {
    console.error('Products fetch error:', error.message);
    res.status(500).json({ error: 'Failed to fetch products from WooCommerce' });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const response = await woocommerceService.api.get(`/products/${req.params.id}`);
    res.json(response.data);
  } catch (error) {
    console.error('Product fetch error:', error.message);
    res.status(404).json({ error: 'Product not found' });
  }
};
