import { useState, useEffect } from 'react';
import { getProducts } from '../utils/api'; // <-- Ganti import dari 'data' ke 'api'

const useProducts = (filters = {}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { category, sort } = filters;

  useEffect(() => {
    const fetchProducts = async () => { // Ubah jadi async
      setLoading(true);
      try {
        const { error, data } = await getProducts(); // Panggil API
        
        if (!error) {
          let filteredData = data;
          // Filter kategori & sort bisa dilakukan di frontend (seperti sebelumnya) 
          // atau di backend (lebih baik). Untuk sekarang biarkan di frontend dulu.
          if (category) {
            filteredData = filteredData.filter((p) => p.category === category);
          }
          setProducts(filteredData);
        }
      } catch (error) {
        console.error("Gagal mengambil data produk:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, sort]); 

  return { products, loading };
};

export default useProducts;