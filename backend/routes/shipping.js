const express = require('express');
const router = express.Router();
const shiprocketService = require('../services/shiprocket');

router.get('/track/:orderId', async (req, res) => {
  try {
    const data = await shiprocketService.trackOrder(req.params.orderId);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tracking data' });
  }
});

module.exports = router;
