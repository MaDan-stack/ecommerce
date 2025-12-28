import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addProduct } from '../../utils/api'; // Hapus uploadImage
import { FaPlus, FaTrash, FaSave, FaImage, FaTimes } from 'react-icons/fa'; // Hapus FaLink
import toast from 'react-hot-toast';

const AdminAddProduct = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  // Hapus isUploading dan setIsUploading karena tidak dipakai lagi

  // State Data Produk
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('men');
  const [description, setDescription] = useState('');
  
  // State untuk Gambar (Multiple)
  const [images, setImages] = useState([]); 
  const [previewImages, setPreviewImages] = useState([]);
  // Hapus imgMode dan setImgMode karena defaultnya sekarang upload file semua

  // State Varian
  const [variants, setVariants] = useState([
    { _id: Date.now(), size: 'M', price: '', stock: '', length: '', width: '', sleeve: '' }
  ]);

  // --- HANDLERS GAMBAR ---

  const handleFileChange = (e) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      
      // Gabungkan dengan file yang sudah dipilih sebelumnya (maksimal 5 total)
      const totalImages = [...images, ...filesArray].slice(0, 5);
      setImages(totalImages);

      // Buat URL preview untuk ditampilkan
      const newPreviews = filesArray.map(file => URL.createObjectURL(file));
      setPreviewImages(prev => [...prev, ...newPreviews].slice(0, 5));
    }
  };

  const handleRemoveImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = previewImages.filter((_, i) => i !== index);
    
    setImages(newImages);
    setPreviewImages(newPreviews);
  };

  // --- HANDLERS VARIAN ---

  const handleVariantChange = (index, field, value) => {
    const newVariants = [...variants];
    newVariants[index][field] = value; 
    setVariants(newVariants);
  };

  const addVariantField = () => {
    setVariants([...variants, { 
      _id: Date.now(), 
      size: '', price: '', stock: '', 
      length: '', width: '', sleeve: '' 
    }]);
  };

  const removeVariantField = (index) => {
    if (variants.length > 1) {
      const newVariants = variants.filter((_, i) => i !== index);
      setVariants(newVariants);
    }
  };

  // --- SUBMIT ---

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || images.length === 0) {
      toast.error("Mohon lengkapi nama, deskripsi, dan minimal 1 gambar.");
      return;
    }

    setLoading(true);

    // 1. Siapkan FormData karena kita kirim File binary
    const formData = new FormData();
    formData.append('title', title);
    formData.append('category', category);
    formData.append('description', description);

    // Append Images (Looping karena array)
    images.forEach((file) => {
        formData.append('images', file);
    });

    // Append Variants (Stringify karena FormData tidak bisa kirim Array Object langsung)
    const cleanVariants = variants.map((v) => ({
        size: v.size || 'All Size',
        price: Number(v.price) || 0,
        stock: Number(v.stock) || 0,
        length: Number(v.length) || 0,
        width: Number(v.width) || 0,
        sleeveLength: Number(v.sleeve) || 0
    }));
    formData.append('variants', JSON.stringify(cleanVariants));

    try {
      const { error } = await addProduct(formData);
      
      if (!error) {
        toast.success("Produk berhasil disimpan!");
        navigate('/admin/products');
      } else {
        toast.error("Gagal menyimpan produk.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Terjadi kesalahan sistem.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">Tambah Produk Baru</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* --- Informasi Dasar --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-2">Nama Produk</label>
            <input 
              id="title"
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              placeholder="Contoh: Celana Chino Slim Fit"
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium mb-2">Kategori</label>
            <select 
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              disabled={loading}
            >
              <option value="men">Pria</option>
              <option value="women">Wanita</option>
              <option value="kids">Anak-anak</option>
            </select>
          </div>
        </div>

        {/* --- Gambar (Multi Upload) --- */}
        <div className="border p-4 rounded-lg dark:border-gray-600 bg-gray-50 dark:bg-gray-700/30">
            <p className="block text-sm font-medium mb-3">Foto Produk (Maksimal 5)</p>
            
            {/* Area Upload */}
            <div className="mb-4">
               <label 
                htmlFor="file-upload" 
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition"
               >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <FaImage className="text-3xl text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-semibold">Klik untuk upload</span> atau drag and drop
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG (Max. 5 files)</p>
                  </div>
                  <input 
                    id="file-upload" 
                    type="file" 
                    multiple 
                    className="hidden" 
                    onChange={handleFileChange}
                    accept="image/*"
                    disabled={loading}
                  />
               </label>
            </div>

            {/* Gallery Preview */}
            {previewImages.length > 0 && (
                <div className="grid grid-cols-5 gap-4">
                    {previewImages.map((src, index) => (
                        <div key={index} className="relative group">
                            <img 
                                src={src} 
                                alt={`Preview ${index}`} 
                                className="w-full h-24 object-cover rounded-lg border dark:border-gray-600" 
                            />
                            <button
                                type="button"
                                onClick={() => handleRemoveImage(index)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition"
                            >
                                <FaTimes size={12} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>

        {/* Deskripsi */}
        <div>
            <label htmlFor="description" className="block text-sm font-medium mb-2">Deskripsi</label>
            <textarea 
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
              className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              placeholder="Detail produk, bahan, perawatan..."
              disabled={loading}
            ></textarea>
        </div>

        {/* --- Varian Produk --- */}
        <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-lg border dark:border-gray-600">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Varian & Stok</h3>
                <button type="button" onClick={addVariantField} className="text-sm text-orange-500 flex items-center gap-1 hover:underline" disabled={loading}>
                    <FaPlus /> Tambah Ukuran
                </button>
            </div>
            
            {variants.map((variant, index) => (
                <div key={variant._id} className="mb-6 p-4 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600 shadow-sm">
                    {/* Baris 1: Info Utama */}
                    <div className="flex gap-4 mb-3">
                        <div className="w-1/3">
                            <label className="block text-xs mb-1 font-semibold">Ukuran (Size)</label>
                            <input 
                                type="text" 
                                value={variant.size || ''} 
                                onChange={(e) => handleVariantChange(index, 'size', e.target.value)}
                                className="w-full p-2 border rounded dark:bg-gray-700" 
                                placeholder="30, 32, XL..."
                            />
                        </div>
                        <div className="w-1/3">
                            <label className="block text-xs mb-1 font-semibold">Harga (Rp)</label>
                            <input 
                                type="number" 
                                value={variant.price || ''} 
                                onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
                                className="w-full p-2 border rounded dark:bg-gray-700" 
                                placeholder="Harga..."
                            />
                        </div>
                        <div className="w-1/3">
                            <label className="block text-xs mb-1 font-semibold">Stok</label>
                            <input 
                                type="number" 
                                value={variant.stock || ''} 
                                onChange={(e) => handleVariantChange(index, 'stock', e.target.value)}
                                className="w-full p-2 border rounded dark:bg-gray-700" 
                                placeholder="Qty..."
                            />
                        </div>
                    </div>
                    {/* Baris 2: Detail Dimensi */}
                    <div className="flex gap-4 items-end">
                         <div className="w-1/3">
                            <label className="block text-xs mb-1 text-gray-500">Panjang (cm)</label>
                            <input type="number" value={variant.length} onChange={(e) => handleVariantChange(index, 'length', e.target.value)} className="w-full p-2 border rounded bg-gray-50 text-sm" />
                        </div>
                         <div className="w-1/3">
                            <label className="block text-xs mb-1 text-gray-500">Lebar (cm)</label>
                            <input type="number" value={variant.width} onChange={(e) => handleVariantChange(index, 'width', e.target.value)} className="w-full p-2 border rounded bg-gray-50 text-sm" />
                        </div>
                         <div className="w-1/3">
                            <label className="block text-xs mb-1 text-gray-500">P. Lengan (cm)</label>
                            <input type="number" value={variant.sleeve} onChange={(e) => handleVariantChange(index, 'sleeve', e.target.value)} className="w-full p-2 border rounded bg-gray-50 text-sm" />
                        </div>
                         {variants.length > 1 && (
                            <button type="button" onClick={() => removeVariantField(index)} className="p-2 ml-2 text-red-500 hover:bg-red-100 rounded">
                                <FaTrash />
                            </button>
                        )}
                    </div>
                </div>
            ))}
        </div>

        <div className="flex justify-end">
            <button 
                type="submit" 
                disabled={loading} 
                className="flex items-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-orange-600 transition-colors disabled:opacity-50"
            >
                <FaSave /> {loading ? 'Menyimpan...' : 'Simpan Produk'}
            </button>
        </div>
      </form>
    </div>
  );
};

export default AdminAddProduct;