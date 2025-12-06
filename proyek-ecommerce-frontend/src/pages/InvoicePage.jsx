import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { getAllOrders, getMyOrders } from '../utils/api'; 
import { formatPrice } from '../utils/formatters';
import Logo from "../assets/logo.png";

const InvoicePage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Ref untuk memastikan print hanya jalan sekali
  const printTriggered = useRef(false);

  // EFFECT 1: Hanya Ambil Data (Tanpa Print)
  useEffect(() => {
    const fetchOrder = async () => {
      // Coba ambil dari All Orders (jika admin)
      let response = await getAllOrders();
      
      // Jika gagal/kosong (user biasa), ambil My Orders
      if (response.error) {
         response = await getMyOrders();
      }

      if (!response.error && response.data) {
        const found = response.data.find(o => o.id === Number.parseInt(id, 10));
        setOrder(found);
      }
      setLoading(false);
    };
    
    fetchOrder();
  }, [id]);

  // EFFECT 2: Khusus Menangani Auto-Print
  // Ini akan jalan setiap kali 'order' berubah.
  useEffect(() => {
    // Syarat print:
    // 1. Order sudah ada datanya (tidak null)
    // 2. Loading sudah selesai
    // 3. Belum pernah diprint sebelumnya (cek ref)
    if (order && !loading && !printTriggered.current) {
        printTriggered.current = true; // Kunci segera!
        
        // Beri jeda sedikit agar rendering HTML selesai sempurna sebelum dialog print muncul
        const timer = setTimeout(() => {
            globalThis.print();
        }, 800);

        return () => clearTimeout(timer);
    }
  }, [order, loading]);

  if (loading) return <div className="p-10 text-center">Memuat Invoice...</div>;
  if (!order) return <div className="p-10 text-center text-red-500">Data pesanan tidak ditemukan.</div>;

  return (
    <div className="max-w-5xl mx-auto p-10 bg-white text-black font-sans min-h-screen print:max-w-full print:p-0">
      
      {/* Header Invoice */}
      <div className="flex justify-between items-center border-b-2 border-gray-800 pb-6 mb-8">
        <div className="flex items-center gap-4">
            <img src={Logo} alt="Logo" className="w-16 grayscale" />
            <div>
                <h1 className="text-3xl font-bold uppercase tracking-widest text-gray-900">Invoice</h1>
                <p className="text-sm font-medium text-gray-600">LokalStyle Store</p>
            </div>
        </div>
        <div className="text-right">
            <p className="font-bold text-lg">Order #{order.id}</p>
            <p className="text-sm text-gray-600">{new Date(order.createdAt).toLocaleDateString('id-ID', { dateStyle: 'full' })}</p>
            {order.trackingNumber && (
                <p className="text-sm font-mono mt-1 bg-gray-100 px-2 py-1 rounded inline-block">
                    Resi: {order.trackingNumber}
                </p>
            )}
        </div>
      </div>

      {/* Info Pengiriman */}
      <div className="grid grid-cols-2 gap-12 mb-10">
        <div>
            <h3 className="font-bold border-b border-gray-300 mb-3 uppercase text-xs tracking-wider text-gray-500">Penerima</h3>
            <p className="font-bold text-lg text-gray-800">{order.contactName}</p>
            <p className="text-gray-700 mb-1">{order.contactPhone}</p>
            <p className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">{order.shippingAddress}</p>
        </div>
        <div className="text-right">
            <h3 className="font-bold border-b border-gray-300 mb-3 uppercase text-xs tracking-wider text-gray-500">Status Pembayaran</h3>
            <div className="inline-block">
                <span className={`px-4 py-2 border-2 rounded-lg text-sm font-bold uppercase tracking-wide
                    ${order.status === 'paid' || order.status === 'completed' || order.status === 'shipped' 
                        ? 'border-green-600 text-green-700 bg-green-50' 
                        : 'border-black text-black'
                    }`}>
                    {order.status}
                </span>
            </div>
        </div>
      </div>

      {/* Tabel Barang */}
      <table className="w-full mb-10 border-collapse">
        <thead>
            <tr className="border-b-2 border-black">
                <th className="text-left py-3 font-bold uppercase text-xs tracking-wider">Produk</th>
                <th className="text-center py-3 font-bold uppercase text-xs tracking-wider">Qty</th>
                <th className="text-right py-3 font-bold uppercase text-xs tracking-wider">Harga Satuan</th>
                <th className="text-right py-3 font-bold uppercase text-xs tracking-wider">Subtotal</th>
            </tr>
        </thead>
        <tbody>
            {order.order_items?.map((item) => (
                <tr key={item.id} className="border-b border-gray-200">
                    <td className="py-4">
                        <p className="font-bold text-gray-800">{item.productTitle}</p>
                        <p className="text-xs text-gray-500 uppercase tracking-wide mt-1">Varian: {item.variantSize}</p>
                    </td>
                    <td className="text-center py-4 text-gray-700">{item.quantity}</td>
                    <td className="text-right py-4 text-gray-700">{formatPrice(item.price)}</td>
                    <td className="text-right py-4 font-bold text-gray-900">{formatPrice(item.price * item.quantity)}</td>
                </tr>
            ))}
        </tbody>
      </table>

      {/* Total Section */}
      <div className="flex justify-end">
        <div className="w-1/2 sm:w-1/3 border-t-2 border-black pt-4">
            <div className="flex justify-between text-2xl font-bold text-gray-900">
                <span>TOTAL</span>
                <span>{formatPrice(order.totalAmount)}</span>
            </div>
            <p className="text-right text-xs text-gray-500 mt-2 font-normal">Termasuk pajak & biaya layanan</p>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-16 text-center text-xs text-gray-400 border-t pt-6 print:mt-8">
        <p className="font-bold text-gray-600 mb-1">Terima kasih telah berbelanja di LokalStyle.</p>
        <p>Simpan dokumen ini sebagai bukti pembelian yang sah. Barang yang sudah dibeli tidak dapat ditukar kecuali cacat produksi.</p>
        <p className="mt-2">www.lokalstyle.com</p>
      </div>
      
      {/* Tombol Print Manual */}
      <button 
        onClick={() => globalThis.print()} 
        className="print:hidden fixed bottom-8 right-8 bg-blue-600 text-white px-8 py-4 rounded-full shadow-xl font-bold hover:bg-blue-700 transition transform hover:scale-105 flex items-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
        </svg>
        Cetak Invoice
      </button>
    </div>
  );
};

export default InvoicePage;