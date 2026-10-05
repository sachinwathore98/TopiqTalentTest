'use client';
import React, { useState } from 'react';
import { Upload, Sparkles, CheckCircle, Loader2 } from 'lucide-react';

export default function BannersManager({ onBannerAdded }) {
  const [title, setTitle] = useState('');
  const [position, setPosition] = useState('hero');
  const [targetLink, setTargetLink] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  let rawApiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://topiq-talent-test.onrender.com';
  const apiBaseUrl = rawApiUrl.replace(/\/api\/?$/, '').replace(/\/$/, '');

  // Handle file selection and preview
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) {
      alert('Please select an image file to upload.');
      return;
    }

    setLoading(true);
    setSuccessMsg('');

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('position', position);
      formData.append('targetLink', targetLink);
      formData.append('image', imageFile); // Attached as file for Cloudinary upload middleware

      const res = await fetch(`${apiBaseUrl}/api/superadmin/banners`, {
        method: 'POST',
        body: formData, // FormData automatically sets multipart headers
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMsg('Banner uploaded and saved to Cloudinary successfully!');
        setTitle('');
        setTargetLink('');
        setImageFile(null);
        setImagePreview(null);
        if (onBannerAdded) onBannerAdded();
      } else {
        alert(data.message || 'Failed to upload banner');
      }
    } catch (err) {
      console.error('Error uploading banner:', err);
      alert('Server error during upload');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-lg font-black text-[#01295A] tracking-tight flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#FE7C02]" /> Upload Website Advertisements & Banners
        </h2>
        <p className="text-xs text-slate-500 font-medium mt-1">
          Select an image file from your device. It will upload directly to Cloudinary and publish live.
        </p>
      </div>

      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl text-xs font-bold flex items-center gap-2 animate-fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          {successMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* BANNER TITLE */}
        <div className="space-y-1.5">
          <label className="text-xs font-black uppercase text-[#01295A] tracking-wider">Banner Title *</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Maharashtra Edition Launch Banner"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-[#01295A] focus:outline-none focus:border-[#FE7C02] transition font-medium"
          />
        </div>

        {/* FILE UPLOAD INPUT INSTEAD OF IMAGE URL */}
        <div className="space-y-1.5">
          <label className="text-xs font-black uppercase text-[#01295A] tracking-wider">Upload Banner Image File *</label>
          <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center hover:border-[#FE7C02] transition bg-slate-50 relative group cursor-pointer">
            <input
              type="file"
              required
              accept="image/*"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            {imagePreview ? (
              <div className="space-y-3">
                <div className="relative aspect-video max-w-sm mx-auto rounded-xl overflow-hidden shadow-md">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                </div>
                <span className="text-xs font-bold text-[#FE7C02]">Click or drag to replace image</span>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center mx-auto text-slate-600 group-hover:bg-[#FE7C02] group-hover:text-white transition">
                  <Upload className="w-5 h-5" />
                </div>
                <div className="text-xs font-black text-[#01295A]">Click to browse or drag and drop image</div>
                <div className="text-[10px] text-slate-400 font-medium">PNG, JPG, WEBP up to 10MB</div>
              </div>
            )}
          </div>
        </div>

        {/* POSITION & TARGET LINK */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase text-[#01295A] tracking-wider">Display Position & Website Location *</label>
            <select
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-[#01295A] focus:outline-none focus:border-[#FE7C02] transition font-medium cursor-pointer"
            >
              <option value="hero">Hero Slider / Marquee Spotlight</option>
              <option value="popup">Popup Announcement Modal</option>
              <option value="festive_offer">Festive / Flash Offer Bar</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase text-[#01295A] tracking-wider">Target Link (Optional)</label>
            <input
              type="text"
              value={targetLink}
              onChange={(e) => setTargetLink(e.target.value)}
              placeholder="/register or https://..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-[#01295A] focus:outline-none focus:border-[#FE7C02] transition font-medium"
            />
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#FE7C02] hover:bg-[#e06d02] text-white py-3.5 rounded-xl font-black text-xs uppercase tracking-wider transition cursor-pointer shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Uploading to Cloudinary...
            </>
          ) : (
            'Publish Advertisement Live'
          )}
        </button>

      </form>
    </div>
  );
}