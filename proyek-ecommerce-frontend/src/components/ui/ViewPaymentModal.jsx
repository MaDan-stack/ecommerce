import React from 'react';
import PropTypes from 'prop-types';
import { FaCheck, FaTimes, FaTimesCircle } from 'react-icons/fa';

const ViewPaymentModal = ({ isOpen, onClose, proofUrl, onApprove, onReject, isLoading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-700">
          <h3 className="font-bold text-lg text-gray-800 dark:text-white">Verifikasi Pembayaran</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-red-500 transition">
            <FaTimesCircle size={24} />
          </button>
        </div>

        {/* Image Content (Scrollable) */}
        <div className="p-4 flex-1 overflow-y-auto bg-gray-100 dark:bg-gray-900 flex justify-center items-center">
          {proofUrl ? (
            <img 
              src={proofUrl} 
              alt="Bukti Bayar" 
              className="max-w-full h-auto rounded shadow-sm border dark:border-gray-700" 
            />
          ) : (
            <p className="text-gray-500">Tidak ada bukti pembayaran.</p>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t dark:border-gray-700 flex gap-4 bg-white dark:bg-gray-800">
          <button
            onClick={onReject}
            disabled={isLoading}
            className="flex-1 flex items-center justify-center gap-2 bg-red-100 text-red-600 px-4 py-3 rounded-lg font-bold hover:bg-red-200 transition disabled:opacity-50"
          >
            <FaTimes /> Tolak (Reset)
          </button>
          
          <button
            onClick={onApprove}
            disabled={isLoading}
            className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-3 rounded-lg font-bold hover:bg-green-700 shadow-lg transition disabled:opacity-50"
          >
            {isLoading ? 'Memproses...' : <><FaCheck /> Terima (Lunas)</>}
          </button>
        </div>
      </div>
    </div>
  );
};

ViewPaymentModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  proofUrl: PropTypes.string,
  onApprove: PropTypes.func.isRequired,
  onReject: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

export default ViewPaymentModal;