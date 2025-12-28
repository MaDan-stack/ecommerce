import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // 1. TAMBAH STATE BARU
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    // 2. UPDATE VALIDASI: Pastikan semua kolom terisi
    if (!name || !email || !password || !confirmPassword) {
      setError("Semua kolom harus diisi.");
      return;
    }

    // 3. TAMBAH VALIDASI KECOCOKAN PASSWORD
    if (password !== confirmPassword) {
      setError("Password dan Konfirmasi Password tidak cocok.");
      return;
    }

    // 4. VALIDASI PANJANG PASSWORD (Opsional tapi disarankan)
    if (password.length < 6) {
      setError("Password harus minimal 6 karakter.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Simulasi proses registrasi
      // await new Promise((resolve) => setTimeout(resolve, 1000)); // Bisa di-uncomment jika ingin delay
      
      // Kirim data ke register context (biasanya confirmPassword tidak perlu dikirim ke backend)
      await register({ name, email, password }); 
      
      alert("Registrasi berhasil! Silakan login.");
      navigate("/login");
    } catch (err) {
      console.error("Registrasi gagal:", err);
      // Menangkap pesan error spesifik dari backend jika ada (misal: err.response.data.msg)
      setError(err.message || "Registrasi gagal. Silakan coba lagi.");
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
            
            {/* 5. TAMBAH INPUT KONFIRMASI PASSWORD DI SINI */}
            <input
              type="password"
              placeholder="Konfirmasi Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              // Tambahkan border merah jika password tidak cocok saat user mengetik
              className={`w-full rounded-full border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 ${
                confirmPassword && password !== confirmPassword 
                  ? "border-red-500 focus:ring-red-500" 
                  : "border-gray-300 dark:border-gray-500"
              }`}
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