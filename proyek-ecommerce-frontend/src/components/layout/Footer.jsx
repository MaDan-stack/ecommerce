import React from "react";
import { Link } from "react-router-dom";
import footerLogo from "../../assets/logo.png";
import {
  FaFacebook,
  FaInstagram,
  FaLocationArrow,
  FaMobileAlt,
  FaTwitter,
} from "react-icons/fa";

const CompanyLinks = [
  { title: "Home", link: "/" },
  { title: "Produk", link: "/products" },
  { title: "Tentang Kami", link: "/about" },
];

const HelpLinks = [
  { title: "Bantuan", link: "/help" },
  { title: "Kebijakan Privasi", link: "/privacy" },
  { title: "FAQ", link: "/faq" },
];

const Footer = () => {
  return (
    <div className="bg-gray-800 text-white">
      <div className="container mx-auto py-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          
          {/* Kolom 1: Detail Perusahaan */}
          <div className="space-y-4">
            <h1 className="text-2xl font-bold flex items-center gap-3">
              <img src={footerLogo} alt="Logo" className="w-10" />
              LokalStyle
            </h1>
            <p className="text-gray-400 text-sm">
              Platform e-commerce untuk menemukan produk fesyen lokal terbaik.
            </p>
          </div>

          {/* Kolom 2: Tautan Berguna */}
          <div className="space-y-4">
            <h1 className="text-xl font-bold">Tautan</h1>
            <ul className="space-y-2">
              {CompanyLinks.map((link) => (
                <li key={link.title}>
                  <Link to={link.link} className="text-gray-400 hover:text-white duration-300 text-sm">
                    {link.title}
                  </Link>
                </li>
              ))}
              {HelpLinks.map((link) => (
                <li key={link.title}>
                  <Link to={link.link} className="text-gray-400 hover:text-white duration-300 text-sm">
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kolom 3: Kontak & Sosial Media */}
          <div className="space-y-4">
            <h1 className="text-xl font-bold">Kontak</h1>
            <div className="space-y-2">
              <div className="flex items-center gap-3 text-gray-400">
                <FaLocationArrow />
                <p className="text-sm">Surabaya, Indonesia</p>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <FaMobileAlt />
                <p className="text-sm">+62 123 4567 890</p>
              </div>
            </div>
            <div className="flex items-center gap-4 mt-4">
              <a href="#" className="text-gray-400 hover:text-white duration-300">
                <FaInstagram className="text-2xl" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white duration-300">
                <FaFacebook className="text-2xl" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white duration-300">
                <FaTwitter className="text-2xl" />
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Bar */}
      <div className="bg-gray-900 py-3">
        <div className="container mx-auto text-center">
          <p className="text-gray-500 text-sm">
            © 2025 LokalStyle. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Footer;