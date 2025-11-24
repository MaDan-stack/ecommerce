import React, { useState, useEffect } from 'react';
import { getAllReviewsAdmin, deleteReview } from '../../utils/api';
import { FaTrash, FaStar } from 'react-icons/fa';

const AdminReviewList = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    setLoading(true);
    const { error, data } = await getAllReviewsAdmin();
    if (!error) {
      setReviews(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDelete = async (id) => {
    if (confirm("Yakin ingin menghapus ulasan ini? Rating produk akan dihitung ulang.")) {
      const { error } = await deleteReview(id);
      if (!error) {
        fetchReviews(); // Refresh data
      }
    }
  };

  if (loading) return <p className="p-8 text-center">Memuat ulasan...</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Moderasi Ulasan</h1>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border dark:border-gray-700">
        {reviews.length === 0 ? (
            <p className="p-8 text-center text-gray-500">Belum ada ulasan masuk.</p>
        ) : (
            <table className="w-full text-left">
            <thead className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-200 border-b dark:border-gray-600">
                <tr>
                <th className="p-4">User</th>
                <th className="p-4">Produk</th>
                <th className="p-4">Rating</th>
                <th className="p-4 w-1/3">Komentar</th>
                <th className="p-4">Aksi</th>
                </tr>
            </thead>
            <tbody className="divide-y dark:divide-gray-700">
                {reviews.map((review) => (
                <tr key={review.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="p-4">
                        <p className="font-bold text-sm">{review.user ? review.user.name : 'Deleted User'}</p>
                        <p className="text-xs text-gray-500">{review.user ? review.user.email : ''}</p>
                    </td>
                    <td className="p-4 text-sm">{review.product ? review.product.title : 'Deleted Product'}</td>
                    <td className="p-4">
                        <div className="flex text-yellow-400 text-xs">
                            {[...Array(review.rating)].map((_, i) => <FaStar key={i} />)}
                        </div>
                    </td>
                    <td className="p-4 text-sm italic text-gray-600 dark:text-gray-300">"{review.comment}"</td>
                    <td className="p-4">
                        <button 
                            onClick={() => handleDelete(review.id)}
                            className="text-red-500 hover:bg-red-100 p-2 rounded transition"
                            title="Hapus Review"
                        >
                            <FaTrash />
                        </button>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        )}
      </div>
    </div>
  );
};

export default AdminReviewList;