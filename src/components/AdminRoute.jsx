import React from 'react';
import { Navigate } from 'react-router-dom';
import { auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

const AdminRoute = ({ children }) => {
  const [user, loading] = useAuthState(auth);
  
  // এখানে আপনার নিজের ইমেইলটি দিন যা দিয়ে আপনি লগইন করবেন
  const adminEmail = "your-email@gmail.com"; 

  if (loading) return <div className="text-center mt-20">Loading Auth...</div>;

  if (user && user.email === adminEmail) {
    return children;
  } else {
    // যদি অ্যাডমিন না হয়, তবে লগইন পেজে পাঠিয়ে দিবে
    alert("আপনার এই পেজে প্রবেশের অনুমতি নেই!");
    return <Navigate to="/login" />;
  }
};

export default AdminRoute;