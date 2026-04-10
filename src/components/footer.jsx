import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-5 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          
          {/* শপ ইনফো */}
          <div>
            <h2 className="text-2xl font-bold text-blue-400 mb-4">E-Commerce</h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              আপনার পছন্দের সেরা আতর এবং সুগন্ধি সংগ্রহ করুন আমাদের কাছ থেকে। আমরা দিচ্ছি ১০০% খাঁটি পণ্যের নিশ্চয়তা।
            </p>
          </div>

          {/* কুইক লিঙ্কস */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">Quick Links</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link to="/" className="hover:text-blue-400 transition">Home</Link></li>
              <li><Link to="/cart" className="hover:text-blue-400 transition">Shopping Cart</Link></li>
              <li><Link to="/login" className="hover:text-blue-400 transition">Login / Register</Link></li>
            </ul>
          </div>

          {/* কন্টাক্ট সেকশন */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">Contact Us</h3>
            <div className="text-gray-400 text-sm space-y-3">
              <p className="flex items-center">
                📍 <span className="ml-2">Dhaka, Bangladesh</span>
              </p>
              <p className="flex items-center">
                📞 <span className="ml-2">01787171252</span>
              </p>
              <p className="flex items-center">
                ✉️ <span className="ml-2">mdjisan641160@gmail.com</span>
              </p>
            </div>
          </div>

        </div>

        {/* নিচের অংশ (Copyright) */}
        <div className="border-t border-gray-800 mt-10 pt-6 text-center text-gray-500 text-xs md:text-sm">
          <p>© {new Date().getFullYear()} <span className="text-blue-500 font-bold">Atar Shop</span>. All Rights Reserved.</p>
          <p className="mt-2 text-[10px] md:text-xs">Developed by Md Jubayer Jisan</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;