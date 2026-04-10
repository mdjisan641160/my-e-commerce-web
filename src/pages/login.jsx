import React, { useState } from 'react';
import { auth, db } from '../firebase'; // db ইম্পোর্ট করা হলো
import { signInWithEmailAndPassword } from 'firebase/auth';
import { ref, get } from 'firebase/database'; // database functions ইম্পোর্ট করা হলো
import { useNavigate } from 'react-router-dom';

function Login() {
  const [name, setName] = useState(''); // নামের জন্য স্টেট
  const [identifier, setIdentifier] = useState(''); // ইমেইল বা ফোনের জন্য স্টেট
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // ১. ডাটাবেস থেকে ইউজার চেক করা (নাম এবং ইমেইল/ফোন মিলানোর জন্য)
      const usersRef = ref(db, 'users');
      const snapshot = await get(usersRef);
      
      if (!snapshot.exists()) {
        throw new Error("User data not found in database!");
      }

      const users = snapshot.val();
      
      // নাম এবং (ইমেইল অথবা ফোন) এর সাথে মিলিয়ে ইউজার খোঁজা (সংশোধিত অংশ)
      const userFound = Object.values(users).find(u => {
        const dbName = u.name ? u.name.toLowerCase() : ""; // যদি নাম না থাকে তবে খালি রাখবে
        const inputName = name ? name.toLowerCase() : "";
        
        return (
          dbName === inputName && 
          (u.email === identifier || u.phone === identifier)
        );
      });

      if (!userFound) {
        throw new Error("আপনার দেওয়া নাম অথবা ইমেইল/ফোন নম্বরটি সঠিক নয়!");
      }

      // ২. তথ্য ঠিক থাকলে Firebase Auth দিয়ে লগইন
      await signInWithEmailAndPassword(auth, userFound.email, password);
      
      alert("Login Success! 🎉");
      navigate("/"); 
      
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">Login</h2>
        
        {/* Full Name Field */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Full Name</label>
          <input 
            type="text" 
            placeholder="Enter your name" 
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setName(e.target.value)} 
            required 
          />
        </div>

        {/* Email or Phone Field */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Email or Phone</label>
          <input 
            type="text" 
            placeholder="example@gmail.com or 017..." 
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setIdentifier(e.target.value)} 
            required 
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
          <input 
            type="password" 
            placeholder="Enter your password" 
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>

        <button 
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-bold transition duration-300"
        >
          Login
        </button>

        <p className="mt-4 text-center text-gray-600 text-sm">
          Don't have an account? <span className="text-blue-600 cursor-pointer hover:underline" onClick={() => navigate("/signup")}>Sign Up</span>
        </p>
      </form>
    </div>
  );
}

export default Login;