import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';

// Hapus prop handleOrderPopup karena tidak lagi dibutuhkan
const FeaturedProductCard = ({ product }) => {
  return (
    // Seluruh kartu dibungkus Link ke halaman detail
    <Link to={`/products/${product.id}`} className="group">
      <div
        data-aos="zoom-in"
        className="rounded-2xl bg-white dark:bg-gray-800 hover:bg-black/80 dark:hover:bg-orange-500 hover:text-white relative shadow-xl duration-300 max-w-[300px] cursor-pointer"
      >
        {/* Bagian Gambar */}
        <div className="h-[100px]">
          <img
            src={product.img}
            alt={product.title}
            className="max-w-[140px] block mx-auto transform -translate-y-20 group-hover:scale-105 duration-300 drop-shadow-md"
          />
        </div>
        
        {/* Bagian Teks */}
        <div className="p-4 text-center">
          {/* Rating */}
          <div className="w-full flex items-center justify-center gap-1">
            {[...Array(5)].map((_, i) => (
               <FaStar key={i} className="text-yellow-500" />
            ))}
          </div>
          <h1 className="text-xl font-bold">{product.title}</h1>
          <p className="text-gray-500 group-hover:text-white duration-300 text-sm line-clamp-2">
            {product.description}
          </p>
          
          {/* Tombol diubah fungsinya menjadi visual saja */}
          <button
            className="bg-orange-500 hover:scale-105 duration-300 text-white py-1 px-4 rounded-full mt-4 group-hover:bg-white group-hover:text-orange-600"
            // onClick dihapus agar event bubbling ke Link parent terjadi (pindah halaman)
          >
            Lihat Detail
          </button>
        </div>
      </div>
    </Link>
  );
};

FeaturedProductCard.propTypes = {
  product: PropTypes.object.isRequired,
};

export default FeaturedProductCard;