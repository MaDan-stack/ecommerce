import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg dark:bg-gray-800 text-center">
        <h1 className="text-8xl font-bold text-primary" data-aos="fade-up">
          404
        </h1>
        <h2 className="text-3xl font-semibold mt-4" data-aos="fade-up" data-aos-delay="200">
          Halaman Tidak Ditemukan
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-md" data-aos="fade-up" data-aos-delay="400">
          Maaf, halaman yang Anda cari tidak ada atau mungkin telah dipindahkan.
        </p>
        <div className="mt-8" data-aos="fade-up" data-aos-delay="600">
          <Link 
            to="/" 
            className="bg-gradient-to-r from-red-500 to-orange-500 hover:scale-105 duration-200 text-white py-2 px-8 rounded-full"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;