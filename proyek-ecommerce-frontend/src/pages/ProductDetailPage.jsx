import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getProductById, getProductReviews } from "../utils/api"; 
import RatingStars from "../components/ui/RatingStars";
import { formatPrice } from "../utils/formatters";
import NotFoundPage from "./NotFoundPage";
import { useCart } from "../contexts/CartContext";
import { FaUserCircle, FaStar } from "react-icons/fa";

const ProductDetailPage = () => {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState(null);

  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true);
      
      const productResponse = await getProductById(id);
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

  if (loading) return <div className="p-20 text-center">Loading...</div>;
  if (!product) return <NotFoundPage />;
  
  const hasVariants = product.variants && product.variants.length > 0;
  const handleSelectVariant = (v) => setSelectedVariant(v);
  const handleAddToCart = () => {
      if(selectedVariant) addToCart(product, selectedVariant);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      {/* --- BAGIAN ATAS: DETAIL PRODUK --- */}
      <div className="grid md:grid-cols-2 gap-8 items-start mb-16">
         <div className="flex justify-center">
            <img 
              src={product.img} 
              alt={product.title} 
              className="rounded-lg shadow-lg max-w-full h-auto" 
              onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x400?text=No+Image'; }}
            />
         </div>
         <div className="flex flex-col gap-6">
            <div>
              <h1 className="text-3xl font-bold mb-2 dark:text-white">{product.title}</h1>
              <div className="flex items-center gap-2 mb-4">
                 <RatingStars rating={product.rating || 0} reviewCount={product.reviewCount || 0} />
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-6">{product.description}</p>
            
            {hasVariants && selectedVariant ? (
                <div className="space-y-6">
                    <div>
                      <p className="text-3xl font-bold text-orange-500 mb-4">{formatPrice(selectedVariant.price)}</p>
                    </div>
                    
                    <div className="flex gap-2 mb-4 flex-wrap">
                        {product.variants.map(v => (
                            <button 
                              key={v.id} 
                              onClick={() => handleSelectVariant(v)} 
                              className={`px-4 py-2 border rounded transition-all ${
                                selectedVariant.id === v.id 
                                  ? 'bg-orange-500 text-white border-orange-500' 
                                  : 'bg-white dark:bg-gray-800 dark:text-white hover:border-orange-500'
                              }`}
                            >
                              {v.size}
                            </button>
                        ))}
                    </div>

                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Stok: <span className="font-bold">{selectedVariant.stock}</span>
                    </p>

                    <button 
                      onClick={handleAddToCart} 
                      disabled={selectedVariant.stock === 0}
                      className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-10 py-3 rounded-full font-bold hover:shadow-lg hover:scale-105 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {selectedVariant.stock === 0 ? "Stok Habis" : "Masukkan ke Keranjang"}
                    </button>
                </div>
            ) : (
              <p className="text-gray-400 italic">Stok tidak tersedia</p>
            )}
         </div>
      </div>

      {/* --- BAGIAN BAWAH: ULASAN PEMBELI --- */}
      <div className="border-t dark:border-gray-700 pt-10">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Ulasan Pembeli ({reviews.length})</h2>
        
        {reviews.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2">
            {reviews.map((review) => (
              <div key={review.id} className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-sm border dark:border-gray-700">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 overflow-hidden">
                     <FaUserCircle className="text-3xl" />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-gray-900 dark:text-white">
                      {review.user ? review.user.name : 'Pengguna'}
                    </p>
                    {/* Perbaikan Loop Bintang (S7723 & S6479) */}
                    <div className="flex text-xs text-yellow-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <FaStar 
                          key={`${review.id}-star-${i}`} // Key unik kombinasi ID review & index
                          className={i < review.rating ? "text-yellow-400" : "text-gray-300"} 
                        />
                      ))}
                    </div>
                  </div>
                  <span className="ml-auto text-xs text-gray-400">
                    {new Date(review.createdAt).toLocaleDateString('id-ID')}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                  "{review.comment}"
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-gray-500 italic">Belum ada ulasan untuk produk ini.</p>
            <p className="text-sm text-gray-400 mt-1">Jadilah yang pertama membeli dan memberikan ulasan!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;