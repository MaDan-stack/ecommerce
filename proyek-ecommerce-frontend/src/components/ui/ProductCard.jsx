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
  return (
    <Link to={`/products/${product.id}`}>
      <div
        data-aos="fade-up"
        data-aos-delay={aosDelay}
        className="space-y-3 p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 h-full bg-white dark:bg-gray-800"
      >
        <img
          src={product.img}
          alt={product.title}
          className="h-[220px] w-full object-cover rounded-md"
          // --- PERBAIKAN DI SINI ---
          onError={(e) => { 
            e.target.onerror = null; 
            e.target.src = 'https://placehold.co/400x300?text=No+Image'; 
          }}
        />
        <div>
          <h3 className="font-semibold text-black dark:text-white line-clamp-1">{product.title}</h3>
          <p className="text-sm font-bold text-orange-500">
            Mulai dari {getStartingPrice(product.variants)}
          </p>
          <RatingStars rating={product.rating} reviewCount={product.reviewCount} />
        </div>
      </div>
    </Link>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.number.isRequired,
    img: PropTypes.string.isRequired,
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