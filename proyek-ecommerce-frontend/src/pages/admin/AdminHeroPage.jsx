import React, { useState, useEffect } from 'react';
import { getHeroSlides, addHeroSlide, deleteHeroSlide, uploadImage } from '../../utils/api';
import { FaTrash, FaPlus, FaImage } from 'react-icons/fa';
import toast from 'react-hot-toast';

const AdminHeroPage = () => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [img, setImg] = useState('');
  const [uploading, setUploading] = useState(false);

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
    setUploading(true);
    const result = await uploadImage(file);
    if (!result.error) {
        setImg(result.url);
    } else {
        toast.error("Gagal upload gambar");
    }
    setUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !img) {
        toast.error("Semua field harus diisi");
        return;
    }

    const result = await addHeroSlide({ title, description, img });
    if (!result.error) {
        toast.success("Slide berhasil ditambahkan");
        setTitle('');
        setDescription('');
        setImg('');
        fetchSlides();
    } else {
        toast.error("Gagal menambah slide");
    }
  };

  const handleDelete = async (id) => {
    if(confirm("Hapus slide ini?")) {
        await deleteHeroSlide(id);
        fetchSlides();
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Kelola Hero Banner</h1>

      {/* Form Tambah */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md mb-8 border dark:border-gray-700">
        <h2 className="text-xl font-semibold mb-4">Tambah Slide Baru</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm mb-1">Judul Promo</label>
                    <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full p-2 border rounded dark:bg-gray-700" placeholder="Diskon 50%..." />
                </div>
                <div>
                    <label className="block text-sm mb-1">Gambar Banner</label>
                    <div className="flex gap-2">
                        <label className="cursor-pointer bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded border flex items-center gap-2 hover:bg-gray-200 transition w-full">
                            <FaImage /> {uploading ? "Uploading..." : "Pilih Gambar"}
                            <input type="file" className="hidden" accept="image/*" onChange={handleUpload} disabled={uploading} />
                        </label>
                    </div>
                </div>
            </div>
            <div>
                <label className="block text-sm mb-1">Deskripsi Singkat</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full p-2 border rounded dark:bg-gray-700" rows="2" placeholder="Keterangan promo..."></textarea>
            </div>
            
            {img && (
                <div className="w-full h-32 bg-gray-100 rounded overflow-hidden relative">
                    <img src={img} alt="Preview" className="w-full h-full object-cover" />
                </div>
            )}

            <div className="flex justify-end">
                <button type="submit" className="bg-orange-500 text-white px-6 py-2 rounded font-bold hover:bg-orange-600 transition">
                    <FaPlus className="inline mr-2" /> Tambah Slide
                </button>
            </div>
        </form>
      </div>

      {/* List Slide */}
      <div className="grid gap-4">
        {slides.map(slide => (
            <div key={slide.id} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow border dark:border-gray-700 flex gap-4 items-center">
                <img src={slide.img} alt={slide.title} className="w-32 h-20 object-cover rounded bg-gray-200" />
                <div className="flex-1">
                    <h3 className="font-bold text-lg">{slide.title}</h3>
                    <p className="text-sm text-gray-500 line-clamp-1">{slide.description}</p>
                </div>
                <button onClick={() => handleDelete(slide.id)} className="p-3 text-red-500 hover:bg-red-100 rounded-full transition">
                    <FaTrash />
                </button>
            </div>
        ))}
        {slides.length === 0 && !loading && <p className="text-center text-gray-500">Belum ada slide. Tambahkan satu!</p>}
      </div>
    </div>
  );
};

export default AdminHeroPage;