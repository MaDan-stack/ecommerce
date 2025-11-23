import React, { useState } from "react";
import Hero from "../sections/home/Hero";
import TopSellingProducts from "../sections/home/TopSellingProducts";
import TopRatedProducts from "../sections/home/TopRatedProducts";
import Banner from "../sections/home/Banner";
import Subscribe from "../sections/home/Subscribe";
import Testimonials from "../sections/home/Testimonials";
import AddTestimonial from "../sections/home/AddTestimonial"; 
import { getTestimonials, addTestimonial } from "../utils/data"; 

const HomePage = () => {
  // --- BAGIAN YANG DIPERBAIKI ---
  // 1. Inisialisasi state dengan data yang ada, bukan array kosong.
  const [testimonials, setTestimonials] = useState(getTestimonials());

  // 2. Ambil data testimoni saat komponen pertama kali dimuat
  // (Tidak perlu useEffect karena data.jsx adalah sinkron)
  
  // 3. Buat handler untuk menambah testimoni baru
  const handleAddTestimonial = (testimonial) => {
    addTestimonial(testimonial);
    // Perbarui state agar UI me-render ulang dengan data baru
    // getTestimonials() akan mengambil array yang sudah dimutasi
    setTestimonials(getTestimonials()); 
  };

  return (
    <div>
      <Hero />
      <TopSellingProducts />
      <TopRatedProducts />
      <Banner />
      <Subscribe />
      {/* 4. Kirim data testimoni dan handler sebagai prop */}
      <Testimonials testimonials={testimonials} />
      <AddTestimonial onAdd={handleAddTestimonial} />
    </div>
  );
};

export default HomePage;