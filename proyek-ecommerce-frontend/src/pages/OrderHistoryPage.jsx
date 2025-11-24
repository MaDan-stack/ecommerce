import React, { useState, useEffect } from 'react';
import { getMyOrders } from '../utils/api';
import { formatPrice } from '../utils/formatters';
import { Link } from 'react-router-dom';
import ReviewModal from '../components/ui/ReviewModal'; // Import Modal

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State untuk Modal Review
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    const { error, data } = await getMyOrders();
    if (!error) {
      setOrders(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleOpenReview = (item, orderId) => {
    setSelectedProduct(item);
    setSelectedOrderId(orderId);
    setIsReviewOpen(true);
  };

  if (loading) {
    return (
      <div className="container mx-auto py-20 flex justify-center items-center min-h-[60vh]">
        <p className="text-xl text-gray-500 animate-pulse">Memuat riwayat pesanan...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-10 text-gray-900 dark:text-white">
          Riwayat Pesanan
        </h1>
        
        {orders.length === 0 ? (
           <div className="text-center py-10">
              <p className="text-gray-500 mb-4">Belum ada riwayat pesanan.</p>
              <Link to="/products" className="text-orange-500 hover:underline">Mulai Belanja</Link>
           </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 overflow-hidden">
                
                {/* Header Pesanan */}
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 flex flex-wrap justify-between items-center border-b dark:border-gray-700 gap-2">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Order ID: #{order.id}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(order.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    order.status === 'completed' ? 'bg-green-100 text-green-700' :
                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {order.status}
                  </span>
                </div>

                {/* Daftar Item */}
                <div className="p-4">
                  {order.order_items && order.order_items.map((item) => (
                    <div key={item.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 border-b dark:border-gray-700 last:border-0 gap-4">
                      <div>
                        <Link to={`/products/${item.productId}`} className="font-medium text-gray-800 dark:text-white hover:text-orange-500 transition-colors">
                          {item.productTitle}
                        </Link>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Size: {item.variantSize} | Qty: {item.quantity} | {formatPrice(item.price)}
                        </p>
                      </div>
                      
                      {/* TOMBOL ULASAN (Hanya muncul jika Completed) */}
                      {order.status === 'completed' && (
                        <button 
                          onClick={() => handleOpenReview(item, order.id)}
                          className="text-xs border border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white px-4 py-2 rounded-full transition-all duration-300 font-semibold"
                        >
                          ★ Beri Ulasan
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Footer Total */}
                <div className="p-4 bg-gray-50 dark:bg-gray-700/30 flex justify-end items-center gap-2">
                    <span className="text-sm text-gray-500">Total Pesanan:</span>
                    <span className="text-lg font-bold text-orange-500">{formatPrice(order.totalAmount)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Popup Modal Review */}
      {selectedProduct && (
        <ReviewModal 
          isOpen={isReviewOpen}
          onClose={() => setIsReviewOpen(false)}
          product={selectedProduct}
          orderId={selectedOrderId}
          onSuccess={() => {
             // Opsional: Bisa refresh order list jika mau disable tombol review setelah sukses
             // fetchOrders(); 
          }}
        />
      )}
    </div>
  );
};

export default OrderHistoryPage;