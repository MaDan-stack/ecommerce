import React from "react";
import { useLocation } from "react-router-dom";
import ProductCard from "../components/ui/ProductCard";
import useProducts from "../hooks/useProducts";

// Fungsi untuk mendapatkan judul halaman berdasarkan filter
const getPageTitle = (category, sort) => {
  if (category === "men") return "Produk Pria";
  if (category === "women") return "Produk Wanita";
  if (sort === "trending") return "Produk Terlaris";
  if (sort === "top-rated") return "Rating Tertinggi";
  return "Semua Produk";
};

const ProductsPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const category = searchParams.get("category");
  const sort = searchParams.get("sort");

  // Gunakan custom hook dengan filter yang didapat dari URL
  const { products, loading } = useProducts({ category, sort });

  const title = getPageTitle(category, sort);

  // Logika untuk menentukan konten apa yang akan ditampilkan
  let content;

  if (loading) {
    content = (
      <div className="flex h-96 items-center justify-center">
        <p className="text-center">Memuat produk...</p>
      </div>
    );
  } else if (products.length > 0) {
    content = (
      <div
        data-aos="fade-up"
        className="grid grid-cols-1 place-items-center gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        {products.map((product, index) => (
          <ProductCard
            key={product.id}
            product={product}
            aosDelay={`${index * 100}`}
          />
        ))}
      </div>
    );
  } else {
    content = (
      <div className="flex h-64 items-center justify-center">
        <p className="text-center text-gray-500">
          Tidak ada produk yang ditemukan untuk kategori ini.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12">
      <div className="container mx-auto rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800">
        {/* Header Halaman */}
        <div className="mb-10 text-center">
          <h1 data-aos="fade-up" className="text-3xl font-bold">
            {title}
          </h1>
          <p data-aos="fade-up" className="text-sm text-gray-400">
            Jelajahi semua koleksi terbaik dari LokalStyle.
          </p>
        </div>

        {/* Konten Utama */}
        {content}
      </div>
    </div>
  );
};

export default ProductsPage;