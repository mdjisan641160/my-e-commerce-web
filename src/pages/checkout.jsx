import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { db, auth } from "../firebase"; // auth ইম্পোর্ট করা হয়েছে
import { ref, push, set, onValue, remove } from "firebase/database";

function Checkout() {
  const navigate = useNavigate(); 
  const [totalToPay, setTotalToPay] = useState(0); // আসল দাম জমানোর জন্য

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    paymentMethod: 'Bkash', 
    amount: '', 
    trxID: '' 
  });

  // ডাটাবেস থেকে ইউজারের কার্টের টোটাল দাম বের করা
  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const cartRef = ref(db, `carts/${user.uid}`);
      onValue(cartRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const total = Object.values(data).reduce((acc, item) => {
            const priceNum = parseFloat(item.price.replace(/[^\d.]/g, '')) || 0;
            return acc + priceNum;
          }, 0);
          setTotalToPay(total);
        }
      });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ভ্যালিডেশন: ইনপুট করা টাকা আর কার্টের টাকা মিলছে কি না
    const enteredAmount = parseFloat(formData.amount);
    if (enteredAmount !== totalToPay) {
      alert(`ভুল টাকার পরিমাণ! আপনার কার্টের মোট দাম ${totalToPay} TK। অনুগ্রহ করে সঠিক পরিমাণ টাকা পাঠিয়ে ফর্ম পূরণ করুন।`);
      return; // টাকা না মিললে অর্ডার হবে না
    }

    try {
      const user = auth.currentUser;
      const ordersRef = ref(db, 'orders');
      const newOrderRef = push(ordersRef);

      await set(newOrderRef, {
        userId: user ? user.uid : "Guest",
        name: formData.name,
        address: String(formData.address), 
        phone: formData.phone,
        paymentMethod: formData.paymentMethod,
        amount: formData.amount, 
        trxID: formData.trxID, 
        time: new Date().toLocaleString(),
        status: "Pending" 
      });

      // অর্ডার সফল হলে ডাটাবেস থেকে ওই ইউজারের কার্ট খালি করা
      if (user) {
        await remove(ref(db, `carts/${user.uid}`));
      }
      
      localStorage.removeItem('cart');
      navigate('/success'); 

    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  return (
    <div className="p-4 md:p-10 max-w-2xl mx-auto min-h-screen bg-gray-50">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-blue-600">Payment & Checkout</h2>
      
      {/* টোটাল কত টাকা দিতে হবে সেটি দেখানোর বক্স */}
      <div className="bg-green-600 text-white p-4 mb-4 rounded-xl shadow-md text-center">
        <p className="text-lg">আপনার মোট বিল: <span className="font-bold text-2xl">{totalToPay} TK</span></p>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-xl shadow-sm">
        <h3 className="font-bold text-blue-800 mb-2 text-sm md:text-base">পেমেন্ট করার নিয়ম:</h3>
        <p className="text-xs md:text-sm text-gray-700">নিচের যেকোনো নাম্বারে টাকা পাঠিয়ে <b>TrxID</b> সংগ্রহ করুন:</p>
        <div className="mt-2 space-y-1 text-xs md:text-sm font-medium">
          <p>📱 বিকাশ (Personal): <span className="text-pink-600 font-bold">01787171252</span></p>
          <p>📱 নগদ (Personal): <span className="text-orange-600 font-bold">01787171252</span></p>
          <p>🏦 রকেট (Personal): <span className="text-blue-700 font-bold">01787171252</span></p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-5 md:p-8 shadow-xl rounded-2xl border border-gray-100">
        
        <div className="mb-4">
          <label className="block font-bold mb-1 text-sm md:text-base">Full Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full border p-2.5 rounded-xl outline-blue-500 text-sm md:text-base" />
        </div>

        <div className="mb-4">
          <label className="block font-bold mb-1 text-sm md:text-base">Shipping Address</label>
          <textarea name="address" value={formData.address} onChange={handleChange} required rows="2" className="w-full border p-2.5 rounded-xl outline-blue-500 text-sm md:text-base" placeholder="Enter full address"></textarea>
        </div>

        <div className="mb-4">
          <label className="block font-bold mb-1 text-sm md:text-base">Phone Number</label>
          <input type="text" name="phone" value={formData.phone} onChange={handleChange} required className="w-full border p-2.5 rounded-xl outline-blue-500 text-sm md:text-base font-mono" />
        </div>

        <div className="mb-4">
          <label className="block font-bold mb-1 text-red-600 text-sm md:text-base">Select Payment Method</label>
          <select 
            name="paymentMethod" 
            value={formData.paymentMethod} 
            onChange={handleChange} 
            className="w-full border p-2.5 rounded-xl bg-gray-50 outline-blue-500 font-semibold text-sm md:text-base"
          >
            <option value="Bkash">Bkash</option>
            <option value="Nagad">Nagad</option>
            <option value="Rocket">Rocket</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block font-bold mb-1 text-green-700 text-sm md:text-base">Amount (কত টাকা পাঠিয়েছেন?)</label>
          <input 
            type="number" 
            name="amount" 
            value={formData.amount} 
            onChange={handleChange} 
            placeholder={`ঠিক ${totalToPay} টাকা লিখুন`} 
            required 
            className="w-full border-2 border-green-100 p-2.5 rounded-xl outline-green-500 font-bold text-sm md:text-base"
          />
        </div>

        <div className="mb-6 bg-yellow-50 p-3 rounded-xl border border-yellow-200">
          <label className="block font-bold mb-1 text-yellow-800 text-sm md:text-base">Transaction ID (TrxID)</label>
          <input 
            type="text" 
            name="trxID" 
            value={formData.trxID} 
            onChange={handleChange} 
            placeholder="প্রাপ্ত TrxID এখানে দিন" 
            required 
            className="w-full border-2 border-yellow-400 p-2.5 rounded-xl outline-yellow-600 font-mono text-sm md:text-base"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-500 text-white py-3 md:py-4 rounded-2xl font-bold text-lg md:text-xl hover:bg-green-600 shadow-lg active:scale-95 transition-all"
        >
          Confirm Order
        </button>
      </form>
    </div>
  );
}

export default Checkout;