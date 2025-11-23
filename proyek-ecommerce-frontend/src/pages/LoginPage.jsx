import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
      // Panggil fungsi login dari Context (yang terhubung ke API)
      const result = await login({ email, password });

      // Cek hasil login
      if (result && !result.error) {
        // Redirect berdasarkan role yang dikembalikan backend
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
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg dark:bg-gray-800">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Login Pelanggan</h1>
          <p className="text-gray-500 mt-2 text-sm">
            Masuk untuk melanjutkan proses belanja Anda.
          </p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">Email</label>
              <input
                id="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 dark:text-white"
                disabled={loading}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 dark:text-white"
                disabled={loading}
              />
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
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:scale-[1.02] transition-transform duration-200 text-white py-3 px-8 rounded-lg font-bold shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
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