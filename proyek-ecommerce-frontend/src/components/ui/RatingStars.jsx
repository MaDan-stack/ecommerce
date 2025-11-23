import React from 'react';
import PropTypes from 'prop-types';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

const RatingStars = ({ rating, reviewCount }) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  // Bintang Penuh
  for (let i = 0; i < fullStars; i++) {
    stars.push(<FaStar key={`full-${i}`} className="text-yellow-400" />);
  }

  // Bintang Setengah
  if (hasHalfStar) {
    stars.push(<FaStarHalfAlt key="half" className="text-yellow-400" />);
  }

  // Bintang Kosong
  for (let i = 0; i < emptyStars; i++) {
    stars.push(<FaRegStar key={`empty-${i}`} className="text-gray-300" />);
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">{stars}</div>
      {reviewCount && (
        <span className="text-xs text-gray-500">({reviewCount})</span>
      )}
    </div>
  );
};

RatingStars.propTypes = {
  rating: PropTypes.number.isRequired,
  reviewCount: PropTypes.number,
};

export default RatingStars;