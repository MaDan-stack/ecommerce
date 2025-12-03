import React, { useState } from 'react';
import PropTypes from 'prop-types'; 
import { uploadPaymentProof } from '../../utils/api';
import toast from 'react-hot-toast';
import { FaCloudUploadAlt, FaTimes } from 'react-icons/fa';

const PaymentModal = ({ isOpen, onClose, orderId, onSuccess }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (!selectedFile.type.startsWith('image/')) {
        toast.error("Harap pilih file gambar (JPG/PNG).");
        return;
      }
      // Limit ukuran file (misal 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast.error("Ukuran file maksimal 5MB.");
        return;
      }

      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error("Silakan pilih gambar bukti transfer.");
      return;
    }

    setLoading(true);
    const result = await uploadPaymentProof(orderId, file);

    // Perbaikan Logika Negasi (S7735)
    if (result.error) {
      toast.error(result.message || "Gagal upload bukti pembayaran.");
    } else {
      toast.success("Bukti pembayaran berhasil diupload!");
      onSuccess(); // Refresh data di halaman induk
      onClose();   // Tutup modal
      setFile(null);
      setPreview('');
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100">
        
        {/* Header */}
        <div className="bg-blue-600 p-4 flex justify-between items-center text-white">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <FaCloudUploadAlt /> Upload Bukti Bayar
          </h3>
          <button onClick={onClose} className="hover:bg-white/20 p-1 rounded-full transition">
            <FaTimes />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              Silakan transfer sesuai total tagihan, lalu upload foto/screenshot bukti transfer di sini.
            </p>
            
            <label 
              htmlFor="payment-proof" 
              className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors ${
                preview ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600 hover:border-blue-400'
              }`}
            >
              {preview ? (
                <img src={preview} alt="Preview Bukti" className="max-h-48 object-contain rounded shadow-sm" />
              ) : (
                <>
                  <FaCloudUploadAlt className="text-4xl text-gray-400 mb-2" />
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Klik untuk pilih gambar</span>
                  <span className="text-xs text-gray-400 mt-1">(Max 5MB)</span>
                </>
              )}
              <input 
                id="payment-proof" 
                type="file" 
                className="hidden" 
                accept="image/*" 
                onChange={handleFileChange} 
                disabled={loading}
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={loading || !file}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
          >
            {loading ? 'Mengupload...' : 'Kirim Bukti Pembayaran'}
          </button>
        </form>
      </div>
    </div>
  );
};

PaymentModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  orderId: PropTypes.number,
  onSuccess: PropTypes.func.isRequired,
};

export default PaymentModal;