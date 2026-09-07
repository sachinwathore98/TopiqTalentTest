'use client';
import { useState } from 'react';

export default function RazorpayCheckout({ amount = 50000, customerDetails = {} }) {
  const [loading, setLoading] = useState(false);

  // Load Razorpay checkout script dynamically
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setLoading(true);
    const isLoaded = await loadRazorpayScript();

    if (!isLoaded) {
      alert('Razorpay SDK failed to load. Please check your internet connection.');
      setLoading(false);
      return;
    }

    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

    try {
      // Step 1: Call backend to create order
      const orderRes = await fetch(`${apiBaseUrl}/payment/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }) // amount in paise (e.g., 50000 = ₹500)
      });
      
      const orderData = await orderRes.json();
      if (!orderData.success) {
        throw new Error(orderData.message || 'Failed to initiate order.');
      }

      // Step 2: Open Razorpay Checkout Modal
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "TOPIQ Talent Test (TTT)",
        description: "Standard Web Checkout Payment",
        order_id: orderData.order_id,
        handler: async function (response) {
          // Step 3: Send payment details to backend for signature verification
          try {
            const verifyRes = await fetch(`${apiBaseUrl}/payment/verify-payment`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              })
            });

            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              alert('Payment Successful & Verified!');
            } else {
              alert('Payment Verification Failed: ' + verifyData.message);
            }
          } catch (err) {
            console.error('Verification network error:', err);
            alert('Error verifying payment with server.');
          }
        },
        prefill: {
          name: customerDetails.name || 'Student Name',
          email: customerDetails.email || 'student@example.com',
          contact: customerDetails.phone || '9999999999',
        },
        theme: {
          color: "#01295A"
        },
        modal: {
          ondismiss: function () {
            console.log('Checkout modal closed by user');
          }
        }
      };

      const rzpInstance = new window.Razorpay(options);
      
      rzpInstance.on('payment.failed', function (response) {
        alert(`Payment Failed: ${response.error.description}`);
      });

      rzpInstance.open();

    } catch (err) {
      console.error('Checkout error:', err);
      alert(err.message || 'An error occurred during checkout.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className="px-6 py-3 bg-[#FE7C02] text-white font-black rounded-xl text-xs shadow-lg hover:bg-orange-600 transition cursor-pointer disabled:opacity-50"
    >
      {loading ? 'Initializing Checkout...' : `Pay ₹${amount / 100}`}
    </button>
  );
}