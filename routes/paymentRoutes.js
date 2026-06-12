const express = require('express');
const router = express.Router();

// 1. Import controller functions (using exact casing exported in your file)
const {
    initiatePayment,
    verifyPayment,
    getMyPayments
} = require('../controllers/paymentController');

// 2. FIX: Destructure the named 'protect' function from the middleware module
const { protect } = require('../middlewares/authMiddleware');

// 3. Protected routes with valid function handlers
router.post('/initiate', protect, initiatePayment);
router.get('/verify/:reference', protect, verifyPayment);
router.get('/my-payments', protect, getMyPayments);

module.exports = router;