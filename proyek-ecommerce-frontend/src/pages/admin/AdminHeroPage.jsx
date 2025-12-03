import React, { useState, useEffect } from 'react';
import { getHeroSlides, addHeroSlide, deleteHeroSlide, uploadImage } from '../../utils/api';
import { FaTrash, FaPlus, FaImage } from 'react-icons/fa';
import toast from 'react-hot-toast';
import ConfirmModal from '../../components/ui/ConfirmModal';

const AdminHeroPage = () => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [img, setImg] = useState('');
  const [uploading, setUploading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // State Modal Konfirmasi
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const fetchSlides = async () => {
    setLoading(true);
    const { error, data } = await getHeroSlides();
    if (!error) setSlides(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
        toast.error("Harap upload file gambar.");
        return;
    }

    setUploading(true);
    const result = await uploadImage(file);
    
    if (result.error) {
        toast.error("Gagal upload gambar.");
    } else {
        setImg(result.url);
        toast.success("Gambar berhasil diupload!");
    }
    setUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !img) {
        toast.error("Semua field harus diisi!");
        return;
    }

    setActionLoading(true);
    const result = await addHeroSlide({ title, description, img });
    
    if (result.error) {
        toast.error(result.message || "Gagal menambah slide");
    } else {
        toast.success("Slide berhasil ditambahkan");
        setTitle('');
        setDescription('');
        setImg('');
        fetchSlides();
    }
    setActionLoading(false);
  };

  const openDeleteModal = (id) => {
    setDeleteId(id);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    
    setActionLoading(true);
    const { error } = await deleteHeroSlide(deleteId);
    
    if (error) {
        toast.error("Gagal menghapus slide.");
    } else {
        toast.success("Slide berhasil dihapus.");
        fetchSlides();
    }
    
    setActionLoading(false);
    setIsModalOpen(false);
    setDeleteId(null);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">Kelola Hero Banner</h1>

      {/* Form Tambah */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md mb-8 border dark:border-gray-700">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Tambah Slide Baru</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="promo-title" className="block text-sm mb-1 text-gray-600 dark:text-gray-300">Judul Promo</label>
                    <input 
                        id="promo-title" 
                        type="text" 
                        value={title} 
                        onChange={e => setTitle(e.target.value)} 
                        className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
                        placeholder="Diskon 50%..." 
                        disabled={actionLoading} 
                    />
                </div>
                <div>
                    {/* PERBAIKAN: Mengganti label menjadi span agar tidak error di SonarLint */}
                    <span className="block text-sm mb-1 text-gray-600 dark:text-gray-300">Gambar Banner</span>
                    <div className="flex gap-2">
                        <label htmlFor="promo-image" className={`bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded border dark:border-gray-600 flex items-center gap-2 hover:bg-gray-200 dark:hover:bg-gray-600 transition w-full ${uploading ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}>
                            <FaImage className="text-gray-500 dark:text-gray-400" /> 
                            <span className="text-gray-600 dark:text-gray-300">{uploading ? "Uploading..." : "Pilih Gambar"}</span>
                            <input 
                                id="promo-image" 
                                type="file" 
                                className="hidden" 
                                accept="image/*" 
                                onChange={handleUpload} 
                                disabled={uploading || actionLoading} 
                            />
                        </label>
                    </div>
                </div>
            </div>
            <div>
                <label htmlFor="promo-desc" className="block text-sm mb-1 text-gray-600 dark:text-gray-300">Deskripsi Singkat</label>
                <textarea 
                    id="promo-desc" 
                    value={description} 
                    onChange={e => setDescription(e.target.value)} 
                    className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
                    rows="2" 
                    placeholder="Keterangan promo..." 
                    disabled={actionLoading}
                ></textarea>
            </div>
            
            {img && (
                <div className="w-full h-32 bg-gray-100 dark:bg-gray-900 rounded overflow-hidden relative border dark:border-gray-600">
                    <img src={img} alt="Preview" className="w-full h-full object-cover" />
                </div>
            )}

            <div className="flex justify-end">
                <button 
                    type="submit" 
                    disabled={uploading || actionLoading}
                    className="bg-orange-500 text-white px-6 py-2 rounded font-bold hover:bg-orange-600 transition disabled:opacity-50 flex items-center gap-2"
                >
                    {actionLoading ? 'Menyimpan...' : <><FaPlus /> Tambah Slide</>}
                </button>
            </div>
        </form>
      </div>

      <div className="grid gap-4">
        {slides.map(slide => (
            <div key={slide.id} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow border dark:border-gray-700 flex gap-4 items-center group">
                <img src={slide.img} alt={slide.title} className="w-32 h-20 object-cover rounded bg-gray-200 dark:bg-gray-700" />
                <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-800 dark:text-white">{slide.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">{slide.description}</p>
                </div>
                
                <button 
                    onClick={() => openDeleteModal(slide.id)} 
                    className="p-3 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-full transition"
                    title="Hapus Slide"
                >
                    <FaTrash />
                </button>
            </div>
        ))}
        {slides.length === 0 && !loading && <p className="text-center text-gray-500 mt-10">Belum ada slide. Tambahkan satu!</p>}
      </div>

      <ConfirmModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Hapus Banner?"
        message="Banner ini akan dihapus permanen dari halaman utama. Tindakan ini tidak dapat dibatalkan."
        isLoading={actionLoading}
      />
    </div>
  );
};

export default AdminHeroPage;