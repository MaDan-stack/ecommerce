import React, { useState } from "react";
import Banner from "../../assets/website/orange-pattern.jpg";
import { subscribeNewsletter } from "../../utils/api";
import toast from 'react-hot-toast';

const BannerImg = {
  backgroundImage: `url(${Banner})`,
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  height: "100%",
  width: "100%",
};

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
        setEmail(""); // Reset input
    }
    setLoading(false);
  };

  return (
    <div
      data-aos="zoom-in"
      className="mb-20 bg-gray-100 dark:bg-gray-800 text-white "
      style={BannerImg}
    >
      <div className="container backdrop-blur-sm py-10">
        <div className="space-y-6 max-w-xl mx-auto">
          <h1 className="text-2xl !text-center sm:text-left sm:text-4xl font-semibold">
            Dapatkan Notifikasi Produk Baru
          </h1>
          
          <form onSubmit={handleSubmit} className="relative">
            <input
                data-aos="fade-up"
                type="email"
                placeholder="Masukkan email Anda"
                className="w-full p-3 pr-24 text-black rounded-lg outline-none focus:ring-2 focus:ring-orange-500 transition"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
            />
            <button
                type="submit"
                disabled={loading}
                className="absolute right-1 top-1 bottom-1 bg-orange-500 hover:bg-orange-600 text-white px-4 rounded-md font-bold transition disabled:opacity-70"
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