import React from 'react';
import { Link } from 'react-router-dom';

function Success() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-6 text-center">
      <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h1 className="text-4xl font-bold text-gray-800 mb-2 font-sans">Order Successful!</h1>
      <p className="text-gray-600 text-lg mb-8">Thank you for your purchase.</p>
      <Link to="/">
        <button className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all">
          Back to Home
        </button>
      </Link>
    </div>
  );
}

export default Success;