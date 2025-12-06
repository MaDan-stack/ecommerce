import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProducts } from '../utils/api'; 
import ProductCard from '../components/ui/ProductCard';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q'); 
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      if (query) {
        const { error, data } = await getProducts({ title: query });
        
        // Perbaikan S7735: Membalik logika if agar tidak dinegasikan
        if (error) {
          setProducts([]);
        } else {
          setProducts(data);
        }
      } else {
        setProducts([]);
      }
      setLoading(false);
    };

    fetchSearchResults();
  }, [query]);

  // Perbaikan S3358: Memisahkan logika render dari JSX utama
  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-40">
          <p className="text-gray-500 animate-pulse">Mencari produk...</p>
        </div>
      );
    }

    if (products.length > 0) {
      return (
        <div className="flex flex-wrap justify-center gap-6">
          {products.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              aosDelay={`${index * 100}`}
            />
          ))}
        </div>
      );
    }

    return (
      <div className="text-center py-10 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <p className="text-xl text-gray-600 dark:text-gray-300 font-semibold">
          Tidak ada produk yang ditemukan.
        </p>
        <p className="text-gray-500 mt-2">
          Coba gunakan kata kunci lain yang lebih umum.
        </p>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-12 min-h-[60vh]">
      <div className="text-center mb-10">
        <h1 data-aos="fade-up" className="text-3xl font-bold text-gray-900 dark:text-white">
          Hasil Pencarian: "{query}"
        </h1>
        <p className="text-gray-500 mt-2">
          Menemukan {products.length} produk yang cocok.
        </p>
      </div>

      {renderContent()}
    </div>
  );
};

export default SearchPage;