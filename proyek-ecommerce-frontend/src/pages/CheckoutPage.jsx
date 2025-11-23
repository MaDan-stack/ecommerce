import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../contexts/CartContext';
import { AuthContext } from '../contexts/AuthContext';
import { formatPrice } from '../utils/formatters';
import { createOrder } from '../utils/api'; // Integrasi API
import toast from 'react-hot-toast';

const CheckoutPage = () => {
  const { cartItems, total, clearCart } = useContext(CartContext);
  const { authedUser } = useContext(AuthContext);
  const navigate = useNavigate();

  // State Form Data
  const [name, setName] = useState(authedUser ? authedUser.name : '');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !address || !phone) {
      alert("Harap lengkapi Nama, Nomor HP, dan Alamat pengiriman.");
      return;
    }

    if (cartItems.length === 0) {
      alert("Keranjang belanja kosong.");
      return;
    }

    setLoading(true);

    // 1. Siapkan data sesuai format Backend
    const orderData = {
      items: cartItems,
      totalAmount: total,
      shippingAddress: address,
      contactName: name,
      contactPhone: phone
    };

    // 2. Kirim ke API
    const { error } = await createOrder(orderData);

    if (!error) {
  toast.success("Pesanan berhasil dibuat! Cek riwayat pesanan Anda.");
  clearCart();
  navigate('/');
}

    setLoading(false);
  };

  // Tampilan jika keranjang kosong
  if (cartItems.length === 0) {
    return (
      <div className="container py-20 text-center min-h-[60vh] flex flex-col justify-center items-center">
        <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Keranjang Kosong</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Anda belum menambahkan produk apa pun.
        </p>
        <button 
          onClick={() => navigate('/products')}
          className="bg-orange-500 text-white px-8 py-3 rounded-full font-bold hover:bg-orange-600 transition duration-300 shadow-lg"
        >
          Mulai Belanja
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-10 text-gray-900 dark:text-white">
          Checkout Pesanan
        </h1>
        
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          
          {/* --- KOLOM KIRI: FORM PENGIRIMAN --- */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border dark:border-gray-700 h-fit">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-gray-900 dark:text-white">
              Data Pengiriman
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block mb-2 font-medium text-sm text-gray-700 dark:text-gray-300">Nama Penerima</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                  placeholder="Nama Lengkap"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block mb-2 font-medium text-sm text-gray-700 dark:text-gray-300">Nomor WhatsApp / HP</label>
                <input 
                  type="tel" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                  placeholder="08xxxxxxxxxx"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block mb-2 font-medium text-sm text-gray-700 dark:text-gray-300">Alamat Lengkap</label>
                <textarea 
                  value={address} 
                  onChange={(e) => setAddress(e.target.value)} 
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition resize-none"
                  rows="4"
                  placeholder="Nama Jalan, No. Rumah, Kecamatan, Kota, Kode Pos..."
                  disabled={loading}
                ></textarea>
              </div>
            </form>
          </div>

          {/* --- KOLOM KANAN: RINGKASAN PESANAN --- */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border dark:border-gray-700 h-fit sticky top-24">
            <h2 className="text-xl font-semibold mb-6 pb-4 border-b border-gray-100 dark:border-gray-700 text-gray-900 dark:text-white">
              Ringkasan Pesanan
            </h2>
            
            <ul className="space-y-4 mb-6 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
              {cartItems.map(item => (
                <li key={item.id} className="flex justify-between items-start gap-4">
                  <div className="flex items-center gap-3">
                      <div className="relative">
                        <img src={item.product.img} alt={item.product.title} className="w-16 h-16 object-cover rounded-lg border dark:border-gray-600" />
                        <span className="absolute -top-2 -right-2 bg-gray-900 dark:bg-gray-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                            {item.quantity}
                        </span>
                      </div>
                      <div>
                          <p className="font-medium text-gray-800 dark:text-gray-200 line-clamp-1 text-sm">{item.product.title}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Size: {item.variant.size}</p>
                      </div>
                  </div>
                  <p className="font-semibold text-gray-800 dark:text-gray-200 text-sm whitespace-nowrap">
                      {formatPrice(item.variant.price * item.quantity)}
                  </p>
                </li>
              ))}
            </ul>

            <div className="border-t border-dashed border-gray-300 dark:border-gray-600 pt-4 space-y-3">
              <div className="flex justify-between text-gray-600 dark:text-gray-400 text-sm">
                  <span>Subtotal</span>
                  <span>{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400 text-sm">
                  <span>Biaya Pengiriman</span>
                  <span className="text-green-500 font-medium">Gratis</span>
              </div>
              <div className="flex justify-between font-bold text-xl mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 text-gray-900 dark:text-white">
                <span>Total Bayar</span>
                <span className="text-orange-500">{formatPrice(total)}</span>
              </div>
            </div>

            <button 
              onClick={handleSubmit} 
              disabled={loading}
              className="w-full mt-8 bg-gradient-to-r from-orange-500 to-red-500 text-white py-3.5 rounded-xl font-bold hover:shadow-lg hover:scale-[1.02] active:scale-95 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? 'Memproses...' : 'Bayar Sekarang'}
            </button>
            
            <p className="text-xs text-center text-gray-400 mt-4">
              🔒 Pembayaran Aman & Terenkripsi
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;