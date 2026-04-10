import React from 'react';
import { Link } from 'react-router-dom';

function Cart({ cartItems, removeFromCart }) {
  // $ বা TK যাই থাকুক না কেন, নাম্বার বের করে টোটাল হিসাব করার জন্য লজিক
  const totalPrice = cartItems.reduce((total, item) => {
    // এখানে দাম থেকে শুধু সংখ্যা বের করা হচ্ছে
    const priceNum = typeof item.price === 'string' 
      ? parseFloat(item.price.replace(/[^\d.]/g, '')) 
      : item.price;
    return total + (priceNum || 0);
  }, 0);

  return (
    // মোবাইলে p-4 এবং বড় স্ক্রিনে p-10 করা হয়েছে
    <div className="p-4 md:p-10 max-w-4xl mx-auto min-h-screen">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-blue-600 text-center md:text-left">Your Shopping Cart</h2>
      
      {cartItems.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed rounded-xl bg-gray-50">
           <p className="text-gray-500 text-lg">
             Your cart is empty. Start shopping! 🛒
           </p>
           <Link to="/" className="text-blue-600 font-bold mt-4 inline-block hover:underline">Go Back to Shop</Link>
        </div>
      ) : (
        <div className="bg-white shadow-xl rounded-2xl p-4 md:p-6 border">
          {cartItems.map((item, index) => (
            <div key={index} className="flex justify-between items-center border-b py-4 gap-2">
              <div className="flex items-center space-x-3 md:space-x-4">
                {/* ছবি এবং নাম শুধু ওই ইউজারের জন্যই লোড হবে */}
                <img src={item.img} alt={item.name} className="w-14 h-14 md:w-20 md:h-20 rounded-lg object-cover flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-sm md:text-lg leading-tight line-clamp-1">{item.name}</h3>
                  <p className="text-blue-600 font-semibold text-sm md:text-base">{item.price}</p>
                </div>
              </div>
              
              <button 
                onClick={() => removeFromCart(item.id || index)} // UID অনুযায়ী ডিলিট করার জন্য item.id ব্যবহার করা ভালো
                className="bg-red-50 text-red-600 px-2 py-1 md:px-3 md:py-1.5 rounded-lg hover:bg-red-600 hover:text-white transition-all text-xs md:text-sm font-medium border border-red-200"
              >
                Remove
              </button>
            </div>
          ))}
          
          <div className="mt-6 flex justify-between items-center border-t pt-4 px-2">
            <h3 className="text-xl md:text-2xl font-bold text-gray-800">Total:</h3>
            <span className="text-xl md:text-2xl font-bold text-green-600">{totalPrice.toLocaleString()} TK</span>
          </div>
          
          <Link to="/checkout">
            <button className="w-full mt-8 bg-blue-600 text-white py-3 md:py-4 rounded-xl font-bold text-base md:text-lg hover:bg-blue-700 active:scale-95 transition-all shadow-lg">
              Proceed to Checkout
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default Cart;