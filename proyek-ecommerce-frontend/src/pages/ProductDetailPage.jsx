import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { getProductById } from "../utils/api"; // Menggunakan API
import RatingStars from "../components/ui/RatingStars";
import { formatPrice } from "../utils/formatters";
import NotFoundPage from "./NotFoundPage";
import { CartContext } from "../contexts/CartContext";

const ProductDetailPage = () => {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState(null);

  // Fetch data dari API saat halaman dibuka
  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true);
      const { error, data } = await getProductById(id);
      
      if (!error && data) {
        setProduct(data);
        // Otomatis pilih varian pertama jika ada
        if (data.variants && data.variants.length > 0) {
          setSelectedVariant(data.variants[0]);
        }
      }
      setLoading(false);
    };

    fetchProductData();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 flex justify-center">
        <p className="text-xl text-gray-500 animate-pulse">Memuat detail produk...</p>
      </div>
    );
  }

  if (!product) {
    return <NotFoundPage />;
  }
  
  const hasVariants = product.variants && product.variants.length > 0;

  const handleSelectVariant = (variant) => {
    setSelectedVariant(variant);
  };

  const handleAddToCart = () => {
    if (selectedVariant) {
      addToCart(product, selectedVariant);
      alert(`${product.title} (${selectedVariant.size}) telah ditambahkan ke keranjang!`);
    } else {
      alert("Silakan pilih varian produk terlebih dahulu.");
    }
  };

  return (
    // Container utama dengan mx-auto agar rata tengah
    <div className="container mx-auto px-4 py-12">
      <div className="grid md:grid-cols-2 gap-8 items-start">
        {/* Galeri Gambar */}
        <div className="w-full flex justify-center">
          <img
            src={product.img}
            alt={product.title}
            className="w-full max-w-[500px] h-auto object-cover rounded-lg shadow-lg border dark:border-gray-700"
            onError={(e) => { e.target.src = 'https://placehold.co/400x400?text=No+Image'; }}
          />
        </div>

        {/* Info Produk */}
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">{product.title}</h1>
            <div className="flex items-center gap-2">
                <RatingStars rating={product.rating || 0} reviewCount={product.reviewCount || 0} />
                <span className="text-sm text-gray-500">| Kategori: <span className="capitalize font-medium text-gray-700 dark:text-gray-300">{product.category}</span></span>
            </div>
          </div>
          
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm sm:text-base">
            {product.description}
          </p>
          
          {hasVariants && selectedVariant ? (
            <div className="space-y-6">
              <div>
                <p className="text-3xl font-bold text-orange-500">
                  {formatPrice(selectedVariant.price)}
                </p>
              </div>

              {/* Pilihan Ukuran */}
              <fieldset>
                <legend className="font-semibold mb-3 block dark:text-white text-sm uppercase tracking-wider">Pilih Ukuran</legend>
                <div className="flex gap-3 flex-wrap">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.id || variant.size}
                      onClick={() => handleSelectVariant(variant)}
                      className={`py-2 px-4 min-w-[3rem] rounded-md border-2 transition-all duration-200 font-medium text-sm
                        ${selectedVariant.size === variant.size 
                          ? 'bg-orange-500 border-orange-500 text-white shadow-md transform scale-105' 
                          : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:border-orange-500 dark:hover:border-orange-500'
                        }
                        ${variant.stock === 0 ? 'opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-800 text-gray-400 decoration-slash' : ''}
                      `}
                      disabled={variant.stock === 0}
                    >
                      {variant.size}
                    </button>
                  ))}
                </div>
              </fieldset>

              {/* Detail Ukuran (Size Chart) */}
              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700">
                <h3 className="font-semibold text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">
                  Spesifikasi Ukuran ({selectedVariant.size})
                </h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                        <span className="block text-[10px] uppercase text-gray-400 mb-1">Panjang</span>
                        <span className="font-bold text-gray-800 dark:text-white">{selectedVariant.length || '-'} cm</span>
                    </div>
                    <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                        <span className="block text-[10px] uppercase text-gray-400 mb-1">Lebar</span>
                        <span className="font-bold text-gray-800 dark:text-white">{selectedVariant.width || '-'} cm</span>
                    </div>
                    <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                        <span className="block text-[10px] uppercase text-gray-400 mb-1">Lengan</span>
                        <span className="font-bold text-gray-800 dark:text-white">{selectedVariant.sleeveLength || '-'} cm</span>
                    </div>
                </div>
              </div>

              <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                Stok tersedia: 
                <span className={`font-bold ${selectedVariant.stock < 5 ? 'text-red-500' : 'text-green-600'}`}>
                  {selectedVariant.stock} unit
                </span>
              </p>
            </div>
          ) : (
            <p className="text-xl font-bold text-gray-400 italic">Harga atau varian tidak tersedia saat ini.</p>
          )}
          
          <div className="mt-4 border-t dark:border-gray-700 pt-6">
            <button 
              onClick={handleAddToCart}
              disabled={!hasVariants || (selectedVariant && selectedVariant.stock === 0)}
              className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-3.5 px-10 rounded-full font-bold text-lg shadow-lg shadow-orange-500/30 transition-all duration-300 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
            >
              {selectedVariant && selectedVariant.stock === 0 ? "Stok Habis" : "Masukkan ke Keranjang"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;