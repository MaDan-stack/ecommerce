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
  
  // State untuk gambar aktif (fitur galeri)
  const [activeImage, setActiveImage] = useState("");

  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true);
      
      const productResponse = await getProductById(id);
      const reviewsResponse = await getProductReviews(id);

      if (!productResponse.error && productResponse.data) {
        const data = productResponse.data;
        
        // --- LOGIKA MULTI IMAGE ---
        // Pastikan img adalah array. Jika string (data lama), bungkus dalam array.
        // Helper di backend model sebenarnya sudah melakukan ini, tapi kita jaga-jaga di frontend.
        let images = [];
        if (Array.isArray(data.img)) {
            images = data.img;
        } else if (typeof data.img === 'string') {
            // Cek jika stringnya format JSON array atau URL biasa
            try {
                const parsed = JSON.parse(data.img);
                images = Array.isArray(parsed) ? parsed : [data.img];
            } catch {
                images = [data.img];
            }
        }
        
        // Simpan array gambar yang sudah dinormalisasi kembali ke objek product
        const normalizedProduct = { ...data, img: images };
        setProduct(normalizedProduct);
        setActiveImage(images[0]); // Set gambar pertama sebagai default active

        if (data.variants && data.variants.length > 0) {
          setSelectedVariant(data.variants[0]);
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
         
         {/* --- KOLOM KIRI: GALERI GAMBAR --- */}
         <div className="flex flex-col gap-4">
            {/* Gambar Utama */}
            <div className="aspect-square w-full rounded-xl overflow-hidden shadow-lg border dark:border-gray-700 relative bg-white flex items-center justify-center">
                <img 
                    src={activeImage} 
                    alt={product.title} 
                    className="w-full h-full object-contain" 
                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x400?text=No+Image'; }}
                />
            </div>

            {/* Thumbnail Gallery (Hanya muncul jika lebih dari 1 gambar) */}
            {product.img.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
                    {product.img.map((imgUrl, index) => (
                        <button 
                            key={index}
                            onClick={() => setActiveImage(imgUrl)}
                            className={`w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                                activeImage === imgUrl 
                                    ? "border-orange-500 opacity-100 ring-2 ring-orange-200" 
                                    : "border-gray-200 dark:border-gray-700 opacity-60 hover:opacity-100"
                            }`}
                        >
                            <img src={imgUrl} alt={`View ${index}`} className="w-full h-full object-cover" />
                        </button>
                    ))}
                </div>
            )}
         </div>

         {/* --- KOLOM KANAN: INFO PRODUK --- */}
         <div className="flex flex-col gap-6">
            <div>
              <h1 className="text-3xl font-bold mb-2 dark:text-white">{product.title}</h1>
              <div className="flex items-center gap-2 mb-4">
                 <RatingStars rating={product.rating || 0} reviewCount={product.reviewCount || 0} />
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-6 whitespace-pre-wrap leading-relaxed">{product.description}</p>
            
            {hasVariants && selectedVariant ? (
                <div className="space-y-6">
                    <div>
                      <p className="text-3xl font-bold text-orange-500 mb-4">{formatPrice(selectedVariant.price)}</p>
                    </div>
                    
                    <div className="space-y-3">
                        <p className="text-sm font-semibold dark:text-gray-300">Pilih Ukuran:</p>
                        <div className="flex gap-2 mb-4 flex-wrap">
                            {product.variants.map(v => (
                                <button 
                                key={v.id} 
                                onClick={() => handleSelectVariant(v)} 
                                className={`px-4 py-2 border rounded transition-all min-w-[50px] ${
                                    selectedVariant.id === v.id 
                                    ? 'bg-orange-500 text-white border-orange-500 shadow-md transform scale-105' 
                                    : 'bg-white dark:bg-gray-800 dark:text-white hover:border-orange-500'
                                }`}
                                >
                                {v.size}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border dark:border-gray-700 text-sm space-y-1">
                        <p className="font-semibold text-gray-700 dark:text-gray-200 mb-2">Detail Ukuran ({selectedVariant.size}):</p>
                        <div className="grid grid-cols-3 gap-2 text-gray-600 dark:text-gray-400">
                            <div>Panjang: {selectedVariant.length || '-'} cm</div>
                            <div>Lebar: {selectedVariant.width || '-'} cm</div>
                            <div>P.Lengan: {selectedVariant.sleeveLength || '-'} cm</div>
                        </div>
                        <p className="text-xs text-gray-400 mt-2 italic">*Toleransi ukuran 1-2cm</p>
                    </div>

                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Stok tersedia: <span className="font-bold text-gray-800 dark:text-white">{selectedVariant.stock}</span>
                    </p>

                    <button 
                      onClick={handleAddToCart} 
                      disabled={selectedVariant.stock === 0}
                      className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-red-500 text-white px-10 py-3.5 rounded-full font-bold hover:shadow-lg hover:scale-[1.02] transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-orange-500/30"
                    >
                      {selectedVariant.stock === 0 ? "Stok Habis" : "Masukkan ke Keranjang"}
                    </button>
                </div>
            ) : (
              <p className="text-gray-400 italic bg-gray-100 p-4 rounded text-center">Stok tidak tersedia saat ini.</p>
            )}
         </div>
      </div>

      {/* --- BAGIAN BAWAH: ULASAN --- */}
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
                    <div className="flex text-xs text-yellow-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <FaStar 
                          key={`${review.id}-star-${i}`} 
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
          <div className="text-center py-10 bg-gray-50 dark:bg-gray-800 rounded-lg border dark:border-gray-700 border-dashed">
            <p className="text-gray-500 italic">Belum ada ulasan untuk produk ini.</p>
            <p className="text-sm text-gray-400 mt-1">Jadilah yang pertama membeli dan memberikan ulasan!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;