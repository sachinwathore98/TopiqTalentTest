const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');

// Initialize Razorpay with server-side secrets
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// 1. BACKEND: Create Order Endpoint
router.post('/create-order', async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt } = req.body;
    
    // Validate minimum amount requirement (100 paise = ₹1)
    if (!amount || parseInt(amount, 10) < 100) {
      return res.status(400).json({ success: false, message: 'Amount must be at least 100 paise.' });
    }

    const options = {
      amount: parseInt(amount, 10),
      currency,
      receipt: receipt || `receipt_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);
    
    return res.status(200).json({
      success: true,
      order_id: order.id,
      amount: order.amount,
      currency: order.currency
    });
  } catch (error) {
    console.error('Razorpay Order Creation Error:', error);
    if (error.statusCode === 401) {
      return res.status(401).json({ success: false, message: 'Razorpay authentication failed.' });
    }
    return res.status(500).json({ success: false, message: 'Internal Server Error while creating order.' });
  }
});

// 2. BACKEND: Verify Signature Endpoint
router.post('/verify-payment', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Missing required payment verification parameters.' });
    }

    // Compute HMAC-SHA256 signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    // Secure comparison
    if (expectedSignature === razorpay_signature) {
      // Signature matches: Safe to mark order as paid in database
      return res.status(200).json({ success: true, message: 'Payment verified successfully.' });
    } else {
      // Mismatch: Do NOT mark as paid
      return res.status(400).json({ success: false, message: 'Invalid payment signature. Verification failed.' });
    }
  } catch (error) {
    console.error('Razorpay Signature Verification Error:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error during verification.' });
  }
});

module.exports = router;