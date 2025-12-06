import React, { useState, useEffect } from 'react';
import { getSubscribers, deleteSubscriber } from '../../utils/api';
import { FaTrash, FaEnvelope } from 'react-icons/fa';
import toast from 'react-hot-toast';

const AdminSubscriberList = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSubscribers = async () => {
    setLoading(true);
    const { error, data } = await getSubscribers();
    if (!error) setSubscribers(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const handleDelete = async (id) => {
    if (confirm("Hapus email ini dari daftar?")) {
        const { error } = await deleteSubscriber(id);
        if (!error) {
            toast.success("Subscriber dihapus");
            fetchSubscribers();
        } else {
            toast.error("Gagal menghapus");
        }
    }
  };

  // Fungsi Copy Email ke Clipboard (Untuk memudahkan admin meng-copy semua email)
  const copyAllEmails = () => {
    const allEmails = subscribers.map(s => s.email).join(', ');
    navigator.clipboard.writeText(allEmails);
    toast.success("Semua email disalin ke clipboard!");
  };

  if (loading) return <p className="p-8 text-center">Memuat data...</p>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">List Subscriber</h1>
        {subscribers.length > 0 && (
            <button 
                onClick={copyAllEmails}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition"
            >
                Copy Semua Email
            </button>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border dark:border-gray-700">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-200 border-b dark:border-gray-600 text-sm uppercase">
            <tr>
              <th className="p-4">No</th>
              <th className="p-4">Email</th>
              <th className="p-4">Tanggal Gabung</th>
              <th className="p-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y dark:divide-gray-700">
            {subscribers.map((sub, index) => (
              <tr key={sub.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                <td className="p-4 text-sm text-gray-500">{index + 1}</td>
                <td className="p-4 font-medium text-gray-800 dark:text-white flex items-center gap-2">
                    <FaEnvelope className="text-orange-400" />
                    {sub.email}
                </td>
                <td className="p-4 text-sm text-gray-500">
                  {new Date(sub.createdAt).toLocaleDateString('id-ID')}
                </td>
                <td className="p-4 text-center">
                    <button 
                        onClick={() => handleDelete(sub.id)}
                        className="text-red-500 hover:bg-red-100 p-2 rounded transition"
                        title="Hapus"
                    >
                        <FaTrash />
                    </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {subscribers.length === 0 && (
            <div className="p-10 text-center text-gray-500 italic">
                Belum ada yang subscribe newsletter.
            </div>
        )}
      </div>
    </div>
  );
};

export default AdminSubscriberList;