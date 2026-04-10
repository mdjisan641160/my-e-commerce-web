import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { auth, db } from './firebase'; 
import { useAuthState } from 'react-firebase-hooks/auth';
import { ref, onValue, set, remove } from 'firebase/database';

// Components & Pages Import
import Navbar from './components/navbar';
import Footer from './components/Footer'; 
import Home from './pages/home';
import Signup from './pages/signup';
import Login from './pages/login';
import Cart from './pages/cart';
import Checkout from './pages/checkout';
import Success from './pages/success';
import AdminOrders from './pages/AdminOrders';
import MyOrders from './pages/MyOrders'; // ১. MyOrders ইম্পোর্ট করা হলো

const AdminRoute = ({ children }) => {
  const [user, loading] = useAuthState(auth);
  const adminEmail = "mdjubayer641160@gmail.com"; 

  if (loading) return <div className="text-center mt-20 text-xl font-bold">লগইন চেক করা হচ্ছে...</div>;

  if (user && user.email === adminEmail) {
    return children;
  } else {
    alert("আপনার এই পেজে প্রবেশের অনুমতি নেই!");
    return <Navigate to="/login" />;
  }
};

function App() {
  const [user] = useAuthState(auth);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    if (user) {
      const cartRef = ref(db, `carts/${user.uid}`);
      const unsubscribe = onValue(cartRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const cartList = Object.keys(data).map((key) => ({
            dbId: key, 
            ...data[key],
          }));
          setCart(cartList);
        } else {
          setCart([]);
        }
      });
      return () => unsubscribe();
    } else {
      setCart([]); 
    }
  }, [user]);

  const addToCart = (product) => {
    if (!user) {
      alert("কার্টে যোগ করতে আগে লগইন করুন!");
      return;
    }
    const productRef = ref(db, `carts/${user.uid}/${product.id}`);
    set(productRef, product);
  };

  const removeFromCart = (dbId) => {
    if (user) {
      const itemRef = ref(db, `carts/${user.uid}/${dbId}`);
      remove(itemRef);
    }
  };

  return (
    <Router>
      <Navbar cartCount={cart.length} />
      
      <main className="min-h-screen">
        <Routes>
          <Route path="/" element={<Home addToCart={addToCart} />} />
          <Route path="/cart" element={<Cart cartItems={cart} removeFromCart={removeFromCart} />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/success" element={<Success />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          
          {/* ২. My Orders এর জন্য নতুন রুট যোগ করা হলো */}
          <Route path="/my-orders" element={<MyOrders />} />
          
          <Route 
            path="/admin-orders" 
            element={
              <AdminRoute>
                <AdminOrders />
              </AdminRoute>
            } 
          />
        </Routes>
      </main>

      <Footer />
    </Router>
  );
}

export default App;