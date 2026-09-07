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
      // 1. Create Order on Backend with Registration Fee = ₹1,100
      const orderRes = await fetch(`${apiBaseUrl}/payment/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: 1100 })
      });
      const orderData = await orderRes.json();

      if (!orderData.success) throw new Error('Could not initiate payment order.');

      // 2. Open Razorpay Checkout Window
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Your public Razorpay Key
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: "TOPIQ Talent Test (TTT)",
        description: "Registration Fee Payment (₹1,100)",
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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#01295A]">Register & Pay</h2>
        <span className="text-xs font-black bg-orange-100 text-[#FE7C02] px-3 py-1 rounded-full uppercase">Fee: ₹1,100</span>
      </div>

      {error && <p className="mb-4 text-xs text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>}
      
      <form onSubmit={handleRegistrationWithPayment} className="space-y-4">
        <div>
          <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Full Name *</label>
          <input type="text" required className="w-full px-4 py-3 border rounded-xl text-xs focus:ring-2 focus:ring-[#FE7C02] outline-none" 
            placeholder="Enter full name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
        </div>

        <div>
          <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Email Address *</label>
          <input type="email" required className="w-full px-4 py-3 border rounded-xl text-xs focus:ring-2 focus:ring-[#FE7C02] outline-none" 
            placeholder="Enter email address" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
        </div>

        <div>
          <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Mobile Number *</label>
          <input type="tel" required className="w-full px-4 py-3 border rounded-xl text-xs focus:ring-2 focus:ring-[#FE7C02] outline-none" 
            placeholder="10-digit mobile number" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
        </div>

        <div>
          <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Password *</label>
          <input type="password" required className="w-full px-4 py-3 border rounded-xl text-xs focus:ring-2 focus:ring-[#FE7C02] outline-none" 
            placeholder="Set portal password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
        </div>

        <button type="submit" disabled={loading} className="w-full py-3.5 bg-[#FE7C02] text-white font-black rounded-xl text-xs shadow-md hover:bg-orange-600 transition cursor-pointer mt-2">
          {loading ? 'Processing Payment...' : 'Pay ₹1,100 & Register'}
        </button>
      </form>
    </div>
  );
}