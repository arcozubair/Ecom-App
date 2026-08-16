const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/orders');

router.post('/', ordersController.createOrder);
router.get('/', ordersController.getOrders);
router.get('/:id', ordersController.getOrderById);

module.exports = router;
