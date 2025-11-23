import React from "react";
import { Link } from "react-router-dom"; // 1. Impor komponen Link
import RatingStars from "../../components/ui/RatingStars";
import { getBestSellingProducts } from "../../utils/data";
import { formatPrice } from "../../utils/formatters";

const TopSellingProducts = () => {
  const products = getBestSellingProducts();

  const getStartingPrice = (variants) => {
    if (!variants || variants.length === 0) return formatPrice(0);
    const minPrice = Math.min(...variants.map(v => v.price));
    return formatPrice(minPrice);
  };

  return (
    <div className="mt-14 mb-12 flex items-center justify-center">
      <div className="container">
        {/* Bagian Judul */}
        <div className="text-center mb-10 mx-auto">
          <p data-aos="fade-up" className="text-sm text-orange-500">
            Produk Pilihan Untuk Anda
          </p>
          <h1 data-aos="fade-up" className="text-3xl font-bold">
            Top Penjualan
          </h1>
          <p data-aos="fade-up" className="text-xs text-gray-400">
            Jelajahi koleksi produk kami yang paling diminati oleh pelanggan setia LokalStyle.
          </p>
        </div>

        {/* Grid Produk */}
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 place-items-center">
            {products.map((product, index) => (
              <Link to={`/products/${product.id}`} key={product.id}>
                <div
                  data-aos="fade-up"
                  data-aos-delay={index * 200}
                  className="space-y-3 p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 h-full"
                >
                  <img
                    src={product.img}
                    alt={product.title}
                    className="h-[220px] w-full object-cover rounded-md"
                  />
                  <div>
                    <h3 className="font-semibold text-black dark:text-white">{product.title}</h3>
                    <p className="text-sm font-bold text-orange-500">
                      Mulai dari {getStartingPrice(product.variants)}
                    </p>
                    <RatingStars rating={product.rating} reviewCount={product.reviewCount} />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* --- BAGIAN YANG DIPERBAIKI --- */}
          <div className="flex justify-center">
            {/* 2. Bungkus tombol dengan Link yang mengarah ke /products */}
            <Link to="/products">
              <button className="text-center mt-10 cursor-pointer bg-orange-500 text-white py-1 px-5 rounded-md hover:bg-orange-600 duration-300">
                Lihat Semua Produk
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopSellingProducts;