import React, { useContext } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
// PERBAIKAN: Menggabungkan semua import icon menjadi satu baris
import { 
  FaComments, 
  FaChartLine, 
  FaBoxOpen, 
  FaWallet, 
  FaSignOutAlt, 
  FaHome, 
  FaClipboardList, 
  FaImages, 
  FaCommentDots 
} from 'react-icons/fa';
import Logo from "../../assets/logo.png";

const AdminLayout = () => {
  const { logout } = useContext(AuthContext);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;
  const linkClass = (path) => `flex items-center gap-3 py-3 px-4 rounded-lg transition-colors mb-1 ${
    isActive(path) 
      ? 'bg-orange-500 text-white shadow-md' 
      : 'text-gray-600 dark:text-gray-300 hover:bg-orange-100 dark:hover:bg-gray-700'
  }`;

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 font-sans overflow-hidden">
      
      {/* --- SIDEBAR --- */}
      <aside className="w-64 bg-white dark:bg-gray-800 shadow-xl flex flex-col z-10 border-r dark:border-gray-700">
        <div className="p-6 border-b dark:border-gray-700 flex items-center gap-2">
          <img src={Logo} alt="Logo" className="w-8" />
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">LokalAdmin</h1>
        </div>

        <nav className="flex-1 px-4 py-6 overflow-y-auto">
          <Link to="/admin" className={linkClass('/admin')}>
            <FaChartLine /> Dashboard
          </Link>
          
          {/* Menu Kelola Pesanan */}
          <Link to="/admin/orders" className={linkClass('/admin/orders')}>
            <FaClipboardList /> Kelola Pesanan
          </Link>

          <Link to="/admin/payments" className={linkClass('/admin/payments')}>
            <FaWallet /> Metode Pembayaran
          </Link>

          <Link to="/admin/products" className={linkClass('/admin/products')}>
            <FaBoxOpen /> Kelola Produk
          </Link>

          <Link to="/admin/hero" className={linkClass('/admin/hero')}>
            <FaImages /> Kelola Hero
          </Link>

          <Link to="/admin/reviews" className={linkClass('/admin/reviews')}>
            <FaCommentDots /> Moderasi Ulasan
          </Link>
          
          <Link to="/admin/testimonials" className={linkClass('/admin/testimonials')}>
            <FaComments /> Kelola Testimoni
          </Link>
          
          <div className="my-4 border-t dark:border-gray-700"></div>
          
          <Link to="/" className={linkClass('/')}>
            <FaHome /> Lihat Website
          </Link>
        </nav>

        <div className="p-4 border-t dark:border-gray-700">
          <button 
            onClick={logout} 
            className="flex items-center justify-center gap-2 w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition shadow-sm"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </aside>

      {/* --- KONTEN UTAMA --- */}
      <main className="flex-1 overflow-y-auto p-8 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
        <Outlet /> 
      </main>

    </div>
  );
};

export default AdminLayout;