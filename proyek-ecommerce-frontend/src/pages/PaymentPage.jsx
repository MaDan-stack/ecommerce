import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMyOrders, uploadPaymentProof, getPaymentMethods } from '../utils/api'; 
import { formatPrice } from '../utils/formatters';
import toast from 'react-hot-toast';
import { FaCopy, FaCloudUploadAlt, FaCheckCircle, FaArrowLeft } from 'react-icons/fa';

const PaymentPage = () => {
  const { id } = useParams(); // Ambil Order ID dari URL
  const navigate = useNavigate();
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const [methods, setMethods] = useState([]); // State untuk metode pembayaran

  useEffect(() => {
    const initData = async () => {
      // 1. Ambil Order
      const orderRes = await getMyOrders();
      // Perbaikan S7735: Membalik logika if
      if (orderRes.error) {
          toast.error("Gagal memuat pesanan");
          navigate('/orders');
          return;
      }
      
      // Perbaikan S7773: Gunakan Number.parseInt
      const foundOrder = orderRes.data.find(o => o.id === Number.parseInt(id, 10));
      
      if (foundOrder) {
          setOrder(foundOrder);
      } else {
          toast.error("Pesanan tidak ditemukan");
          navigate('/orders');
          return;
      }
      
      // 2. Ambil Metode Pembayaran
      const methodsRes = await getPaymentMethods();
      if (!methodsRes.error) {
        setMethods(methodsRes.data);
      }
      
      setLoading(false);
    };
    initData();
  }, [id, navigate]);

  // Handler Copy Rekening
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Disalin ke clipboard!");
  };

  // Handler File
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
        if (!selectedFile.type.startsWith('image/')) {
            toast.error("File harus gambar.");
            return;
        }
        // Validasi ukuran (opsional, misal 5MB)
        if (selectedFile.size > 5 * 1024 * 1024) {
            toast.error("Ukuran file maksimal 5MB.");
            return;
        }
        setFile(selectedFile);
        setPreview(URL.createObjectURL(selectedFile));
    }
  };

  // Handler Upload
  const handleUpload = async () => {
    if (!file) return toast.error("Pilih bukti bayar dulu.");
    
    setUploading(true);
    const result = await uploadPaymentProof(id, file);
    
    // Perbaikan S7735: Membalik logika if
    if (result.error) {
        toast.error(result.message || "Gagal upload.");
    } else {
        toast.success("Bukti pembayaran terkirim!");
        navigate('/orders');
    }
    setUploading(false);
  };

  if (loading) return <div className="p-10 text-center min-h-screen flex items-center justify-center">Memuat data pembayaran...</div>;
  if (!order) return null;

  // Filter Bank & QRIS dari state methods
  const banks = methods.filter(m => m.type === 'bank');
  const qris = methods.filter(m => m.type === 'qris');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Tombol Kembali */}
        <button onClick={() => navigate('/orders')} className="flex items-center gap-2 text-gray-500 mb-6 hover:text-orange-500 transition">
            <FaArrowLeft /> Kembali ke Riwayat
        </button>

        <h1 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white">Selesaikan Pembayaran</h1>
        <p className="text-gray-500 mb-8">Order ID: #{order.id}</p>

        <div className="grid md:grid-cols-2 gap-8">
            
            {/* KOLOM KIRI: INFO REKENING */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border dark:border-gray-700 h-fit">
                <div className="mb-6 pb-6 border-b dark:border-gray-700">
                    <p className="text-sm text-gray-500 mb-1 dark:text-gray-400">Total Tagihan</p>
                    <p className="text-3xl font-bold text-orange-500">{formatPrice(order.totalAmount)}</p>
                    <div className="bg-orange-50 dark:bg-orange-900/20 text-orange-600 text-xs px-3 py-2 rounded mt-2 inline-block">
                        *Mohon transfer sesuai nominal hingga 3 digit terakhir
                    </div>
                </div>

                {/* RENDER BANK DINAMIS */}
                {banks.length > 0 && (
                    <>
                        <h3 className="font-semibold mb-4 text-gray-800 dark:text-white">Metode Transfer Bank</h3>
                        <div className="space-y-3">
                            {banks.map(bank => (
                                <div key={bank.id} className="flex items-center justify-between p-4 border rounded-lg dark:border-gray-600 bg-gray-50 dark:bg-gray-700/30">
                                    <div>
                                        <p className="font-bold text-gray-800 dark:text-white uppercase">{bank.name}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">a.n {bank.holder}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-mono font-bold text-lg text-gray-800 dark:text-white">{bank.number}</p>
                                        <button 
                                            onClick={() => copyToClipboard(bank.number)} 
                                            className="text-xs text-blue-500 hover:text-blue-600 hover:underline flex items-center justify-end gap-1 mt-1 transition"
                                        >
                                            <FaCopy /> Salin
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {/* RENDER QRIS DINAMIS */}
                {qris.length > 0 && (
                    <>
                        <h3 className="font-semibold mb-4 mt-8 text-gray-800 dark:text-white">Scan QRIS</h3>
                        <div className="space-y-4">
                            {qris.map(q => (
                                <div key={q.id} className="flex flex-col items-center bg-white p-6 rounded-lg border dark:border-gray-600 shadow-sm">
                                    <p className="mb-3 font-bold text-gray-800">{q.name}</p>
                                    <img src={q.image} alt={q.name} className="w-48 h-48 object-contain" />
                                </div>
                            ))}
                        </div>
                    </>
                )}
                
                {methods.length === 0 && (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400 italic bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                        Belum ada metode pembayaran yang tersedia saat ini.
                    </div>
                )}
            </div>

            {/* KOLOM KANAN: UPLOAD BUKTI */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border dark:border-gray-700 h-fit sticky top-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2 text-gray-800 dark:text-white">
                    <FaCheckCircle className="text-green-500" /> Konfirmasi Pembayaran
                </h3>
                
                <div className="space-y-4">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                        Sudah melakukan pembayaran? Silakan upload bukti transfer Anda di bawah ini agar pesanan segera diproses.
                    </p>

                    <label 
                        htmlFor="payment-proof" 
                        className={`border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer transition-colors h-64 ${
                            preview 
                                ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/10' 
                                : 'border-gray-300 dark:border-gray-600 hover:border-orange-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                    >
                        {preview ? (
                            <img src={preview} alt="Preview" className="h-full object-contain rounded shadow-md" />
                        ) : (
                            <>
                                <FaCloudUploadAlt className="text-4xl text-gray-400 mb-3" />
                                <span className="font-medium text-gray-600 dark:text-gray-300">Klik untuk Upload Bukti</span>
                                <span className="text-xs text-gray-400 mt-1">Format: JPG, PNG (Max 5MB)</span>
                            </>
                        )}
                        <input 
                            id="payment-proof" 
                            type="file" 
                            className="hidden" 
                            accept="image/*" 
                            onChange={handleFileChange} 
                            disabled={uploading}
                        />
                    </label>

                    <button 
                        onClick={handleUpload}
                        disabled={!file || uploading}
                        className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-lg font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        {uploading ? 'Mengupload...' : 'Kirim Bukti Pembayaran'}
                    </button>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};

export default PaymentPage;