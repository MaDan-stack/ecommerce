import React, { useState, useEffect } from 'react';
import { getAllTestimonials, deleteTestimonial } from '../../utils/api';
import { FaTrash, FaQuoteRight } from 'react-icons/fa';
import toast from 'react-hot-toast';
import ConfirmModal from '../../components/ui/ConfirmModal';

const AdminTestimonialList = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State Modal Delete
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchTestimonials = async () => {
    setLoading(true);
    const { error, data } = await getAllTestimonials();
    if (error) {
        toast.error("Gagal memuat testimoni.");
    } else {
        setTestimonials(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  // Buka Modal Konfirmasi
  const openDeleteModal = (id) => {
    setDeleteId(id);
    setIsModalOpen(true);
  };

  // Eksekusi Hapus
  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    
    setActionLoading(true);
    const { error } = await deleteTestimonial(deleteId);
    
    if (error) {
        toast.error("Gagal menghapus testimoni.");
    } else {
        toast.success("Testimoni dihapus.");
        fetchTestimonials(); // Refresh list
    }
    
    setActionLoading(false);
    setIsModalOpen(false);
    setDeleteId(null);
  };

  if (loading) return <p className="p-8 text-center">Memuat testimoni...</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Kelola Testimoni</h1>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border dark:border-gray-700">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-200 border-b dark:border-gray-600 text-sm uppercase">
            <tr>
              <th className="p-4">User</th>
              <th className="p-4 w-1/2">Pesan Testimoni</th>
              <th className="p-4">Tanggal</th>
              <th className="p-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y dark:divide-gray-700">
            {testimonials.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                <td className="p-4">
                    <div className="flex items-center gap-3">
                        <img 
                            src={item.img || `https://ui-avatars.com/api/?name=${item.name}`} 
                            alt={item.name} 
                            className="w-10 h-10 rounded-full object-cover"
                        />
                        <span className="font-bold text-gray-800 dark:text-white">{item.name}</span>
                    </div>
                </td>
                <td className="p-4 text-sm text-gray-600 dark:text-gray-300 italic">
                    <FaQuoteRight className="inline text-orange-200 mr-2 text-xs" />
                    "{item.text}"
                </td>
                <td className="p-4 text-xs text-gray-500">
                  {new Date(item.createdAt).toLocaleDateString('id-ID')}
                </td>
                <td className="p-4 text-center">
                    <button 
                        onClick={() => openDeleteModal(item.id)}
                        className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition"
                        title="Hapus Testimoni"
                    >
                        <FaTrash />
                    </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {testimonials.length === 0 && (
            <div className="p-8 text-center text-gray-500">Belum ada testimoni.</div>
        )}
      </div>

      {/* Modal Konfirmasi */}
      <ConfirmModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Hapus Testimoni?"
        message="Testimoni ini akan dihapus permanen dari halaman utama."
        isLoading={actionLoading}
      />
    </div>
  );
};

export default AdminTestimonialList;