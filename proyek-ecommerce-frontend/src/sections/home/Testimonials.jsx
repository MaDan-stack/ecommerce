import React from "react";
import Slider from "react-slick";
import PropTypes from 'prop-types';

const Testimonials = ({ testimonials }) => {
  const settings = {
    dots: true,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    cssEase: "linear",
    pauseOnHover: true,
    pauseOnFocus: true,
    slidesToShow: 3,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div className="py-10 mb-10 flex items-center justify-center">
      <div className="container">
        <div className="text-center mb-10 max-w-[600px] mx-auto">
          <p data-aos="fade-up" className="text-sm text-primary">
            Apa kata pelanggan kami
          </p>
          <h1 data-aos="fade-up" className="text-3xl font-bold">
            Testimoni
          </h1>
          <p data-aos="fade-up" className="text-xs text-gray-400">
            Pendapat jujur dari para pelanggan yang sudah merasakan kualitas produk dan layanan kami.
          </p>
        </div>

        <div data-aos="zoom-in">
          <Slider {...settings}>
            {testimonials.map((data) => (
              <div key={data.id} className="p-4">
                <div className="flex flex-col gap-4 shadow-lg py-8 px-6 mx-4 rounded-xl dark:bg-gray-800 bg-primary/10 relative">
                  <div className="mb-4">
                    <img
                      src={data.img}
                      alt={data.name}
                      className="rounded-full w-20 h-20 object-cover"
                    />
                  </div>
                  <div className="flex flex-col items-center gap-4">
                    <div className="space-y-3">
                      <p className="text-xs text-gray-500">{data.text}</p>
                      <h1 className="text-xl font-bold text-black/80 dark:text-white">
                        {data.name}
                      </h1>
                    </div>
                  </div>
                  <p className="text-black/20 text-9xl font-serif absolute top-0 right-0">
                    ,,
                  </p>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
};

Testimonials.propTypes = {
  testimonials: PropTypes.array.isRequired,
};

export default Testimonials;