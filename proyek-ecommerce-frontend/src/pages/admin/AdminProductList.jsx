import React, { useState, useEffect } from 'react';
import { getProducts, deleteProduct } from '../../utils/api';
import { FaTrash, FaEdit } from 'react-icons/fa';
import { formatPrice } from '../../utils/formatters';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const AdminProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProductsData = async () => {
    setLoading(true);
    const { error, data } = await getProducts();
    if (!error) {
      // DEBUG: Cek di Inspect Element > Console untuk melihat struktur data asli
      console.log("Data Produk dari API:", data); 
      setProducts(data);
    } else {
      setProducts([]);
      toast.error("Gagal memuat data produk");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProductsData();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Yakin ingin menghapus produk ini? Data yang dihapus tidak bisa dikembalikan.")) {
      const { error } = await deleteProduct(id);
      if (!error) {
        toast.success("Produk berhasil dihapus!");
        fetchProductsData(); 
      } else {
        toast.error("Gagal menghapus produk.");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        <p className="ml-3 text-gray-500">Memuat data produk...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Kelola Produk</h1>
        <Link to="/admin/add-product">
          <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors shadow-md flex items-center gap-2">
            <span>+</span> Tambah Produk
          </button>
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border dark:border-gray-700">
        {products.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-200 border-b dark:border-gray-600">
                <tr>
                  <th className="p-4 font-semibold w-1/4">Produk</th>
                  <th className="p-4 font-semibold">Kategori</th>
                  <th className="p-4 font-semibold w-1/3">Detail Varian (Ukuran - Harga - Stok)</th>
                  <th className="p-4 font-semibold text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {products.map((product) => {
                  
                  // --- PERBAIKAN UTAMA DI SINI ---
                  // Kita cek 'image' DAN 'img'. Mana yang ada, itu yang dipakai.
                  let imgSource = product.image || product.img;

                  // 1. Jika masih berupa String JSON (contoh: "['https://...']"), parse dulu
                  if (typeof imgSource === 'string' && imgSource.startsWith('[')) {
                      try {
                          const parsed = JSON.parse(imgSource);
                          // Jika hasil parse adalah array, ambil index 0
                          if (Array.isArray(parsed) && parsed.length > 0) {
                             imgSource = parsed[0];
                          }
                      } catch (e) {
                          console.error("Gagal parse gambar:", e);
                      }
                  }
                  
                  // 2. Jika tipe datanya Array asli, ambil index 0
                  if (Array.isArray(imgSource) && imgSource.length > 0) {
                      imgSource = imgSource[0];
                  }
                  
                  // 3. Jika null/undefined/kosong, pakai gambar placeholder
                  if (!imgSource) {
                      imgSource = "https://placehold.co/150?text=No+Image";
                  }
                  // --------------------------------

                  return (
                    <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <td className="p-4 align-top">
                        <div className="flex items-start gap-3">
                          <img 
                            src={imgSource} 
                            alt={product.name || product.title} 
                            className="w-16 h-16 object-cover rounded border border-gray-200 dark:border-gray-600"
                            onError={(e) => { 
                              e.target.onerror = null; 
                              e.target.src = 'https://placehold.co/150?text=Error'; 
                            }}
                          />
                          <div>
                            <span className="font-medium text-gray-800 dark:text-gray-200 block">
                              {product.title || product.name}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">
                              {product.description}
                            </span>
                          </div>
                        </div>
                      </td>
                      
                      <td className="p-4 align-top capitalize text-gray-600 dark:text-gray-400">
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm">
                          {product.category}
                        </span>
                      </td>
                      
                      <td className="p-4 align-top">
                        {product.variants && product.variants.length > 0 ? (
                          <div className="space-y-2">
                            {product.variants.map((variant, idx) => (
                              <div 
                                key={`${product.id}-${idx}`} 
                                className={`flex justify-between items-center text-sm p-2 rounded border ${
                                  variant.stock < 5 
                                    ? 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800' 
                                    : 'bg-white border-gray-100 dark:bg-gray-700 dark:border-gray-600'
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  <span className="font-bold bg-gray-200 dark:bg-gray-600 px-2 rounded text-xs">
                                    {variant.size}
                                  </span>
                                  <span className="text-gray-600 dark:text-gray-300">
                                    {formatPrice(variant.price)}
                                  </span>
                                </div>
                                <span className={`text-xs font-medium ${variant.stock < 5 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                                  Stok: {variant.stock}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-400 italic text-sm">- Tidak ada varian -</span>
                        )}
                      </td>

                      <td className="p-4 align-top text-center">
                        <div className="flex justify-center gap-2">
                          <Link 
                            to={`/admin/products/edit/${product.id}`}
                            className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded transition-colors" 
                            title="Edit"
                          >
                            <FaEdit />
                          </Link>
                          <button 
                            onClick={() => handleDelete(product.id)} 
                            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-colors" 
                            title="Hapus"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <p className="text-gray-500 text-lg">Belum ada produk.</p>
            <p className="text-gray-400 text-sm mt-2">Silakan tambah produk baru untuk memulai.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProductList;