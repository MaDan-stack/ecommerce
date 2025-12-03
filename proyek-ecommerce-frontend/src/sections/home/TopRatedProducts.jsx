import React, { useState, useEffect } from "react";
import FeaturedProductCard from "../../components/ui/FeaturedProductCard";
import { getProducts } from "../../utils/api"; // <-- Gunakan API

const TopRatedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // Ambil semua produk
      const { error, data } = await getProducts();
      
      if (!error && data) {
        // Filter produk dengan rating tinggi (misal >= 4.0)
        // Dan ambil 3 terbaik
        const topRated = data
          .filter((p) => p.rating >= 4)
          .sort((a, b) => b.rating - a.rating)
          .slice(0, 3);
          
        setProducts(topRated);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) return null; // Tidak tampilkan apa-apa saat loading agar tidak berkedip

  return (
    <div className="py-24 flex items-center justify-center">
      <div className="container">
        {/* Header Section */}
        <div className="text-center mb-10 max-w-[600px] mx-auto">
          <p data-aos="fade-up" className="text-sm text-orange-500">
            Produk dengan Rating Tertinggi
          </p>
          <h1 data-aos="fade-up" className="text-3xl font-bold">
            Produk Terbaik
          </h1>
          <p data-aos="fade-up" className="text-xs text-gray-400">
            Produk-produk ini mendapatkan ulasan terbaik dari para pelanggan kami.
          </p>
        </div>

        {/* Body Section */}
        {products.length > 0 ? (
          <div className="flex flex-wrap justify-center items-center gap-16 mt-20">
            {products.map((product) => (
              <FeaturedProductCard 
                key={product.id} 
                product={product} 
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 italic mt-10">Belum ada produk dengan rating tinggi.</p>
        )}
      </div>
    </div>
  );
};

export default TopRatedProducts;