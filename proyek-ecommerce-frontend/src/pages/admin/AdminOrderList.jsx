import React, { useState, useEffect } from 'react';
import { getMyOrders } from '../utils/api';
import { formatPrice } from '../utils/formatters';
import { Link } from 'react-router-dom';
import ReviewModal from '../components/ui/ReviewModal';
import PaymentModal from '../components/ui/PaymentModal';
import { FaUpload, FaStar, FaClock, FaCheckCircle, FaPrint, FaBox } from 'react-icons/fa';

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State Modal
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedOrderIdReview, setSelectedOrderIdReview] = useState(null);

  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [selectedOrderIdPayment, setSelectedOrderIdPayment] = useState(null);

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
    setSelectedOrderIdReview(orderId);
    setIsReviewOpen(true);
  };

  const handleOpenPayment = (orderId) => {
    setSelectedOrderIdPayment(orderId);
    setIsPaymentOpen(true);
  };

  const handleSuccess = () => {
    fetchOrders();
  };

  // Helper untuk Warna Badge
  const getStatusBadge = (status) => {
    const styles = {
      completed: 'bg-green-100 text-green-700 border border-green-200',
      paid: 'bg-blue-100 text-blue-700 border border-blue-200',
      shipped: 'bg-indigo-100 text-indigo-700 border border-indigo-200',
      awaiting_verification: 'bg-orange-100 text-orange-700 border border-orange-200',
      cancelled: 'bg-red-100 text-red-700 border border-red-200',
      default: 'bg-yellow-100 text-yellow-700 border border-yellow-200'
    };
    return styles[status] || styles.default;
  };

  // Helper untuk Label Status
  const getStatusLabel = (status) => {
    if (status === 'awaiting_verification') return <><FaClock /> Menunggu Verifikasi</>;
    if (status === 'pending') return 'Belum Bayar';
    if (status === 'shipped') return <><FaBox /> Dikirim</>;
    return status;
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
                      {new Date(order.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                    {/* Tampilkan Resi jika ada */}
                    {order.trackingNumber && (
                        <p className="text-xs text-indigo-500 mt-1 font-bold">Resi: {order.trackingNumber}</p>
                    )}
                  </div>
                  
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1 ${getStatusBadge(order.status)}`}>
                    {getStatusLabel(order.status)}
                  </span>
                </div>

                {/* Daftar Item */}
                <div className="p-4">
                  {order?.order_items?.map((item) => (
                    <div key={item.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 border-b dark:border-gray-700 last:border-0 gap-4">
                      <div>
                        <Link to={`/products/${item.productId}`} className="font-medium text-gray-800 dark:text-white hover:text-orange-500 transition-colors">
                          {item.productTitle}
                        </Link>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Size: {item.variantSize} | Qty: {item.quantity} | {formatPrice(item.price)}
                        </p>
                      </div>
                      
                      {order.status === 'completed' && (
                        <button 
                          onClick={() => handleOpenReview(item, order.id)}
                          className="text-xs border border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white px-4 py-2 rounded-full transition-all duration-300 font-semibold flex items-center gap-1"
                        >
                          <FaStar /> Beri Ulasan
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Footer Actions */}
                <div className="p-4 bg-gray-50 dark:bg-gray-700/30 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="text-center sm:text-left">
                        <p className="text-xs text-gray-500 dark:text-gray-400">Total Pembayaran</p>
                        <p className="text-lg font-bold text-orange-500">{formatPrice(order.totalAmount)}</p>
                    </div>

                    {/* Group Tombol Aksi */}
                    <div className="flex flex-wrap justify-center gap-3">
                        
                        {/* Tombol Cetak Struk (Selalu Muncul) */}
                        <Link 
                            to={`/invoice/${order.id}`} 
                            target="_blank" 
                            className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-500 transition text-sm"
                        >
                            <FaPrint /> Struk
                        </Link>

                        {/* Tombol Upload (Hanya kalau Pending) */}
                        {order.status === 'pending' && (
                            <button 
                                onClick={() => handleOpenPayment(order.id)}
                                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 shadow-md transition flex items-center gap-2 text-sm"
                            >
                                <FaUpload /> Bayar
                            </button>
                        )}
                        
                        {/* Info Status Lain */}
                        {order.status === 'awaiting_verification' && (
                            <span className="text-sm text-orange-600 bg-orange-100 px-3 py-2 rounded-lg border border-orange-200 flex items-center gap-2">
                                <FaClock /> Sedang Diverifikasi
                            </span>
                        )}

                        {['paid', 'completed'].includes(order.status) && (
                            <span className="text-sm text-green-600 bg-green-100 px-3 py-2 rounded-lg border border-green-200 flex items-center gap-2">
                                <FaCheckCircle /> Lunas
                            </span>
                        )}
                    </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedProduct && (
        <ReviewModal 
          isOpen={isReviewOpen}
          onClose={() => setIsReviewOpen(false)}
          product={selectedProduct}
          orderId={selectedOrderIdReview}
          onSuccess={handleSuccess}
        />
      )}

      <PaymentModal 
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        orderId={selectedOrderIdPayment}
        onSuccess={handleSuccess}
      />
    </div>
  );
};

export default OrderHistoryPage;