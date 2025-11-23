import React, { useState, useEffect } from 'react';
import { getMyOrders } from '../utils/api';
import { formatPrice } from '../utils/formatters';
import { Link } from 'react-router-dom';

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const { error, data } = await getMyOrders();
      if (!error) {
        setOrders(data);
      }
      setLoading(false);
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto py-20 flex justify-center items-center min-h-[60vh]">
        <p className="text-xl text-gray-500 animate-pulse">Memuat riwayat pesanan...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container mx-auto py-20 flex flex-col justify-center items-center text-center min-h-[60vh]">
        <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Belum Ada Pesanan</h1>
        <p className="text-gray-500 mb-6">Anda belum pernah melakukan transaksi.</p>
        <Link to="/products" className="bg-orange-500 text-white px-6 py-2 rounded-full hover:bg-orange-600 transition shadow-md">
          Mulai Belanja
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      {/* PERBAIKAN: Tambahkan 'mx-auto' dan 'px-4' */}
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-10 text-gray-900 dark:text-white">
          Riwayat Pesanan
        </h1>
        
        {/* Kontainer kartu pesanan juga dipusatkan dengan max-w-4xl dan mx-auto */}
        <div className="max-w-4xl mx-auto space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 overflow-hidden transition hover:shadow-md">
              {/* Header Pesanan */}
              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 flex flex-wrap justify-between items-center border-b dark:border-gray-700 gap-2">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Order ID: #{order.id}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(order.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  order.status === 'pending' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                  order.status === 'paid' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                  order.status === 'shipped' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' :
                  order.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                  'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                }`}>
                  {order.status}
                </span>
              </div>

              {/* Daftar Barang */}
              <div className="p-4">
                {order.order_items && order.order_items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center py-3 border-b dark:border-gray-700 last:border-0">
                    <div>
                      <p className="font-medium text-gray-800 dark:text-white text-sm sm:text-base">{item.productTitle}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Size: {item.variantSize} | Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Footer Pesanan */}
              <div className="p-4 bg-gray-50 dark:bg-gray-700/30 flex justify-between items-center">
                  <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Total Pembayaran</p>
                      <p className="text-lg font-bold text-orange-500">{formatPrice(order.totalAmount)}</p>
                  </div>
                  {/* Tombol aksi bisa ditambahkan di sini nanti */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderHistoryPage;