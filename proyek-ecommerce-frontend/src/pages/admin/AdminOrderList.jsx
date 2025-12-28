import React, { useState, useEffect } from 'react';
import { getAllOrders, updateOrderStatus } from '../../utils/api';
import { formatPrice } from '../../utils/formatters';
import { FaEye, FaChevronLeft, FaChevronRight, FaPrint } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import ViewPaymentModal from '../../components/ui/ViewPaymentModal';

const AdminOrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  
  // State Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // State Modal Verifikasi
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = async (pageNumber) => {
    setLoading(true);
    const { error, data, pagination } = await getAllOrders(pageNumber);
    
    if (error) {
        toast.error("Gagal memuat data pesanan.");
    } else {
        setOrders(data);
        if (pagination) {
            setTotalPages(pagination.totalPages);
        }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders(page);
  }, [page]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
        setPage(newPage);
    }
  };

  const handleViewProof = (order) => {
    if (order.paymentProof) {
        setSelectedOrder(order);
        setIsModalOpen(true);
    } else {
        toast.error("User belum mengupload bukti bayar.");
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    let trackingNumber = null;

    // --- FITUR: Input Resi jika Shipped ---
    if (newStatus === 'shipped') {
        trackingNumber = globalThis.prompt("Masukkan Nomor Resi Pengiriman:");
        if (!trackingNumber) return; // Batal jika kosong
    }
    // --------------------------------------

    setActionLoading(true);
    const { error } = await updateOrderStatus(id, newStatus, trackingNumber);
    
    if (error) {
        toast.error("Gagal update status.");
    } else {
        toast.success(`Status berhasil diubah ke: ${newStatus}`);
        fetchOrders(page);
        setIsModalOpen(false);
    }
    setActionLoading(false);
  };

  const getStatusClassName = (status) => {
    const statusStyles = {
      awaiting_verification: 'bg-orange-100 text-orange-700 border-orange-200 focus:ring-orange-300',
      pending: 'bg-yellow-100 text-yellow-700 border-yellow-200 focus:ring-yellow-300',
      paid: 'bg-blue-100 text-blue-700 border-blue-200 focus:ring-blue-300',
      completed: 'bg-green-100 text-green-700 border-green-200 focus:ring-green-300',
      shipped: 'bg-indigo-100 text-indigo-700 border-indigo-200 focus:ring-indigo-300',
      cancelled: 'bg-red-100 text-red-700 border-red-200 focus:ring-red-300',
    };
    return statusStyles[status] || 'bg-gray-100 text-gray-700 border-gray-200';
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
              <th className="p-4">Status & Aksi</th>
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

                <td className="p-4 flex flex-col gap-3">
                  <div className="relative">
                    <select 
                        value={order.status}
                        onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
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

                  {/* Tombol Cetak Struk */}
                  <Link 
                    to={`/invoice/${order.id}`} 
                    target="_blank" 
                    className="text-xs flex items-center justify-center gap-2 bg-gray-200 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-300 transition font-semibold"
                  >
                    <FaPrint /> Cetak Struk
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {orders.length === 0 && (
            <div className="p-8 text-center text-gray-500">Belum ada pesanan masuk.</div>
        )}
      </div>

      {/* --- CONTROLS PAGINATION --- */}
      <div className="flex justify-between items-center mt-6">
          <span className="text-sm text-gray-500 dark:text-gray-400">
              Halaman {page} dari {totalPages}
          </span>
          
          <div className="flex gap-2">
              <button 
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className="px-4 py-2 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-1"
              >
                  <FaChevronLeft /> Sebelumnya
              </button>
              <button 
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
                  className="px-4 py-2 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-1"
              >
                  Selanjutnya <FaChevronRight />
              </button>
          </div>
      </div>

      {/* --- MODAL VERIFIKASI --- */}
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