import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import RatingStars from './RatingStars';
import { formatPrice } from '../../utils/formatters';

const getStartingPrice = (variants) => {
  if (!variants || variants.length === 0) return formatPrice(0);
  const minPrice = Math.min(...variants.map(v => v.price));
  return formatPrice(minPrice);
};

const ProductCard = ({ product, aosDelay }) => {
  // --- LOGIKA MULTI IMAGE ---
  // Ambil gambar pertama sebagai thumbnail
  let mainImage = '';
  if (Array.isArray(product.img) && product.img.length > 0) {
      mainImage = product.img[0];
  } else if (typeof product.img === 'string') {
      // Handle jika data lama / format string JSON
      try {
          const parsed = JSON.parse(product.img);
          mainImage = Array.isArray(parsed) ? parsed[0] : product.img;
      } catch {
          mainImage = product.img;
      }
  } else {
      mainImage = 'https://placehold.co/400x300?text=No+Image';
  }

  return (
    <Link to={`/products/${product.id}`}>
      <div
        data-aos="fade-up"
        data-aos-delay={aosDelay}
        className="space-y-3 p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 h-full bg-white dark:bg-gray-800 border border-transparent hover:border-orange-100 dark:hover:border-gray-700 group"
      >
        <div className="relative overflow-hidden rounded-md h-[220px]">
            <img
            src={mainImage}
            alt={product.title}
            className="h-full w-full object-cover transform group-hover:scale-105 transition-transform duration-500"
            onError={(e) => { 
                e.target.onerror = null; 
                e.target.src = 'https://placehold.co/400x300?text=No+Image'; 
            }}
            />
            {product.variants && product.variants.some(v => v.stock === 0) && (
                <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded shadow">
                    Stok Menipis
                </div>
            )}
        </div>
        
        <div>
          <h3 className="font-semibold text-black dark:text-white line-clamp-1 group-hover:text-orange-500 transition-colors">{product.title}</h3>
          <p className="text-sm font-bold text-orange-500 mt-1">
            Mulai {getStartingPrice(product.variants)}
          </p>
          <div className="mt-2">
            <RatingStars rating={product.rating} reviewCount={product.reviewCount} />
          </div>
        </div>
      </div>
    </Link>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.number.isRequired,
    // img bisa string atau array of strings
    img: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(PropTypes.string)
    ]).isRequired,
    title: PropTypes.string.isRequired,
    rating: PropTypes.number,
    reviewCount: PropTypes.number,
    variants: PropTypes.arrayOf(PropTypes.shape({
      price: PropTypes.number.isRequired,
    })),
  }).isRequired,
  aosDelay: PropTypes.string,
};

export default ProductCard;