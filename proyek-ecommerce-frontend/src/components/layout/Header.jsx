import React, { useState, useContext } from "react";
import { Link, useNavigate } from 'react-router-dom';
import Logo from "../../assets/logo.png";
import DarkMode from "../ui/DarkMode.jsx";
import { IoMdSearch } from "react-icons/io";
// Tambahkan FaHistory di sini
import { FaShoppingCart, FaCaretDown, FaUserCircle, FaSignOutAlt, FaChartLine, FaHistory } from "react-icons/fa";
import { CartContext } from "../../contexts/CartContext";
import { AuthContext } from "../../contexts/AuthContext";

const Menu = [
  { id: 1, name: "Home", link: "/" },
  { id: 2, name: "Produk", link: "/products" },
  { id: 3, name: "Wanita", link: "/products?category=women" },
  { id: 4, name: "Pria", link: "/products?category=men" },
];

const DropdownLinks = [
  { id: 1, name: "Produk Terlaris", link: "/products?sort=trending" },
  { id: 2, name: "Rating Tertinggi", link: "/products?sort=top-rated" },
];

const Header = () => {
  const { toggleCart, cartItems } = useContext(CartContext);
  const { authedUser, logout } = useContext(AuthContext);
  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== "") {
      navigate(`/search?q=${searchQuery}`);
      setSearchQuery("");
    }
  };

  return (
    <div className="shadow-md bg-white dark:bg-gray-900 dark:text-white duration-200 z-40 sticky top-0">
      <div className="bg-orange-200/40 py-2 flex justify-center items-center">
        <div className="container flex justify-between items-center">
          <Link to="/" className="font-bold text-2xl sm:text-3xl flex gap-2 items-center">
            <img src={Logo} alt="LokalStyle Logo" className="w-10" />
            LokalStyle
          </Link>

          <div className="flex justify-between items-center gap-4">
            <form onSubmit={handleSearch} className="relative group hidden sm:block">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari produk..."
                className="w-[200px] sm:w-[200px] group-hover:w-[300px] transition-all duration-300 rounded-full border border-gray-300 px-2 py-1 focus:outline-none focus:border-orange-500 dark:border-gray-500 dark:bg-gray-800"
              />
              <button type="submit" aria-label="Cari" className="absolute top-1/2 -translate-y-1/2 right-3 bg-transparent border-none">
                <IoMdSearch className="text-gray-500 group-hover:text-orange-500" />
              </button>
            </form>
            
            <button
              onClick={toggleCart}
              className="bg-gradient-to-r from-red-500 to-orange-500 transition-all duration-200 text-white py-1 px-4 rounded-full flex items-center gap-3 group relative"
              aria-label="Buka keranjang belanja"
            >
              <span className="group-hover:block hidden transition-all duration-200">
                Keranjang
              </span>
              <FaShoppingCart className="text-xl text-white drop-shadow-sm cursor-pointer" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>
            
            {authedUser ? (
              <div className="flex items-center gap-2">
                {/* --- UBAH BAGIAN INI --- */}
                <Link to="/profile" className="hidden sm:flex items-center gap-2 hover:text-orange-500 transition font-medium" title="Pengaturan Akun">
                    <span>Halo, {authedUser.name}</span>
                </Link>
                
                {authedUser.role === 'admin' && (
                  <Link to="/admin" title="Ke Dashboard Admin">
                    <button className="p-2 rounded-full bg-orange-100 dark:bg-gray-700 text-orange-600 hover:bg-orange-200 transition-colors">
                      <FaChartLine />
                    </button>
                  </Link>
                )}

                {/* --- TOMBOL BARU: Riwayat Pesanan --- */}
                <Link to="/orders" title="Riwayat Pesanan">
                    <button className="p-2 rounded-full hover:bg-white/20 text-gray-600 dark:text-gray-200">
                        <FaHistory className="text-xl" />
                    </button>
                </Link>
                {/* ----------------------------------- */}

                <button onClick={logout} className="p-2 rounded-full hover:bg-white/20 text-gray-600 dark:text-gray-200" title="Logout">
                  <FaSignOutAlt className="text-xl" />
                </button>
              </div>
            ) : (
              <Link to="/login">
                <button
                  className="bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-200 text-white py-1 px-4 rounded-full flex items-center gap-2"
                  aria-label="Login"
                >
                  Login
                  <FaUserCircle className="text-xl" />
                </button>
              </Link>
            )}

            <div>
              <DarkMode />
            </div>
          </div>
        </div>
      </div>
      {/* Lower Navbar */}
      <div data-aos className="flex justify-center">
        <ul className="sm:flex hidden items-center gap-4 py-2">
          {Menu.map((data) => (
            <li key={data.id}>
              <Link
                to={data.link}
                className="inline-block px-4 hover:text-orange-500 duration-200"
              >
                {data.name}
              </Link>
            </li>
          ))}
          <li className="group relative cursor-pointer">
            <button className="flex items-center gap-1 hover:text-orange-500 py-2">
              Kategori
              <span>
                <FaCaretDown className="transition-all duration-200 group-hover:rotate-180" />
              </span>
            </button>
            <div className="absolute z-[9999] hidden group-hover:block w-[200px] rounded-md bg-white p-2 text-black shadow-md">
              <ul>
                {DropdownLinks.map((data) => (
                  <li key={data.id}>
                    <Link
                      to={data.link}
                      className="inline-block w-full rounded-md p-2 hover:bg-orange-500/20"
                    >
                      {data.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Header;