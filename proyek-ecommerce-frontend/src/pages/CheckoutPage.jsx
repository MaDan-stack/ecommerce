import React, { useState, useEffect } from 'react';
import { getAllOrders, updateOrderStatus } from '../../utils/api';
import { formatPrice } from '../../utils/formatters';
import { FaEye } from 'react-icons/fa'; // Hapus FaCheckCircle, FaClock (S1128)
import toast from 'react-hot-toast';
import ViewPaymentModal from '../../components/ui/ViewPaymentModal';

const AdminOrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    const { error, data } = await getAllOrders();
    // Perbaikan Logika Negasi (S7735)
    if (error) {
        toast.error("Gagal memuat data pesanan.");
    } else {
        setOrders(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleViewProof = (order) => {
    if (!order.paymentProof) {
        toast.error("User belum mengupload bukti bayar.");
        return;
    }
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleStatusUpdate = async (id, newStatus) => {
    setActionLoading(true);
    const { error } = await updateOrderStatus(id, newStatus);
    
    // Perbaikan Logika Negasi (S7735)
    if (error) {
        toast.error("Gagal update status.");
    } else {
        toast.success(`Status berhasil diubah ke: ${newStatus}`);
        setOrders((prev) => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
        setIsModalOpen(false);
    }
    setActionLoading(false);
  };

  // Helper function untuk mengatasi Nested Ternary (S3358)
  const getStatusClassName = (status) => {
    switch (status) {
        case 'awaiting_verification':
            return 'bg-orange-100 text-orange-700 border-orange-200 focus:ring-orange-300';
        case 'pending':
            return 'bg-yellow-100 text-yellow-700 border-yellow-200 focus:ring-yellow-300';
        case 'paid':
            return 'bg-blue-100 text-blue-700 border-blue-200 focus:ring-blue-300';
        case 'completed':
            return 'bg-green-100 text-green-700 border-green-200 focus:ring-green-300';
        case 'shipped': // Tambahkan case untuk shipped
             return 'bg-indigo-100 text-indigo-700 border-indigo-200 focus:ring-indigo-300';
        case 'cancelled': // Tambahkan case untuk cancelled
             return 'bg-red-100 text-red-700 border-red-200 focus:ring-red-300';     
        default:
            return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  if (loading) return <p className="p-8 text-center">Memuat pesanan...</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Kelola Pesanan</h1>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border dark:border-gray-700">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-200 border-b dark:border-gray-600 text-sm uppercase">
            <tr>
              <th className="p-4">ID</th>
              <th className="p-4">Pelanggan</th>
              <th className="p-4">Total</th>
              <th className="p-4">Bukti Bayar</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y dark:divide-gray-700">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                <td className="p-4 text-sm font-medium">#{order.id}</td>
                <td className="p-4">
                    <p className="font-bold text-gray-800 dark:text-white">{order.contactName}</p>
                    <p className="text-xs text-gray-500">{order.contactPhone}</p>
                </td>
                <td className="p-4 font-bold text-orange-500">
                  {formatPrice(order.totalAmount)}
                </td>
                
                <td className="p-4">
                    {order.paymentProof ? (
                        <button 
                            onClick={() => handleViewProof(order)}
                            className="flex items-center gap-1 text-xs bg-blue-100 text-blue-600 px-3 py-1.5 rounded-full font-bold hover:bg-blue-200 transition"
                        >
                            <FaEye /> Lihat Bukti
                        </button>
                    ) : (
                        <span className="text-xs text-gray-400 italic">Belum ada</span>
                    )}
                </td>

                <td className="p-4">
                  <div className="relative">
                    <select 
                        value={order.status}
                        onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                        // Menggunakan helper function
                        className={`appearance-none px-4 py-2 pr-8 rounded-lg text-xs font-bold uppercase cursor-pointer border focus:ring-2 focus:outline-none transition w-full ${getStatusClassName(order.status)}`}
                        disabled={actionLoading}
                    >
                        <option value="pending">Pending</option>
                        <option value="awaiting_verification">Cek Bukti</option>
                        <option value="paid">Lunas (Paid)</option>
                        <option value="shipped">Dikirim</option>
                        <option value="completed">Selesai</option>
                        <option value="cancelled">Batal</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                        ▼
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {orders.length === 0 && (
            <div className="p-8 text-center text-gray-500">Belum ada pesanan masuk.</div>
        )}
      </div>

      {selectedOrder && (
        <ViewPaymentModal 
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            proofUrl={selectedOrder.paymentProof}
            isLoading={actionLoading}
            onApprove={() => handleStatusUpdate(selectedOrder.id, 'paid')}
            onReject={() => handleStatusUpdate(selectedOrder.id, 'pending')}
        />
      )}
    </div>
  );
};

export default AdminOrderList;