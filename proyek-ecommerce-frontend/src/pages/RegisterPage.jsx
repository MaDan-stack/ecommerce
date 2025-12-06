import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError("Semua kolom harus diisi.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Simulasi proses registrasi
      await new Promise((resolve) => setTimeout(resolve, 1000));
      register({ name, email, password}); // Pastikan register dari context juga menerima password jika backend sudah siap
      alert("Registrasi berhasil! Silakan login.");
      navigate("/login");
    } catch (err) {
      // PERBAIKAN DI SINI:
      // Gunakan variabel 'err' untuk logging
      console.error("Registrasi gagal:", err);
      setError("Registrasi gagal. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg dark:bg-gray-800">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Buat Akun Baru</h1>
          <p className="text-gray-500 mt-2">
            Daftar untuk mulai berbelanja di LokalStyle.
          </p>
        </div>
        <form onSubmit={handleRegister} className="space-y-6">
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Nama Lengkap"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-full border border-gray-300 dark:border-gray-500 dark:bg-gray-700 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={loading}
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-full border border-gray-300 dark:border-gray-500 dark:bg-gray-700 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={loading}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-full border border-gray-300 dark:border-gray-500 dark:bg-gray-700 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={loading}
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center !mt-4">{error}</p>}
          <div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:scale-105 duration-200 text-white py-2 px-8 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? "Mendaftarkan..." : "Register"}
            </button>
          </div>
          <p className="text-center !mt-8">
            Sudah punya akun?{" "}
            <Link to="/login" className="text-orange-500 hover:underline">
              Login di sini
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;