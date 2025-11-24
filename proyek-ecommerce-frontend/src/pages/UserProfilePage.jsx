import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { updateProfile } from '../utils/api';
import toast from 'react-hot-toast';
import { FaUser, FaLock, FaSave } from 'react-icons/fa';

const UserProfilePage = () => {
  const { authedUser } = useContext(AuthContext);
  
  // State Form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  
  // State Password
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (authedUser) {
        setName(authedUser.name);
        setEmail(authedUser.email);
    }
  }, [authedUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validasi sederhana
    if (newPassword && newPassword !== confirmPassword) {
        toast.error("Password baru tidak cocok!");
        setLoading(false);
        return;
    }

    const payload = {
        name,
        // Kirim password hanya jika user mengisinya
        ...(newPassword ? { currentPassword, newPassword } : {})
    };

    const result = await updateProfile(payload);

    if (!result.error) {
        toast.success(result.message);
        // Reset field password agar aman
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        // Opsional: Update context user jika perlu (biasanya perlu reload atau setAuthedUser)
        // Tapi nama di header mungkin belum berubah sampai refresh, itu tidak masalah untuk sekarang.
    } else {
        toast.error(result.message);
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto px-4 py-12 min-h-[80vh]">
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg border dark:border-gray-700 overflow-hidden">
        
        {/* Header */}
        <div className="bg-orange-500 p-6 text-white">
            <h1 className="text-2xl font-bold flex items-center gap-2">
                <FaUser /> Pengaturan Akun
            </h1>
            <p className="opacity-90 text-sm mt-1">Kelola informasi profil dan keamanan Anda.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
            
            {/* Bagian 1: Info Dasar */}
            <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 border-b pb-2 border-gray-200 dark:border-gray-700">
                    Informasi Dasar
                </h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium mb-1 dark:text-gray-300">Email (Tidak dapat diubah)</label>
                        <input 
                            type="email" 
                            value={email} 
                            disabled 
                            className="w-full p-3 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-500 cursor-not-allowed"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 dark:text-gray-300">Nama Lengkap</label>
                        <input 
                            type="text" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-900 focus:ring-2 focus:ring-orange-500 outline-none"
                        />
                    </div>
                </div>
            </div>

            {/* Bagian 2: Ganti Password */}
            <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 border-b pb-2 border-gray-200 dark:border-gray-700 flex items-center gap-2">
                    <FaLock className="text-sm" /> Ganti Password (Opsional)
                </h2>
                <p className="text-xs text-gray-500">Kosongkan jika tidak ingin mengubah password.</p>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1 dark:text-gray-300">Password Lama</label>
                        <input 
                            type="password" 
                            value={currentPassword} 
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-900 focus:ring-2 focus:ring-orange-500 outline-none"
                            placeholder="Diperlukan jika mengganti password"
                        />
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-1 dark:text-gray-300">Password Baru</label>
                            <input 
                                type="password" 
                                value={newPassword} 
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-900 focus:ring-2 focus:ring-orange-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 dark:text-gray-300">Ulangi Password Baru</label>
                            <input 
                                type="password" 
                                value={confirmPassword} 
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-900 focus:ring-2 focus:ring-orange-500 outline-none"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Tombol Simpan */}
            <div className="pt-4 flex justify-end">
                <button 
                    type="submit" 
                    disabled={loading}
                    className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-full font-bold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center gap-2 disabled:opacity-50"
                >
                    <FaSave /> {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
            </div>

        </form>
      </div>
    </div>
  );
};

export default UserProfilePage;