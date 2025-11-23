import React from "react";
import BannerImg from "../../assets/women/women2.jpg"; 
import { GrSecure } from "react-icons/gr";
import { FaShippingFast } from "react-icons/fa";
import { MdPayment } from "react-icons/md";
import { BiSolidOffer } from "react-icons/bi";

const Banner = () => {
  return (
    <div className="min-h-[550px] flex justify-center items-center py-12 sm:py-0">
      <div className="container">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
          <div data-aos="zoom-in">
            <img
              src={BannerImg}
              alt="Winter Sale"
              className="max-w-[400px] h-[350px] w-full mx-auto drop-shadow-[-10px_10px_12px_rgba(0,0,0,0.5)] object-cover rounded-md"
            />
          </div>
          <div className="flex flex-col justify-center gap-6 sm:pt-0">
            <h1 data-aos="fade-up" className="text-3xl sm:text-4xl font-bold">
              Diskon Akhir Tahun hingga 50%
            </h1>
            <p
              data-aos="fade-up"
              className="text-sm text-gray-500 tracking-wide leading-5"
            >
              Dapatkan jaket, sweater, dan pakaian hangat berkualitas tinggi dengan penawaran terbaik hanya di LokalStyle.
            </p>
            <div className="flex flex-col gap-4">
              <div data-aos="fade-up" className="flex items-center gap-4">
                <GrSecure className="text-4xl h-12 w-12 shadow-sm p-4 rounded-full bg-violet-100 dark:bg-violet-400" />
                <p>Produk Berkualitas</p>
              </div>
              <div data-aos="fade-up" className="flex items-center gap-4">
                <FaShippingFast className="text-4xl h-12 w-12 shadow-sm p-4 rounded-full bg-orange-100 dark:bg-orange-400" />
                <p>Pengiriman Cepat</p>
              </div>
              <div data-aos="fade-up" className="flex items-center gap-4">
                <MdPayment className="text-4xl h-12 w-12 shadow-sm p-4 rounded-full bg-green-100 dark:bg-green-400" />
                <p>Pembayaran Aman & Mudah</p>
              </div>
              <div data-aos="fade-up" className="flex items-center gap-4">
                <BiSolidOffer className="text-4xl h-12 w-12 shadow-sm p-4 rounded-full bg-yellow-100 dark:bg-yellow-400" />
                <p>Dapatkan Penawaran Terbaik</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;