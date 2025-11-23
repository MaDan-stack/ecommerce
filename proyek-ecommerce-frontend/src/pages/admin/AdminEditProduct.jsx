import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getProductById, updateProduct, uploadImage } from '../../utils/api';
import { FaSave, FaPlus, FaTrash, FaArrowLeft, FaLink, FaImage } from 'react-icons/fa';

const AdminEditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('men');
  const [description, setDescription] = useState('');
  const [img, setImg] = useState('');
  const [imgMode, setImgMode] = useState('url');
  const [previewImg, setPreviewImg] = useState('');
  
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  // Fetch Data Produk
  useEffect(() => {
    const fetchProduct = async () => {
      const { error, data } = await getProductById(id);
      
      if (!error && data) {
        setTitle(data.title);
        setCategory(data.category);
        setDescription(data.description);
        setImg(data.img);
        setPreviewImg(data.img);
        
        // Map data varian dari DB ke state
        const variantsWithId = (data.variants || []).map(v => ({
          ...v,
          _id: v.id || Date.now() + Math.random(),
          // Mapping kolom dari DB (sleeveLength) ke state (sleeve) jika perlu
          // Pastikan nama field konsisten, di sini saya pakai sleeve
          sleeve: v.sleeveLength || '' 
        }));
        
        setVariants(variantsWithId.length > 0 ? variantsWithId : [{ _id: Date.now(), size: '', price: '', stock: '', length: '', width: '', sleeve: '' }]);
      } else {
        alert("Gagal mengambil data produk.");
        navigate('/admin/products');
      }
      setLoading(false);
    };

    fetchProduct();
  }, [id, navigate]);

  // --- Handlers (Sama seperti AddProduct) ---
  const handleImageModeChange = (mode) => {
    setImgMode(mode);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsUploading(true);
      const result = await uploadImage(file);
      if (!result.error && result.url) {
        setImg(result.url); 
        setPreviewImg(result.url);
      } else {
        e.target.value = null;
        alert("Gagal upload gambar");
      }
      setIsUploading(false);
    }
  };

  const handleUrlChange = (e) => {
    setImg(e.target.value);
    setPreviewImg(e.target.value);
  };

  const handleVariantChange = (index, field, value) => {
    const newVariants = [...variants];
    newVariants[index][field] = value;
    setVariants(newVariants);
  };

  const addVariantField = () => {
    setVariants([...variants, { _id: Date.now(), size: '', price: '', stock: '', length: '', width: '', sleeve: '' }]);
  };

  const removeVariantField = (index) => {
    if (variants.length > 1) {
      const newVariants = variants.filter((_, i) => i !== index);
      setVariants(newVariants);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !img) {
      alert("Mohon lengkapi data produk.");
      return;
    }

    setLoading(true);

    const cleanVariants = variants.map((v) => ({
        size: v.size || 'All Size',
        price: Number(v.price) || 0,
        stock: Number(v.stock) || 0,
        length: Number(v.length) || 0,
        width: Number(v.width) || 0,
        sleeveLength: Number(v.sleeve) || 0 // Mapping ke backend
    }));

    const updatedData = {
      title,
      category,
      description,
      img,
      variants: cleanVariants
    };

    try {
        const { error } = await updateProduct(id, updatedData);
        if (!error) {
            alert("Produk berhasil diperbarui!");
            navigate('/admin/products');
        }
    } catch (err) {
        console.error(err);
        alert("Gagal memperbarui produk.");
    } finally {
        setLoading(false);
    }
  };

  if (loading) return <p className="p-8 text-center">Memuat data...</p>;

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate('/admin/products')} className="text-gray-500 hover:text-orange-500">
            <FaArrowLeft />
        </button>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Edit Produk</h1>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informasi Dasar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-2">Nama Produk</label>
            <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600" disabled={loading}/>
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium mb-2">Kategori</label>
            <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600" disabled={loading}>
              <option value="men">Pria</option>
              <option value="women">Wanita</option>
              <option value="kids">Anak-anak</option>
            </select>
          </div>
        </div>

        {/* Gambar */}
        <div className="border p-4 rounded-lg dark:border-gray-600 bg-gray-50 dark:bg-gray-700/30">
            <p className="block text-sm font-medium mb-3">Gambar Produk</p>
            <div className="flex gap-4 mb-4">
                <button type="button" onClick={() => handleImageModeChange('url')} className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm transition-colors ${imgMode === 'url' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-600'}`}>
                    <FaLink /> URL Gambar
                </button>
                <button type="button" onClick={() => handleImageModeChange('file')} className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm transition-colors ${imgMode === 'file' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-600'}`}>
                    <FaImage /> Upload File
                </button>
            </div>
            {imgMode === 'url' ? (
                <div>
                  <label htmlFor="image-url" className="sr-only">URL</label>
                  <input id="image-url" type="text" value={img || ''} onChange={handleUrlChange} className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600" disabled={loading}/>
                </div>
            ) : (
                <div>
                  <label htmlFor="image-file" className="sr-only">File</label>
                  <input id="image-file" type="file" accept="image/*" onChange={handleFileChange} className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 bg-white" disabled={loading || isUploading}/>
                </div>
            )}
            {previewImg && <img src={previewImg} alt="Preview" className="mt-4 h-32 object-contain rounded-md border bg-white" />}
        </div>

        {/* Deskripsi */}
        <div>
            <label htmlFor="description" className="block text-sm font-medium mb-2">Deskripsi</label>
            <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows="4" className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600" disabled={loading}></textarea>
        </div>

        {/* Varian */}
        <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-lg border dark:border-gray-600">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Varian</h3>
                <button type="button" onClick={addVariantField} className="text-sm text-orange-500 flex items-center gap-1 hover:underline" disabled={loading}><FaPlus /> Tambah</button>
            </div>
            {variants.map((variant, index) => (
                <div key={variant._id} className="mb-6 p-4 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600 shadow-sm">
                    {/* Baris 1 */}
                    <div className="flex gap-4 mb-3">
                        <div className="w-1/3">
                            <label className="block text-xs mb-1 font-semibold">Ukuran</label>
                            <input type="text" value={variant.size || ''} onChange={(e) => handleVariantChange(index, 'size', e.target.value)} className="w-full p-2 border rounded dark:bg-gray-700" disabled={loading} />
                        </div>
                        <div className="w-1/3">
                            <label className="block text-xs mb-1 font-semibold">Harga</label>
                            <input type="number" value={variant.price || ''} onChange={(e) => handleVariantChange(index, 'price', e.target.value)} className="w-full p-2 border rounded dark:bg-gray-700" disabled={loading} />
                        </div>
                        <div className="w-1/3">
                            <label className="block text-xs mb-1 font-semibold">Stok</label>
                            <input type="number" value={variant.stock || ''} onChange={(e) => handleVariantChange(index, 'stock', e.target.value)} className="w-full p-2 border rounded dark:bg-gray-700" disabled={loading} />
                        </div>
                    </div>
                    {/* Baris 2 */}
                    <div className="flex gap-4 items-end">
                        <div className="w-1/3">
                            <label className="block text-xs mb-1 text-gray-500">Panjang</label>
                            <input type="number" value={variant.length || ''} onChange={(e) => handleVariantChange(index, 'length', e.target.value)} className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 text-sm" placeholder="cm" disabled={loading} />
                        </div>
                        <div className="w-1/3">
                            <label className="block text-xs mb-1 text-gray-500">Lebar</label>
                            <input type="number" value={variant.width || ''} onChange={(e) => handleVariantChange(index, 'width', e.target.value)} className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 text-sm" placeholder="cm" disabled={loading} />
                        </div>
                        <div className="w-1/3">
                            <label className="block text-xs mb-1 text-gray-500">Lengan</label>
                            <input type="number" value={variant.sleeve || ''} onChange={(e) => handleVariantChange(index, 'sleeve', e.target.value)} className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 text-sm" placeholder="cm" disabled={loading} />
                        </div>
                        {variants.length > 1 && <button type="button" onClick={() => removeVariantField(index)} className="p-2 ml-2 text-red-500 hover:bg-red-100 rounded h-10 w-10 flex items-center justify-center" disabled={loading}><FaTrash /></button>}
                    </div>
                </div>
            ))}
        </div>

        <div className="flex justify-end">
            <button type="submit" disabled={loading} className="flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-600 transition-colors disabled:opacity-50">
                <FaSave /> {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
        </div>
      </form>
    </div>
  );
};

export default AdminEditProduct;