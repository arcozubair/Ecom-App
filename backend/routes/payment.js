const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment');

router.post('/create', paymentController.createPaymentOrder);
router.post('/verify', paymentController.verifyPayment);

module.exports = router;
