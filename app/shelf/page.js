'use client';

import React, { useState } from 'react';
import PrivateRoute from '@/components/PrivateRoute';
import { MapPin, ChevronDown } from 'lucide-react';
import Layout from '../components/layout';

function ListingCard({ title, price, location, image, category }) {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
      <img src={image} alt={title} className="w-full h-48 object-cover" />
      <div className="p-4">
        <span className="inline-block px-2 py-1 bg-indigo-100 text-indigo-600 text-xs font-semibold rounded-full mb-2">
          {category}
        </span>
        <h3 className="font-semibold text-lg text-gray-800 mb-1">{title}</h3>
        <p className="text-xl font-bold text-indigo-600 mb-2">{price}</p>
        <div className="flex items-center text-sm text-gray-500">
          <MapPin className="h-4 w-4 mr-1" />
          {location}
        </div>
        <button className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-xl hover:bg-indigo-700 transition-colors">
          Contact Seller
        </button>
      </div>
    </div>
  );
}

function CustomDropdown({ label, name, options, value, onChange }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mb-4 relative">
      <label className="block text-sm text-gray-500 mb-1">{label}</label>
      <div
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between px-4 py-2 bg-white border rounded-xl shadow-sm cursor-pointer transition-all hover:shadow-md"
      >
        <span className="text-gray-700">{value || `Select ${label}`}</span>
        <ChevronDown className="h-4 w-4 text-gray-500" />
      </div>
      {open && (
        <div className="absolute z-20 bg-white w-full mt-1 rounded-xl shadow-xl overflow-hidden border animate-fadeIn max-h-52 overflow-y-auto">
          {options.map((opt) => (
            <div
              key={opt}
              onClick={() => {
                onChange({ target: { name, value: opt } });
                setOpen(false);
              }}
              className="px-4 py-2 hover:bg-indigo-50 text-sm cursor-pointer text-gray-700"
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Shelf() {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    image: '',
    preview: '',
    title: '',
    price: '',
    category: '',
    circle: '',
  });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      setFormData({ ...formData, image: file, preview });
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    console.log('Submit Listing:', formData);
    setShowModal(false);
  };

  return (
    <PrivateRoute>
    <Layout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Yana Shelf</h1>
            <p className="text-gray-500 text-sm">Buy and sell items around your circles.</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition-colors text-sm shadow-lg"
          >
            + List Item
          </button>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ListingCard
            title="Vintage Bicycle"
            price="$120"
            location="2 miles away"
            image="https://images.unsplash.com/photo-1485965120184-e220f721d03e"
            category="Sports & Leisure"
          />
          <ListingCard
            title="Garden Tools Set"
            price="$45"
            location="0.5 miles away"
            image="https://images.unsplash.com/photo-1416879595882-3373a0480b5b"
            category="Home & Garden"
          />
          <ListingCard
            title="Handmade Pottery"
            price="$75"
            location="1.5 miles away"
            image="https://images.unsplash.com/photo-1493106641515-6b5631de4bb9"
            category="Arts & Crafts"
          />
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/30 backdrop-blur-sm transition-all">
            <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 relative animate-fadeIn border border-gray-200">
              <button
                className="absolute top-3 right-4 text-gray-400 hover:text-black text-2xl"
                onClick={() => setShowModal(false)}
              >
                &times;
              </button>
              <h2 className="text-xl font-bold mb-5 text-gray-900">📦 List Your Item</h2>

              {/* Image */}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="mb-3 w-full text-sm"
              />
              {formData.preview && (
                <img
                  src={formData.preview}
                  className="h-40 w-full object-cover rounded-xl mb-4 border"
                  alt="Preview"
                />
              )}

              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Item name"
                className="w-full px-4 py-2 border rounded-xl mb-3 text-sm placeholder:text-gray-400"
              />
              <input
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Price"
                className="w-full px-4 py-2 border rounded-xl mb-3 text-sm placeholder:text-gray-400"
              />

              <CustomDropdown
                label="Category"
                name="category"
                value={formData.category}
                options={['Electronics', 'Books', 'Clothing', 'Furniture', 'Others']}
                onChange={handleChange}
              />

              <CustomDropdown
                label="Circle"
                name="circle"
                value={formData.circle}
                options={['Campus', 'Hostel Block A', 'Block B', 'Academic Zone']}
                onChange={handleChange}
              />

              <button
                onClick={handleSubmit}
                className="w-full mt-2 bg-indigo-600 text-white py-2 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition"
              >
                🚀 Submit Listing
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
    </PrivateRoute>
  );
}

export default Shelf;
