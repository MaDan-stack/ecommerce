import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { getHeroSlides } from "../../utils/api"; 
import PropTypes from 'prop-types';

// Perbaikan: Ubah div menjadi button, tambah type="button", aria-label (S6848, S1082)
const NextArrow = ({ onClick }) => {
  return (
    <button
      type="button"
      className="absolute right-4 top-1/2 z-20 -translate-y-1/2 cursor-pointer bg-white/50 hover:bg-orange-500 hover:text-white text-gray-800 p-3 rounded-full shadow-lg transition-all duration-200 hidden sm:block outline-none focus:ring-2 focus:ring-orange-500"
      onClick={onClick}
      aria-label="Next slide"
    >
      <FaArrowRight />
    </button>
  );
};

NextArrow.propTypes = {
  onClick: PropTypes.func,
};

// Perbaikan: Ubah div menjadi button
const PrevArrow = ({ onClick }) => {
  return (
    <button
      type="button"
      className="absolute left-4 top-1/2 z-20 -translate-y-1/2 cursor-pointer bg-white/50 hover:bg-orange-500 hover:text-white text-gray-800 p-3 rounded-full shadow-lg transition-all duration-200 hidden sm:block outline-none focus:ring-2 focus:ring-orange-500"
      onClick={onClick}
      aria-label="Previous slide"
    >
      <FaArrowLeft />
    </button>
  );
};

PrevArrow.propTypes = {
  onClick: PropTypes.func,
};

const Hero = () => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { error, data } = await getHeroSlides();
        if (!error && data.length > 0) {
          setSlides(data);
        } else {
          setSlides([]);
        }
      } catch (err) {
        console.error("Gagal memuat slide:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const settings = {
    dots: true,
    arrows: true,
    infinite: true,
    speed: 800,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    cssEase: "ease-in-out",
    pauseOnHover: true,
    pauseOnFocus: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  if (loading) {
    return (
      <div className="min-h-[550px] sm:min-h-[650px] bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-48 bg-gray-300 dark:bg-gray-700 rounded mb-4"></div>
          <div className="h-4 w-64 bg-gray-300 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  if (slides.length === 0) {
    return (
      <div className="min-h-[400px] bg-gray-100 dark:bg-gray-900 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 p-8 text-center">
        <p className="text-xl font-semibold mb-2">Belum ada banner promo.</p>
        <p className="text-sm">Admin, silakan tambahkan slide melalui Dashboard.</p>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden min-h-[550px] sm:min-h-[650px] bg-gray-100 flex justify-center items-center dark:bg-gray-950 dark:text-white duration-200 z-0">
      
      {/* Background Shape */}
      <div className="h-[700px] w-[700px] bg-orange-500/40 absolute -top-1/2 right-0 rounded-3xl rotate-45 -z-10 animate-pulse duration-1000"></div>
      
      <div className="container pb-8 sm:pb-0">
        <Slider {...settings}>
          {slides.map((data) => (
            <div key={data.id}>
              <div className="grid grid-cols-1 sm:grid-cols-2 px-4 sm:px-0">
                
                {/* Kolom Teks */}
                <div className="flex flex-col justify-center gap-4 pt-12 sm:pt-0 text-center sm:text-left order-2 sm:order-1 relative z-10 sm:pl-16">
                  <h1
                    className="text-4xl sm:text-6xl lg:text-7xl font-bold leading-tight"
                  >
                    {data.title}
                  </h1>
                  <p
                    className="text-sm sm:text-base text-gray-600 dark:text-gray-300"
                  >
                    {data.description}
                  </p>
                  <div
                    data-aos="fade-up"
                    data-aos-duration="500"
                    data-aos-delay="300"
                  >
                    <Link to="/products">
                      <button
                        className="bg-gradient-to-r from-orange-500 to-red-500 hover:scale-105 duration-200 text-white py-3 px-8 rounded-full font-bold shadow-md mt-4"
                      >
                        Belanja Sekarang
                      </button>
                    </Link>
                  </div>
                </div>

                {/* Kolom Gambar */}
                <div className="order-1 sm:order-2 flex justify-center items-center">
                  <div
                    className="relative z-10"
                  >
                    <img
                      src={data.img}
                      alt={data.title}
                      className="w-[300px] h-[300px] sm:h-[450px] sm:w-[450px] sm:scale-105 lg:scale-120 object-contain mx-auto drop-shadow-2xl"
                      onError={(e) => { e.target.src = 'https://placehold.co/400x400?text=No+Image'; }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default Hero;