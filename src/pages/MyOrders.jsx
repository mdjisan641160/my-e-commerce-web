import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebase';
import { ref, onValue } from 'firebase/database';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; // এটি আপডেট করা হয়েছে

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const ordersRef = ref(db, 'orders');
        onValue(ordersRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            const myOrders = Object.keys(data)
              .map(key => ({ id: key, ...data[key] }))
              .filter(order => order.userId === user.uid); 
            
            setOrders(myOrders.reverse());
          } else {
            setOrders([]);
          }
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const downloadInvoice = (order) => {
    const doc = new jsPDF();

    // হেডার সেকশন
    doc.setFontSize(22);
    doc.setTextColor(37, 99, 235); 
    doc.text("E-COMMERCE SHOP", 105, 20, { align: "center" });
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("Official Invoice Receipt", 105, 28, { align: "center" });

    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text(`Invoice ID: #INV-${order.id.substring(1, 8)}`, 14, 45);
    doc.text(`Order Date: ${order.time}`, 14, 52);
    
    doc.setFont(undefined, 'bold');
    doc.text("Bill To:", 14, 65);
    doc.setFont(undefined, 'normal');
    doc.text(`Name: ${order.name}`, 14, 72);
    doc.text(`Phone: ${order.phone}`, 14, 79);
    doc.text(`Address: ${order.address}`, 14, 86);

    // অটো-টেবিল জেনারেশন (এরর ফিক্সড পদ্ধতি)
    autoTable(doc, {
      startY: 95,
      head: [['Description', 'Payment Method', 'Transaction ID', 'Total']],
      body: [
        ['Product Purchase', order.paymentMethod || "N/A", order.trxID || "N/A", `${order.amount} TK`]
      ],
      headStyles: { fillColor: [37, 99, 235], fontSize: 11 },
      theme: 'striped'
    });

    // টেবিলের পরবর্তী অবস্থান থেকে টেক্সট লেখা
    const finalY = doc.lastAutoTable.finalY;
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text(`Total Amount Paid: ${order.amount} TK`, 14, finalY + 15);
    
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(150);
    doc.text("Thank you for shopping with us!", 105, finalY + 40, { align: "center" });

    // পিডিএফ ডাউনলোড
    doc.save(`Invoice_${order.id.substring(1, 8)}.pdf`);
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      <span className="ml-3 font-bold text-blue-600 text-xl">লোড হচ্ছে...</span>
    </div>
  );

  return (
    <div className="p-4 md:p-10 max-w-4xl mx-auto min-h-screen bg-gray-50">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-blue-600 text-center">My Order History</h2>
      
      {orders.length === 0 ? (
        <div className="bg-white p-10 rounded-2xl shadow text-center border">
          <p className="text-gray-500">আপনি এখনো কোনো অর্ডার করেননি।</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <p className="text-xs text-gray-400 mb-1">Order ID: {order.id}</p>
                <h3 className="font-bold text-gray-800">পরিমাণ: {order.amount} TK</h3>
                <p className="text-sm text-gray-500">তারিখ: {order.time}</p>
                
                {order.status === "Confirmed" && (
                  <button 
                    onClick={() => downloadInvoice(order)}
                    className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-bold flex items-center gap-1 underline transition-all"
                  >
                    📥 Download Invoice
                  </button>
                )}
              </div>
              
              <div className="mt-3 md:mt-0">
                <span className={`px-4 py-1.5 rounded-full text-sm font-bold ${
                  order.status === "Pending" ? "bg-yellow-100 text-yellow-700" : 
                  order.status === "Confirmed" ? "bg-green-100 text-green-700" : 
                  order.status === "Rejected" ? "bg-red-100 text-red-700" :
                  "bg-blue-100 text-blue-700"
                }`}>
                  {order.status || "Pending"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyOrders;