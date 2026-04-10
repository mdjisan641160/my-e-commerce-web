import React from 'react';

function Home({ addToCart }) {
  // ছবির পাথগুলো এবং ডাটা যেমন ছিল তেমনই আছে
  const products = [
    { 
      id: 1, 
      name: "One Man Show ১২ মিলি (12ml)", 
      price: "820 TK", 
      img: "/images/attar-1.webp" 
    },
    { 
      id: 2, 
      name: "Cool Water ৩০ মিলি (30ml)", 
      price: "500 TK", 
      img: "/images/attar-2.webp" 
    },
    { 
      id: 3, 
      name: "Mukhallat Al Ahmar ৬ মিলি (6ml)", 
      price: "255 TK", 
      img: "/images/attar-3.webp",
    },
    { 
      id: 4, 
      name: "Tahura Nevia ১২ মিলি (12ml)", 
      price: "1250 TK", 
      img: "/images/attar-4.webp" 
    },
    { 
      id: 5, 
      name: "Oud Al Shams ৩ মিলি (3ml)", 
      price: "1499 TK", 
      img: "/images/attar-5.webp" 
    },
    { 
      id: 6,
      name: "White Musk ১০ মিলি (10ml)", 
      price: "1130 TK", 
      img: "/images/attar-6.webp" 
    },
  ];

  return (
    <div className="p-4 md:p-10 text-center bg-gray-50 min-h-screen">
      <h2 className="text-xl md:text-3xl font-bold mb-6 text-blue-700">Our Products</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 max-w-5xl mx-auto">
        {products.map((product) => (
          <div key={product.id} className="border p-3 md:p-5 rounded-2xl shadow-md hover:shadow-xl transition-all bg-white flex flex-col justify-between">
            <div>
              <img 
                src={product.img} 
                alt={product.name} 
                className="mx-auto mb-3 w-full h-40 md:h-52 object-cover rounded-xl" 
              />
              <h3 className="font-bold text-base md:text-lg text-gray-800 line-clamp-2">{product.name}</h3>
              <p className="text-blue-600 font-extrabold text-lg md:text-xl mt-1">{product.price}</p>
            </div>
            
            <button 
              onClick={() => addToCart(product)} 
              className="mt-4 w-full bg-blue-600 text-white py-2.5 rounded-xl hover:bg-blue-700 active:scale-95 transition-all font-bold text-sm md:text-base shadow-sm"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;