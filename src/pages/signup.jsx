import React, { useState } from 'react';
import { auth, db } from '../firebase'; 
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, set } from 'firebase/database'; 
import { useNavigate } from 'react-router-dom';

function Signup() {
  const [name, setName] = useState(''); // নাম রাখার জন্য স্টেট
  const [phone, setPhone] = useState(''); // ফোন নম্বর রাখার জন্য স্টেট
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      // ইউজার তৈরি করা হচ্ছে
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // ডাটাবেসে ইউজার তথ্য সেভ করা হচ্ছে (নাম এবং ফোন সহ)
      await set(ref(db, 'users/' + user.uid), {
        name: name,
        phone: phone,
        email: email,
        createdAt: new Date().toLocaleString(),
        uid: user.uid
      });

      alert("Success! Account create hoyeche. 🎉");
      navigate('/'); 
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form onSubmit={handleSignup} className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">Create Account</h2>
        
        {/* Full Name Field */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Full Name</label>
          <input 
            type="text" 
            placeholder="Your Full Name" 
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={(e) => setName(e.target.value)} 
            required
          />
        </div>

        {/* Phone Number Field */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Phone Number</label>
          <input 
            type="text" 
            placeholder="017XXXXXXXX" 
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={(e) => setPhone(e.target.value)} 
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Email Address</label>
          <input 
            type="email" 
            placeholder="example@gmail.com" 
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={(e) => setEmail(e.target.value)} 
            required
          />
        </div>

        <div className="mb-6">
          <label className="block mb-1 font-medium">Password</label>
          <input 
            type="password" 
            placeholder="••••••••" 
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={(e) => setPassword(e.target.value)} 
            required
          />
        </div>

        <button className="w-full bg-blue-600 text-white p-3 rounded-lg font-bold hover:bg-blue-700 transition duration-300">
          Sign Up
        </button>
      </form>
    </div>
  );
}

export default Signup;