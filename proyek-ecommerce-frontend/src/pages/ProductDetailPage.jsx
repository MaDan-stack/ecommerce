import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
// Tambahkan getProductReviews di import
import { getProductById, getProductReviews } from "../utils/api"; 
import RatingStars from "../components/ui/RatingStars";
import { formatPrice } from "../utils/formatters";
import NotFoundPage from "./NotFoundPage";
import { CartContext } from "../contexts/CartContext";
import { FaUserCircle, FaStar } from "react-icons/fa";

const ProductDetailPage = () => {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]); // State untuk review
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState(null);

  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true);
      
      // 1. Ambil Data Produk
      const productResponse = await getProductById(id);
      
      // 2. Ambil Data Review (Paralel biar cepat)
      const reviewsResponse = await getProductReviews(id);

      if (!productResponse.error && productResponse.data) {
        setProduct(productResponse.data);
        if (productResponse.data.variants && productResponse.data.variants.length > 0) {
          setSelectedVariant(productResponse.data.variants[0]);
        }
      }
      
      if (!reviewsResponse.error) {
        setReviews(reviewsResponse.data);
      }

      setLoading(false);
    };

    fetchProductData();
  }, [id]);

  // ... (LOGIKA VARIANT, HANDLE CART, DAN RENDER PRODUK TETAP SAMA SEPERTI SEBELUMNYA) ...
  // ... COPY-PASTE Bagian atas file Anda yang lama sampai sebelum return penutup div utama ...

  if (loading) return <div className="p-20 text-center">Loading...</div>;
  if (!product) return <NotFoundPage />;
  
  // Helper variables dari kode lama
  const hasVariants = product.variants && product.variants.length > 0;
  const handleSelectVariant = (v) => setSelectedVariant(v);
  const handleAddToCart = () => {
      if(selectedVariant) addToCart(product, selectedVariant);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      {/* --- BAGIAN ATAS: DETAIL PRODUK (SAMA SEPERTI SEBELUMNYA) --- */}
      <div className="grid md:grid-cols-2 gap-8 items-start mb-16">
         {/* ... (Copy Paste kode gambar & info produk dari file lama Anda) ... */}
         {/* Biar rapi, saya asumsikan Anda menaruh kode render produk di sini */}
         
         {/* CONTOH SINGKAT STRUKTUR (Sesuaikan dengan kode asli Anda): */}
         <div className="flex justify-center">
            <img src={product.img} alt={product.title} className="rounded-lg shadow-lg max-w-full h-auto" onError={(e) => e.target.src='https://placehold.co/400'} />
         </div>
         <div>
            <h1 className="text-3xl font-bold mb-2 dark:text-white">{product.title}</h1>
            <div className="flex items-center gap-2 mb-4">
               <RatingStars rating={product.rating || 0} reviewCount={product.reviewCount || 0} />
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-6">{product.description}</p>
            
            {/* Selector Variant & Tombol Cart (Sesuaikan kode asli) */}
            {hasVariants && selectedVariant && (
                <div className="mb-6">
                    <p className="text-2xl font-bold text-orange-500 mb-4">{formatPrice(selectedVariant.price)}</p>
                    <div className="flex gap-2 mb-4">
                        {product.variants.map(v => (
                            <button key={v.id} onClick={() => handleSelectVariant(v)} className={`px-4 py-2 border rounded ${selectedVariant.id === v.id ? 'bg-orange-500 text-white' : 'bg-white dark:bg-gray-800 dark:text-white'}`}>{v.size}</button>
                        ))}
                    </div>
                    <button onClick={handleAddToCart} className="bg-orange-500 text-white px-8 py-3 rounded-full font-bold hover:bg-orange-600 transition">Masukkan Keranjang</button>
                </div>
            )}
         </div>
      </div>

      {/* --- BAGIAN BAWAH: ULASAN PEMBELI (BARU) --- */}
      <div className="border-t dark:border-gray-700 pt-10">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Ulasan Pembeli ({reviews.length})</h2>
        
        {reviews.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2">
            {reviews.map((review) => (
              <div key={review.id} className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-sm border dark:border-gray-700">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                     <FaUserCircle className="text-2xl" />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-gray-900 dark:text-white">{review.user ? review.user.name : 'Pengguna'}</p>
                    <div className="flex text-xs text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className={i < review.rating ? "text-yellow-400" : "text-gray-300"} />
                      ))}
                    </div>
                  </div>
                  <span className="ml-auto text-xs text-gray-400">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                  "{review.comment}"
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic">Belum ada ulasan untuk produk ini.</p>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;