import React from "react";
import { getTopRatedProducts } from "../../utils/data";
import FeaturedProductCard from "../../components/ui/FeaturedProductCard";
// Tidak perlu import CartContext lagi di sini

const TopRatedProducts = () => {
  const products = getTopRatedProducts();

  return (
    <div className="py-24 flex items-center justify-center">
      <div className="container">
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

        <div className="flex flex-wrap justify-center items-center gap-16 mt-20">
          {products.map((product) => (
            <FeaturedProductCard 
              key={product.id} 
              product={product} 
              // Tidak perlu kirim handleOrderPopup
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopRatedProducts;