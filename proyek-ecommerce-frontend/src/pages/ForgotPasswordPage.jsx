import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../utils/api';
import toast from 'react-hot-toast';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
        toast.error("Email harus diisi");
        return;
    }

    setLoading(true);
    const result = await forgotPassword(email);

    if (!result.error) {
        toast.success(result.message);
        setEmail('');
    } else {
        toast.error(result.message || "Gagal mengirim email reset");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border dark:border-gray-700">
        <h1 className="text-2xl font-bold text-center mb-2 text-gray-800 dark:text-white">Lupa Password?</h1>
        <p className="text-center text-gray-500 dark:text-gray-400 mb-6 text-sm">
          Masukkan email yang terdaftar, kami akan mengirimkan link untuk mereset password Anda.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-orange-500 outline-none transition"
              placeholder="contoh@email.com"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg transition duration-300 disabled:opacity-70"
          >
            {loading ? 'Mengirim...' : 'Kirim Link Reset'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/login" className="text-sm text-orange-500 hover:underline font-medium">
            Kembali ke Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;