import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebase'; 
import { ref, onValue, remove, update } from 'firebase/database';
import toast, { Toaster } from 'react-hot-toast';

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [usersCount, setUsersCount] = useState(0); 
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [searchTerm, setSearchTerm] = useState(""); 
  const [statusFilter, setStatusFilter] = useState("All");

  // ১. নতুন স্টেট: পাসওয়ার্ড ভেরিফিকেশন এবং ডার্ক মোড
  const [passVerified, setPassVerified] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem('admin-theme') === 'dark'
  );

  const adminEmail = "mdjubayer641160@gmail.com"; 
  const adminSecretPassword = "MM777aa"; // <--- আপনার পাসওয়ার্ডটি এখানে পরিবর্তন করতে পারেন

  // ২. থিম পরিবর্তনের ইফেক্ট
  useEffect(() => {
    const html = document.querySelector('html');
    if (isDarkMode) {
      html.setAttribute('data-theme', 'dark'); 
      localStorage.setItem('admin-theme', 'dark');
    } else {
      html.setAttribute('data-theme', 'light');
      localStorage.setItem('admin-theme', 'light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (user && user.email === adminEmail) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    });

    const ordersRef = ref(db, 'orders');
    const usersRef = ref(db, 'users'); 

    const unsubscribeOrders = onValue(ordersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const orderList = Object.entries(data).map(([id, details]) => ({
          id,
          ...details
        }));
        setOrders(orderList.reverse());

        const revenue = orderList
          .filter(order => order.status === "Confirmed")
          .reduce((sum, order) => sum + (parseFloat(order.amount) || 0), 0);
        setTotalRevenue(revenue);
      } else {
        setOrders([]);
        setTotalRevenue(0);
      }
      setLoading(false);
    });

    const unsubscribeUsers = onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const count = Object.keys(data).length;
        setUsersCount(count);
      } else {
        setUsersCount(0);
      }
    });

    return () => {
      unsubscribeAuth();
      unsubscribeOrders();
      unsubscribeUsers();
    };
  }, []);

  // ৩. পাসওয়ার্ড চেক করার ফাংশন
  const handleUnlock = () => {
    const userInput = prompt("অ্যাডমিন সিক্রেট পাসওয়ার্ড দিন:");
    if (userInput === adminSecretPassword) {
      setPassVerified(true);
      toast.success("অ্যাক্সেস অনুমোদিত!");
    } else if (userInput !== null) {
      toast.error("ভুল পাসওয়ার্ড!");
    }
  };

  const updateStatus = (id, newStatus) => {
    const orderRef = ref(db, `orders/${id}`);
    update(orderRef, { status: newStatus })
      .then(() => {
        toast.success(`অর্ডারটি সফলভাবে ${newStatus === "Confirmed" ? "Confirm" : "Reject"} করা হয়েছে!`);
      })
      .catch((err) => {
        console.error("Status update error:", err);
        toast.error("কিছু একটা সমস্যা হয়েছে!");
      });
  };

  const deleteOrder = (id) => {
    if (window.confirm("অর্ডারটি মুছে ফেলতে চান?")) {
      remove(ref(db, `orders/${id}`))
        .then(() => toast.success("সাফল্যের সাথে ডিলিট হয়েছে!"))
        .catch((err) => {
          console.error("ডিলিট করতে সমস্যা:", err);
          toast.error("ডিলিট করতে সমস্যা হয়েছে!");
        });
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      order.phone?.includes(searchTerm) ||
      order.id?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || (order.status || "Pending") === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  // ৪. ইমেইল ভেরিফিকেশন চেক
  if (!isAdmin) {
    return <div className="text-center p-20 text-red-600 font-bold">আপনার এই পেজ দেখার অনুমতি নেই।</div>;
  }

  // ৫. পাসওয়ার্ড ভেরিফিকেশন চেক (পাসওয়ার্ড না দিলে এটি দেখাবে)
  if (!passVerified) {
    return (
      <div className={`flex flex-col justify-center items-center min-h-screen transition-all ${isDarkMode ? 'bg-[#0f172a]' : 'bg-gray-100'}`}>
        <Toaster position="top-right" />
        <div className={`p-10 rounded-3xl shadow-2xl text-center border-2 transition-all ${isDarkMode ? 'bg-slate-800 border-blue-500' : 'bg-white border-white'}`}>
          <div className="text-6xl mb-4">🔐</div>
          <h2 className={`text-2xl font-black mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Admin Security</h2>
          <p className="text-gray-500 mb-6 text-sm">প্যানেলটি আনলক করতে আপনার সিক্রেট কোড দিন</p>
          <button 
            onClick={handleUnlock}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold shadow-lg transition-all transform hover:scale-105"
          >
            Unlock Panel
          </button>
        </div>
      </div>
    );
  }

  // ৬. সব ঠিক থাকলে মূল অ্যাডমিন প্যানেল
  return (
    <div className={`p-5 md:p-10 min-h-screen transition-all duration-300 ${isDarkMode ? 'bg-[#0f172a]' : 'bg-gray-50'}`}>
      <Toaster position="top-right" reverseOrder={false} /> 
      
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 max-w-6xl mx-auto gap-4">
        <h2 className={`text-3xl font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-700'}`}>Admin Panel - Manage Orders</h2>
        
        <button 
          onClick={() => setIsDarkMode(!isDarkMode)}
          className={`px-4 py-2 rounded-full font-bold shadow-md transition-all flex items-center gap-2 ${
            isDarkMode ? 'bg-yellow-400 text-black hover:bg-yellow-300' : 'bg-slate-800 text-white hover:bg-slate-700'
          }`}
        >
          {isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Revenue", val: `${totalRevenue} TK`, color: "border-blue-600" },
          { label: "Confirmed Orders", val: orders.filter(o => o.status === "Confirmed").length, color: "border-green-500" },
          { label: "Pending Orders", val: orders.filter(o => !o.status || o.status === "Pending").length, color: "border-yellow-500" },
          { label: "Total Users", val: usersCount, color: "border-purple-500" }
        ].map((card, idx) => (
          <div key={idx} className={`p-6 rounded-2xl shadow-sm border-l-4 ${card.color} ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">{card.label}</p>
            <h3 className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{card.val}</h3>
          </div>
        ))}
      </div>

      <div className={`flex flex-col md:flex-row gap-4 mb-8 p-4 rounded-xl shadow-sm border max-w-4xl mx-auto ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'}`}>
        <div className="flex-1">
          <input 
            type="text" 
            placeholder="নাম, ফোন বা আইডি দিয়ে খুঁজুন..." 
            className={`w-full p-3 rounded-xl border focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400' : 'bg-white border-gray-300'}`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full md:w-48">
          <select 
            className={`w-full p-3 rounded-xl border focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium transition-all ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300'}`}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className={`text-center p-10 rounded-xl shadow-md border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-gray-400' : 'bg-white border-gray-200 text-gray-600'}`}>
          <p className="text-xl">কোনো অর্ডার খুঁজে পাওয়া যায়নি!</p>
        </div>
      ) : (
        <div className={`overflow-x-auto shadow-xl rounded-xl border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
          <table className="table w-full border-collapse">
            <thead>
              <tr className={`${isDarkMode ? 'bg-slate-700 text-blue-300' : 'bg-blue-600 text-white'} text-left`}>
                <th className="p-4 text-xs md:text-sm font-bold uppercase">Customer</th>
                <th className="p-4 text-xs md:text-sm font-bold uppercase">Contact & Address</th>
                <th className="p-4 text-xs md:text-sm text-center font-bold uppercase">Status</th>
                <th className="p-4 text-xs md:text-sm font-bold uppercase">Amount/TrxID</th>
                <th className="p-4 text-center text-xs md:text-sm font-bold uppercase">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className={`border-b transition-all ${isDarkMode ? 'border-slate-700 hover:bg-slate-700/50 text-gray-300' : 'border-gray-100 hover:bg-blue-50 text-gray-800'}`}>
                  <td className="p-4">
                    <p className="font-bold">{order.name || "Unknown"}</p>
                    <p className="text-[10px] opacity-60 italic">{order.time}</p>
                  </td>
                  <td className="p-4">
                    <p className={`font-semibold text-sm ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>{order.phone}</p>
                    <p className="text-[10px] opacity-70 max-w-xs break-words">{order.address}</p>
                  </td>
                  <td className="p-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase shadow-sm ${
                      order.status === 'Confirmed' ? 'bg-green-100 text-green-700' : 
                      order.status === 'Rejected' ? 'bg-red-100 text-red-700' : 
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {order.status || "Pending"}
                    </span>
                  </td>
                  <td className="p-4">
                    <p className="font-bold text-green-500 text-sm">{order.amount || 0} TK</p>
                    <p className="text-[10px] opacity-50 font-mono">{order.trxID || "No ID"}</p>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col gap-2 items-center">
                      <div className="flex gap-1 w-full">
                        <button onClick={() => updateStatus(order.id, "Confirmed")} className="flex-1 bg-green-500 hover:bg-green-600 text-white py-1.5 rounded text-[10px] font-bold shadow-sm transition-all">Confirm</button>
                        <button onClick={() => updateStatus(order.id, "Rejected")} className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-1.5 rounded text-[10px] font-bold shadow-sm transition-all">Reject</button>
                      </div>
                      <button onClick={() => deleteOrder(order.id)} className="w-full bg-red-600 hover:bg-red-800 text-white py-1.5 rounded text-[10px] font-bold transition-all shadow-md">Delete Permanent</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminOrders;