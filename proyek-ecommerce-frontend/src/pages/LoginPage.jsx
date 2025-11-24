import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // 1. Import Icon

const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // 2. State untuk toggle
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Email dan password tidak boleh kosong.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await login({ email, password });

      if (result && !result.error) {
        if (result.role === 'admin') {
          navigate("/admin"); 
        } else {
          navigate("/"); 
        }
      } else {
        throw new Error("Kredensial salah");
      }

    } catch (err) {
      console.error(err);
      setError("Login gagal. Periksa email dan password Anda.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg dark:bg-gray-800 border dark:border-gray-700">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Login Pelanggan</h1>
          <p className="text-gray-500 mt-2 text-sm dark:text-gray-400">
            Masuk untuk melanjutkan proses belanja Anda.
          </p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-4">
            {/* Input Email */}
            <div>
              <label htmlFor="email" className="sr-only">Email</label>
              <input
                id="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 dark:text-white transition"
                disabled={loading}
              />
            </div>

            {/* Input Password dengan Tombol Mata */}
            <div className="relative">
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                // 3. Ubah tipe input berdasarkan state
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 dark:text-white transition"
                disabled={loading}
              />
              
              {/* 4. Tombol Toggle Visibility */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-orange-500 transition-colors cursor-pointer focus:outline-none"
                tabIndex="-1" // Agar tidak bisa di-tab (opsional)
              >
                {showPassword ? <FaEye size={20} /> : < FaEyeSlash size={20}/>}
              </button>
            </div>

            {/* Link Lupa Password */}
            <div className="flex justify-end">
              <Link 
                to="/forgot-password" 
                className="text-sm text-orange-500 hover:text-orange-600 hover:underline transition duration-200 font-medium"
              >
                Lupa Password?
              </Link>
            </div>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded relative text-sm text-center">
              {error}
            </div>
          )}

          <div>
            <button 
              type="submit" 
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:scale-[1.02] transition-transform duration-200 text-white py-3 px-8 rounded-lg font-bold shadow-md disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg"
              disabled={loading}
            >
              {loading ? "Sedang masuk..." : "Login"}
            </button>
          </div>

          <p className="text-center mt-8 text-sm text-gray-600 dark:text-gray-400">
            Belum punya akun?{" "}
            <Link to="/register" className="text-orange-500 hover:underline font-semibold">
              Daftar di sini
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;