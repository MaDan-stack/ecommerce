import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import RatingStars from "../../components/ui/RatingStars";
import { formatPrice } from "../../utils/formatters";
import { getProducts } from "../../utils/api"; // <-- Gunakan API

const TopSellingProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // Panggil API (Kita ambil kategori 'women' sebagai contoh "Top Selling" sesuai data dummy lama)
      const { error, data } = await getProducts({ category: 'women' });
      
      if (!error) {
        // Ambil 4 produk teratas
        setProducts(data.slice(0, 4));
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  const getStartingPrice = (variants) => {
    if (!variants || variants.length === 0) return formatPrice(0);
    const minPrice = Math.min(...variants.map(v => v.price));
    return formatPrice(minPrice);
  };

  if (loading) {
    return <div className="text-center py-20">Memuat produk top...</div>;
  }

  return (
    <div className="mt-14 mb-12 flex items-center justify-center">
      <div className="container">
        {/* Header Section */}
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

        {/* Body Section */}
        <div>
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 place-items-center">
              {products.map((product, index) => (
                <Link to={`/products/${product.id}`} key={product.id} className="w-full">
                  <div
                    data-aos="fade-up"
                    data-aos-delay={index * 100}
                    className="space-y-3 p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 h-full bg-white dark:bg-gray-800"
                  >
                    <img
                      src={product.img}
                      alt={product.title}
                      className="h-[220px] w-full object-cover rounded-md"
                      onError={(e) => { e.target.src = 'https://placehold.co/400x300?text=No+Image'; }}
                    />
                    <div>
                      <h3 className="font-semibold text-black dark:text-white truncate">{product.title}</h3>
                      <p className="text-sm font-bold text-orange-500">
                        Mulai dari {getStartingPrice(product.variants)}
                      </p>
                      <RatingStars rating={product.rating} reviewCount={product.reviewCount} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">Belum ada produk top selling.</p>
          )}

          <div className="flex justify-center">
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