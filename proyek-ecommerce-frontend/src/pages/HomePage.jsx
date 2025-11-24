import React, { useState, useEffect } from "react";
import Hero from "../sections/home/Hero";
import TopSellingProducts from "../sections/home/TopSellingProducts";
import TopRatedProducts from "../sections/home/TopRatedProducts";
import Banner from "../sections/home/Banner";
import Subscribe from "../sections/home/Subscribe";
import Testimonials from "../sections/home/Testimonials";
import AddTestimonial from "../sections/home/AddTestimonial"; 
import { getAllTestimonials, addTestimonialAPI } from "../utils/api"; // <-- Ganti import
import toast from 'react-hot-toast';

const HomePage = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Ambil data dari API saat halaman dimuat
  const fetchTestimonials = async () => {
    setLoading(true);
    const { error, data } = await getAllTestimonials();
    if (!error) {
      setTestimonials(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  // 2. Handler tambah testimoni ke API
  const handleAddTestimonial = async (testimonialData) => {
    // testimonialData dari komponen AddTestimonial berupa { name, text }
    // Tapi API kita hanya butuh { text }, nama diambil dari token di backend
    
    const { error } = await addTestimonialAPI(testimonialData.text);
    
    if (!error) {
      toast.success("Terima kasih atas ulasan Anda!");
      fetchTestimonials(); // Refresh data agar testimoni baru muncul
    }
  };

  return (
    <div>
      <Hero />
      <TopSellingProducts />
      <TopRatedProducts />
      <Banner />
      <Subscribe />
      
      {/* Kirim data API ke komponen */}
      {loading ? (
        <p className="text-center py-10">Memuat testimoni...</p>
      ) : (
        <Testimonials testimonials={testimonials} />
      )}
      
      <AddTestimonial onAdd={handleAddTestimonial} />
    </div>
  );
};

export default HomePage;