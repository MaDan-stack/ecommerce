import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { formatPrice } from "../utils/formatters";
import { FaTrash, FaArrowRight } from "react-icons/fa";

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, total } = useCart();
  const navigate = useNavigate();

  // --- FUNGSI KHUSUS: AMBIL GAMBAR PERTAMA SAJA ---
  const getFirstImageOnly = (imgData) => {
    const placeholder = "https://placehold.co/150?text=No+Image";
    
    if (!imgData) return placeholder;

    // 1. Jika data sudah berupa Array, ambil index 0
    if (Array.isArray(imgData)) {
      return imgData.length > 0 ? imgData[0] : placeholder;
    }

    // 2. Jika data berupa String
    if (typeof imgData === 'string') {
      // Langkah A: Buang karakter sampah (kurung siku dan tanda kutip)
      // Contoh: "['url1', 'url2']"  JADI  "url1, url2"
      let cleanString = imgData.replace(/[\[\]"']/g, '');

      // Langkah B: Pecah berdasarkan koma
      // Contoh: "url1, url2" JADI ["url1", " url2"]
      const parts = cleanString.split(',');

      // Langkah C: Ambil yang pertama dan hapus spasi kosong
      if (parts.length > 0 && parts[0].trim() !== '') {
        return parts[0].trim();
      }
    }

    return placeholder;
  };

  if (cartItems.length === 0) {
    return (
      <div className="container py-20 text-center min-h-[60vh] flex flex-col justify-center items-center">
        <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Keranjang Kosong</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          Sepertinya Anda belum menambahkan produk apa pun.
        </p>
        <Link 
          to="/products"
          className="bg-orange-500 text-white px-8 py-3 rounded-full font-bold hover:bg-orange-600 transition shadow-lg"
        >
          Mulai Belanja
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Keranjang Belanja</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* --- DAFTAR PRODUK --- */}
        <div className="lg:col-span-2 space-y-6">
          {cartItems.map((item) => {
            
            // 1. Ambil data gambar mentah (image atau img)
            const rawImg = item.product.img || item.product.image;
            
            // 2. Proses agar cuma dapat 1 URL bersih
            const finalImg = getFirstImageOnly(rawImg);

            return (
              <div 
                key={item.id} 
                className="flex flex-col sm:flex-row items-center gap-6 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border dark:border-gray-700"
              >
                {/* Gambar Produk */}
                <div className="w-24 h-24 flex-shrink-0">
                    <img
                    src={finalImg} 
                    alt={item.product.title || "Produk"}
                    className="w-full h-full object-cover rounded-lg border dark:border-gray-600"
                    // Fallback jika URL masih error
                    onError={(e) => { 
                        e.target.onerror = null; 
                        e.target.src = 'https://placehold.co/150?text=Error'; 
                    }}
                    />
                </div>

                {/* Info Produk */}
                <div className="flex-1 w-full text-center sm:text-left">
                  <Link to={`/products/${item.product.id}`} className="font-bold text-lg text-gray-900 dark:text-white hover:text-orange-500 transition-colors">
                    {item.product.title || item.product.name}
                  </Link>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 mt-1">
                    Ukuran: <span className="font-semibold bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">{item.variant.size}</span>
                  </p>
                  <p className="font-bold text-orange-500">{formatPrice(item.variant.price)}</p>
                </div>

                {/* Tombol Aksi */}
                <div className="flex flex-col items-center gap-4">
                  <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white transition"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 font-semibold dark:text-white w-10 text-center text-sm">
                      {item.quantity}
                    </span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white transition"
                    >
                      +
                    </button>
                  </div>
                  
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-700 text-sm flex items-center gap-1 transition"
                  >
                    <FaTrash /> Hapus
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* --- RINGKASAN HARGA --- */}
        <div className="h-fit sticky top-24">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border dark:border-gray-700">
            <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Ringkasan</h2>
            
            <div className="space-y-3 mb-6 border-b border-gray-100 dark:border-gray-700 pb-6">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Total Item</span>
                <span>{cartItems.reduce((acc, item) => acc + item.quantity, 0)} pcs</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Subtotal</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            <div className="flex justify-between items-center mb-8">
              <span className="font-bold text-lg dark:text-white">Total Harga</span>
              <span className="font-bold text-2xl text-orange-500">{formatPrice(total)}</span>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full bg-orange-500 text-white py-4 rounded-xl font-bold hover:bg-orange-600 transition shadow-lg flex justify-center items-center gap-2"
            >
              Checkout <FaArrowRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;