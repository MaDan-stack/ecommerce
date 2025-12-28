import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getProductById, updateProduct } from '../../utils/api';
import { FaSave, FaPlus, FaTrash, FaArrowLeft, FaCloudUploadAlt, FaTimes } from 'react-icons/fa';
import toast from 'react-hot-toast';

const AdminEditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // State Data Produk
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('men');
  const [description, setDescription] = useState('');
  
  // State Gambar
  const [existingImages, setExistingImages] = useState([]); 
  const [newImages, setNewImages] = useState([]); 
  const [newPreviews, setNewPreviews] = useState([]); 

  // State Varian
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- 1. FETCH DATA SAAT LOAD ---
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      const { error, data } = await getProductById(id);
      
      if (!error && data) {
        setTitle(data.title);
        setCategory(data.category);
        setDescription(data.description);
        
        // Handle Gambar Lama
        let imgs = [];
        if (Array.isArray(data.img)) {
            imgs = data.img;
        } else if (typeof data.img === 'string') {
             try {
                const parsed = JSON.parse(data.img);
                imgs = Array.isArray(parsed) ? parsed : [data.img];
             } catch {
                imgs = [data.img];
             }
        }
        setExistingImages(imgs);
        
        // Handle Varian
        const variantsWithId = (data.variants || []).map(v => ({
          ...v,
          _id: v.id || Date.now() + Math.random(),
          sleeve: v.sleeveLength || '' 
        }));
        
        setVariants(variantsWithId.length > 0 ? variantsWithId : [{ _id: Date.now(), size: '', price: '', stock: '', length: '', width: '', sleeve: '' }]);
      } else {
        toast.error("Gagal mengambil data produk.");
        navigate('/admin/products');
      }
      setLoading(false);
    };

    fetchProduct();
  }, [id, navigate]);

  // --- 2. HANDLERS GAMBAR (PERBAIKAN DI SINI) ---

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const incomingFiles = Array.from(e.target.files);
      
      // PERBAIKAN: Gabungkan file yang sudah ada di state (newImages) + file yang baru dipilih
      const combinedFiles = [...newImages, ...incomingFiles];

      // Validasi Maksimal 5 Gambar Baru Total
      if (combinedFiles.length > 5) {
        toast.error("Maksimal 5 gambar baru yang diperbolehkan.");
      }

      // Ambil 5 file pertama saja
      const limitedFiles = combinedFiles.slice(0, 5);
      
      setNewImages(limitedFiles);

      // Generate Previews ulang untuk semua file yang ada di list
      const previews = limitedFiles.map(file => URL.createObjectURL(file));
      setNewPreviews(previews);

      // Reset input value agar user bisa memilih file yang sama lagi jika tidak sengaja menghapus
      e.target.value = null; 
    }
  };

  const removeNewImage = (index) => {
    // Hapus file dari state berdasarkan index
    const updatedFiles = newImages.filter((_, i) => i !== index);
    const updatedPreviews = newPreviews.filter((_, i) => i !== index);
    
    setNewImages(updatedFiles);
    setNewPreviews(updatedPreviews);
  };

  const removeExistingImage = (index) => {
    const updated = existingImages.filter((_, i) => i !== index);
    setExistingImages(updated);
  };

  // --- 3. HANDLERS VARIAN ---

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

  // --- 4. SUBMIT FORM ---

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description) {
      toast.error("Nama dan Deskripsi wajib diisi.");
      return;
    }

    if (existingImages.length === 0 && newImages.length === 0) {
        toast.error("Produk harus memiliki minimal 1 gambar.");
        return;
    }

    setLoading(true);

    const cleanVariants = variants.map((v) => ({
        size: v.size || 'All Size',
        price: Number(v.price) || 0,
        stock: Number(v.stock) || 0,
        length: Number(v.length) || 0,
        width: Number(v.width) || 0,
        sleeveLength: Number(v.sleeve) || 0
    }));

    let payload; 

    if (newImages.length > 0) {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('category', category);
        formData.append('description', description);
        formData.append('variants', JSON.stringify(cleanVariants));
        formData.append('existingImages', JSON.stringify(existingImages));

        newImages.forEach(file => {
            formData.append('images', file);
        });
        
        payload = formData;
    } else {
        payload = {
            title,
            category,
            description,
            existingImages: JSON.stringify(existingImages),
            img: existingImages, 
            variants: cleanVariants
        };
    }

    try {
        const { error } = await updateProduct(id, payload);
        if (!error) {
            toast.success("Produk berhasil diperbarui!");
            navigate('/admin/products');
        } else {
            toast.error("Gagal memperbarui produk.");
        }
    } catch (err) {
        console.error(err);
        toast.error("Terjadi kesalahan sistem.");
    } finally {
        setLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div></div>;

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate('/admin/products')} className="p-2 bg-white dark:bg-gray-700 rounded-full shadow hover:bg-gray-100 transition text-gray-600 dark:text-gray-200">
            <FaArrowLeft />
        </button>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Edit Produk</h1>
      </div>
      
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* KOLOM KIRI */}
        <div className="lg:col-span-2 space-y-6">
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border dark:border-gray-700">
                <h2 className="text-xl font-semibold mb-4 dark:text-white border-b pb-2 dark:border-gray-700">Informasi Dasar</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Nama Produk</label>
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white transition" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Kategori</label>
                        <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white transition">
                            <option value="men">Pria</option>
                            <option value="women">Wanita</option>
                            <option value="kids">Anak-anak</option>
                        </select>
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Deskripsi</label>
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows="4" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white transition"></textarea>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border dark:border-gray-700">
                <h2 className="text-xl font-semibold mb-4 dark:text-white border-b pb-2 dark:border-gray-700">Galeri Produk</h2>
                
                {existingImages.length > 0 && (
                    <div className="mb-6">
                        <p className="text-sm font-medium text-gray-500 mb-3">Gambar Saat Ini:</p>
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                            {existingImages.map((src, idx) => (
                                <div key={idx} className="relative group aspect-square">
                                    <img src={src} alt={`Existing ${idx}`} className="w-full h-full object-cover rounded-lg border border-gray-200 dark:border-gray-600" />
                                    <button type="button" onClick={() => removeExistingImage(idx)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 shadow-md hover:bg-red-600 transition opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100">
                                        <FaTrash size={12}/>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div>
                    <p className="text-sm font-medium text-gray-500 mb-3">Upload Gambar Baru:</p>
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 dark:bg-gray-700/50 dark:border-gray-600 dark:hover:bg-gray-700 transition">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <FaCloudUploadAlt className="text-3xl text-gray-400 mb-2" />
                            <p className="text-sm text-gray-500 dark:text-gray-400 font-semibold">Klik untuk upload gambar</p>
                            <p className="text-xs text-gray-400 mt-1">PNG, JPG (Maks 5 file)</p>
                        </div>
                        {/* INPUT FILE SUDAH MENDUKUNG MULTIPLE */}
                        <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileChange} />
                    </label>
                </div>

                {newPreviews.length > 0 && (
                    <div className="mt-6">
                        <p className="text-sm font-medium text-green-600 mb-3 flex items-center gap-2">
                             <span className="w-2 h-2 bg-green-500 rounded-full"></span> Akan Ditambahkan:
                        </p>
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                            {newPreviews.map((src, idx) => (
                                <div key={idx} className="relative group aspect-square">
                                    <img src={src} alt="New Preview" className="w-full h-full object-cover rounded-lg border-2 border-green-400" />
                                    <button type="button" onClick={() => removeNewImage(idx)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 shadow-md hover:bg-red-600 transition">
                                        <FaTimes size={12}/>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>

        {/* KOLOM KANAN: VARIAN */}
        <div className="lg:col-span-1">
             <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border dark:border-gray-700 sticky top-4">
                <div className="flex justify-between items-center mb-4 border-b pb-2 dark:border-gray-700">
                    <h2 className="text-xl font-semibold dark:text-white">Varian</h2>
                    <button type="button" onClick={addVariantField} className="text-sm bg-orange-100 text-orange-600 px-3 py-1 rounded-full font-bold hover:bg-orange-200 transition flex items-center gap-1">
                        <FaPlus size={10} /> Tambah
                    </button>
                </div>

                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                    {variants.map((variant, index) => (
                        <div key={variant._id} className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-700/50 dark:border-gray-600 relative">
                             {variants.length > 1 && (
                                <button type="button" onClick={() => removeVariantField(index)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition">
                                    <FaTimes />
                                </button>
                             )}
                            
                            <div className="mb-3">
                                <label className="text-xs font-bold text-gray-500 uppercase">Ukuran</label>
                                <input type="text" value={variant.size} onChange={(e) => handleVariantChange(index, 'size', e.target.value)} className="w-full p-2 text-sm border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Cth: XL" />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3 mb-3">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase">Harga</label>
                                    <input type="number" value={variant.price} onChange={(e) => handleVariantChange(index, 'price', e.target.value)} className="w-full p-2 text-sm border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase">Stok</label>
                                    <input type="number" value={variant.stock} onChange={(e) => handleVariantChange(index, 'stock', e.target.value)} className="w-full p-2 text-sm border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-6 pt-4 border-t dark:border-gray-700">
                    <button type="submit" disabled={loading} className="w-full bg-orange-500 text-white py-3 rounded-lg font-bold hover:bg-orange-600 transition shadow-lg flex justify-center items-center gap-2">
                        <FaSave /> {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
                    </button>
                </div>
             </div>
        </div>

      </form>
    </div>
  );
};

export default AdminEditProduct;