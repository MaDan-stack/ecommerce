import React, { useState, useEffect } from 'react';
import { getPaymentMethods, addPaymentMethod, deletePaymentMethod } from '../../utils/api';
import { FaTrash, FaPlus, FaQrcode, FaUniversity } from 'react-icons/fa';
import toast from 'react-hot-toast';

const AdminPaymentSettings = () => {
  const [methods, setMethods] = useState([]);
  const [activeTab, setActiveTab] = useState('bank'); // 'bank' or 'qris'
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [holder, setHolder] = useState('');
  const [file, setFile] = useState(null);

  const fetchMethods = async () => {
    setLoading(true);
    const { error, data } = await getPaymentMethods();
    if (!error) setMethods(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchMethods();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('type', activeTab);
    formData.append('name', name); // Nama Bank atau Label QRIS

    if (activeTab === 'bank') {
        if(!name || !number || !holder) return toast.error("Lengkapi data bank");
        formData.append('number', number);
        formData.append('holder', holder);
    } else {
        if(!file) return toast.error("Pilih gambar QRIS");
        formData.append('image', file);
    }

    setSubmitting(true);
    const { error } = await addPaymentMethod(formData);
    if (!error) {
        toast.success("Metode berhasil ditambahkan");
        setName(''); setNumber(''); setHolder(''); setFile(null);
        fetchMethods();
    } else {
        toast.error("Gagal menambahkan metode");
    }
    setSubmitting(false);
  };

  const handleDelete = async (id) => {
    if(confirm("Hapus metode ini?")) {
        await deletePaymentMethod(id);
        fetchMethods();
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">Metode Pembayaran</h1>

      {/* Form Tambah */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md mb-8 border dark:border-gray-700">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Tambah Metode Baru</h2>
        
        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b dark:border-gray-700">
            <button 
                onClick={() => setActiveTab('bank')} 
                className={`pb-2 px-4 font-medium flex items-center gap-2 ${activeTab === 'bank' ? 'border-b-2 border-orange-500 text-orange-500' : 'text-gray-500'}`}
            >
                <FaUniversity /> Transfer Bank
            </button>
            <button 
                onClick={() => setActiveTab('qris')} 
                className={`pb-2 px-4 font-medium flex items-center gap-2 ${activeTab === 'qris' ? 'border-b-2 border-orange-500 text-orange-500' : 'text-gray-500'}`}
            >
                <FaQrcode /> QRIS
            </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm mb-1 text-gray-600 dark:text-gray-300">
                    {activeTab === 'bank' ? 'Nama Bank (Cth: BCA, Mandiri)' : 'Label (Cth: QRIS Utama)'}
                </label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder={activeTab === 'bank' ? "BCA" : "QRIS Toko"} />
            </div>

            {activeTab === 'bank' && (
                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm mb-1 text-gray-600 dark:text-gray-300">Nomor Rekening</label>
                        <input type="text" value={number} onChange={e => setNumber(e.target.value)} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="1234567890" />
                    </div>
                    <div>
                        <label className="block text-sm mb-1 text-gray-600 dark:text-gray-300">Atas Nama</label>
                        <input type="text" value={holder} onChange={e => setHolder(e.target.value)} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="PT LokalStyle" />
                    </div>
                </div>
            )}

            {activeTab === 'qris' && (
                <div>
                    <label className="block text-sm mb-1 text-gray-600 dark:text-gray-300">Upload Gambar QRIS</label>
                    <input type="file" onChange={e => setFile(e.target.files[0])} accept="image/*" className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white bg-gray-50" />
                </div>
            )}

            <div className="flex justify-end pt-4">
                <button type="submit" disabled={submitting} className="bg-orange-500 text-white px-6 py-2 rounded font-bold hover:bg-orange-600 transition disabled:opacity-50 flex items-center gap-2">
                    <FaPlus /> Simpan
                </button>
            </div>
        </form>
      </div>

      {/* List Methods */}
      <div className="grid gap-4">
        {methods.map(method => (
            <div key={method.id} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow border dark:border-gray-700 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    {method.type === 'qris' ? (
                        <img src={method.image} alt="QRIS" className="w-16 h-16 object-cover rounded border dark:border-gray-600" />
                    ) : (
                        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded flex items-center justify-center text-blue-600 font-bold text-xl">
                            {method.name.substring(0,3)}
                        </div>
                    )}
                    
                    <div>
                        <h3 className="font-bold text-lg text-gray-800 dark:text-white">{method.name}</h3>
                        {method.type === 'bank' ? (
                            <p className="text-sm text-gray-500 dark:text-gray-400">{method.number} a.n {method.holder}</p>
                        ) : (
                            <p className="text-sm text-gray-500 dark:text-gray-400">Scan Kode QR</p>
                        )}
                    </div>
                </div>
                
                <button onClick={() => handleDelete(method.id)} className="p-3 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-full transition">
                    <FaTrash />
                </button>
            </div>
        ))}
        {methods.length === 0 && !loading && <p className="text-center text-gray-500">Belum ada metode pembayaran.</p>}
      </div>
    </div>
  );
};

export default AdminPaymentSettings;