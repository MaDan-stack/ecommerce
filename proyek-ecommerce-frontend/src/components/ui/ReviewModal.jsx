import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import { addReview } from '../../utils/api';
import toast from 'react-hot-toast';

const ReviewModal = ({ isOpen, onClose, product, orderId, onSuccess }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await addReview({
      productId: product.productId, // Pastikan ini sesuai dengan struktur data item order Anda
      orderId: orderId,
      rating: parseInt(rating),
      comment
    });

    if (!result.error) {
      toast.success("Ulasan berhasil dikirim!");
      onSuccess(); // Refresh data di parent
      onClose();
      setComment('');
      setRating(5);
    } else {
      toast.error(result.message || "Gagal mengirim ulasan");
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="bg-orange-500 p-4 text-white flex justify-between items-center">
          <h3 className="font-bold text-lg">Beri Ulasan Produk</h3>
          <button onClick={onClose} className="hover:bg-white/20 rounded-full p-1 px-3">✕</button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Produk:</p>
            <p className="font-semibold text-gray-800 dark:text-white truncate">{product.productTitle}</p>
          </div>

          {/* Rating Stars Input */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Rating:</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`text-3xl transition-transform hover:scale-110 ${
                    star <= rating ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                >
                  <FaStar />
                </button>
              ))}
            </div>
          </div>

          {/* Comment Input */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Komentar:</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows="3"
              className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-orange-500 outline-none"
              placeholder="Bagaimana kualitas produk ini?"
              required
            ></textarea>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              disabled={loading}
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Mengirim...' : 'Kirim Ulasan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;