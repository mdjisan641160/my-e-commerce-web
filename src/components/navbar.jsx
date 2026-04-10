import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase'; // db ইম্পোর্ট করা হলো
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { ref, onValue } from 'firebase/database'; // database functions

function Navbar() { 
  const [user, setUser] = useState(null);
  const [userCartCount, setUserCartCount] = useState(0); // নিজস্ব কার্ট কাউন্ট
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        // শুধুমাত্র লগইন করা ইউজারের নিজস্ব কার্ট পাথ থেকে ডাটা আনা হচ্ছে
        const cartRef = ref(db, `carts/${currentUser.uid}`);
        onValue(cartRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            setUserCartCount(Object.keys(data).length);
          } else {
            setUserCartCount(0);
          }
        });
      } else {
        setUserCartCount(0);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    alert("Logged Out!");
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 p-4 text-white flex flex-wrap justify-between items-center shadow-lg sticky top-0 z-50">
      
      <Link to="/" className="text-lg md:text-xl font-bold shrink-0">E-Commerce</Link>
      
      <div className="flex items-center space-x-3 md:space-x-6 mt-2 sm:mt-0">
        <Link to="/" className="hover:underline text-sm md:text-base">Home</Link>

        {/* নতুন যোগ করা হলো: লগইন করা ইউজার তার অর্ডারের হিস্ট্রি দেখতে পারবে */}
        {user && (
          <Link to="/my-orders" className="hover:underline text-sm md:text-base whitespace-nowrap">
            My Orders
          </Link>
        )}
        
        {/* সিকিউরিটি: শুধুমাত্র আপনার ইমেইল হলেই এই বাটনটি আসবে */}
        {user && user.email === "mdjubayer641160@gmail.com" && (
          <Link 
            to="/admin-orders" 
            className="text-[10px] md:text-sm bg-red-600 px-2 md:px-3 py-1 rounded font-bold hover:bg-black transition-all animate-pulse whitespace-nowrap"
          >
            Orders (Admin)
          </Link>
        )}
        
        <Link to="/cart" className="relative hover:text-yellow-300 transition-colors whitespace-nowrap">
          <span className="text-sm md:text-lg">🛒 Cart</span>
          {userCartCount > 0 && (
            <span className="absolute -top-2 -right-3 bg-red-500 text-[10px] font-bold px-1.5 py-0.5 rounded-full animate-bounce">
              {userCartCount}
            </span>
          )}
        </Link>
        
        {user ? (
          <div className="flex items-center space-x-2 md:space-x-3 border-l pl-2 md:pl-4 border-blue-400">
            <span className="hidden lg:inline text-xs text-yellow-200 font-medium max-w-[100px] truncate">
              {user.email}
            </span>
            <button 
              onClick={handleLogout} 
              className="bg-red-500 px-2 md:px-3 py-1 rounded text-xs md:text-sm hover:bg-red-600 transition-colors whitespace-nowrap"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-2 md:space-x-4 border-l pl-2 md:pl-4 border-blue-400">
            <Link to="/login" className="hover:underline text-xs md:text-sm">Login</Link>
            <Link to="/signup" className="bg-yellow-400 text-blue-900 px-2 md:px-3 py-1 rounded-lg text-xs md:text-sm font-bold hover:bg-yellow-300 whitespace-nowrap">
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;