import React, { useState } from "react";
import { subscribeNewsletter } from "../../utils/api";
import toast from 'react-hot-toast';

const Subscribe = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Masukkan email Anda");
    
    setLoading(true);
    const { error, message } = await subscribeNewsletter(email);
    
    if (error) {
        toast.error(message);
    } else {
        toast.success(message);
        setEmail(""); 
    }
    setLoading(false);
  };

  return (
    // 1. BAGIAN LUAR: Mengatur Background & Jarak dari komponen bawah (mb-20)
    <div
      data-aos="zoom-in"
      className="mb-20 bg-gradient-to-r from-gray-100 to-orange-100 dark:from-gray-800 dark:to-gray-900"
    >
      {/* 2. CONTAINER UTAMA: Membatasi lebar agar sama dengan Hero/Testimoni */}
      <div className="container py-10 mx-auto">
        
        {/* 3. WRAPPER KONTEN: 
            - max-w-xl: Membatasi agar form tidak terlalu panjang ke samping
            - mx-auto: Memastikan wrapper ini ada di tengah container
            - text-center: Memastikan teks judul ada di tengah
            - flex & items-center: Memaksa semua anak elemen (judul & form) ke tengah
        */}
        <div className="max-w-xl mx-auto text-center flex flex-col items-center space-y-6">
          
          <h1 className="text-2xl sm:text-4xl font-semibold text-gray-800 dark:text-white">
            Dapatkan Notifikasi Produk Baru
          </h1>
          
          <form onSubmit={handleSubmit} className="relative w-full">
            <input
              data-aos="fade-up"
              type="email"
              placeholder="Masukkan email Anda"
              // Tambahkan bg-white agar kotak input terlihat jelas
              className="w-full p-3 pr-24 text-black bg-white border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-orange-500 transition shadow-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading}
              className="absolute right-1 top-1 bottom-1 bg-orange-500 hover:bg-orange-600 text-white px-6 rounded-md font-bold transition disabled:opacity-70"
            >
              {loading ? "..." : "Daftar"}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};

export default Subscribe;