const express = require('express');
const router = express.Router();
const woocommerceService = require('../services/woocommerce');

// GET /api/categories
router.get('/', async (req, res) => {
  try {
    const response = await woocommerceService.api.get('/products/categories', {
      params: { per_page: 100, hide_empty: true, ...req.query }
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// GET /api/categories/:id
router.get('/:id', async (req, res) => {
  try {
    const response = await woocommerceService.api.get(`/products/categories/${req.params.id}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch category' });
  }
});

module.exports = router;
