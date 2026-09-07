'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', role: 'student' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Load Razorpay Script Dynamically
  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleRegistrationWithPayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
    if (!res) {
      alert('Razorpay SDK failed to load. Are you online?');
      setLoading(false);
      return;
    }

    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

    try {
      // 1. Create Order on Backend (e.g., Registration Fee = ₹500)
      const orderRes = await fetch(`${apiBaseUrl}/payment/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: 500 })
      });
      const orderData = await orderRes.json();

      if (!orderData.success) throw new Error('Could not initiate payment order.');

      // 2. Open Razorpay Checkout Window
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Your public Razorpay Key
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: "TOPIQ Talent Test (TTT)",
        description: "Registration Fee Payment",
        order_id: orderData.order.id,
        handler: async function (response) {
          // 3. Verify Payment & Register User on Backend
          const verifyRes = await fetch(`${apiBaseUrl}/payment/verify-and-register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              userData: form
            })
          });

          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            // Automatically log the user in by saving the token
            localStorage.setItem('token', verifyData.token);
            localStorage.setItem('role', verifyData.role);
            
            // Redirect based on role
            if (verifyData.role === 'student') router.push('/student/dashboard');
            else router.push('/franchise/dashboard');
          } else {
            setError(verifyData.message || 'Payment verification failed.');
          }
        },
        prefill: {
          name: form.name,
          email: form.email,
          contact: form.phone,
        },
        theme: { color: "#01295A" }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (err) {
      console.error(err);
      setError('An error occurred during payment initiation.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 px-6 bg-white rounded-2xl shadow-xl mt-10">
      <h2 className="text-2xl font-bold text-[#01295A] mb-6">Register & Pay</h2>
      {error && <p className="mb-4 text-xs text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>}
      
      <form onSubmit={handleRegistrationWithPayment} className="space-y-4">
        <input type="text" placeholder="Full Name" required className="w-full px-4 py-3 border rounded-xl text-xs" 
          value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
        <input type="email" placeholder="Email Address" required className="w-full px-4 py-3 border rounded-xl text-xs" 
          value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
        <input type="tel" placeholder="Mobile Number" required className="w-full px-4 py-3 border rounded-xl text-xs" 
          value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
        <input type="password" placeholder="Password" required className="w-full px-4 py-3 border rounded-xl text-xs" 
          value={form.password} onChange={e => setForm({...form, password: e.target.value})} />

        <button type="submit" disabled={loading} className="w-full py-3 bg-[#FE7C02] text-white font-black rounded-xl text-xs shadow-md hover:bg-orange-600 transition">
          {loading ? 'Processing Payment...' : 'Pay ₹500 & Register'}
        </button>
      </form>
    </div>
  );
}