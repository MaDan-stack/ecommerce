// Mengimpor semua gambar yang dibutuhkan
import ImgWomen1 from "../assets/women/women.png";
import ImgWomen2 from "../assets/women/women2.jpg";
import ImgWomen3 from "../assets/women/women3.jpg";
import ImgWomen4 from "../assets/women/women4.jpg";
import ImgShirt1 from "../assets/shirt/shirt.png";
import ImgShirt2 from "../assets/shirt/shirt2.png";
import ImgShirt3 from "../assets/shirt/shirt3.png";

let ProductsData = [
  // --- Produk untuk "Top Penjualan" (4 produk wanita) ---
  { 
    id: 1, 
    img: ImgWomen1, 
    title: "Gaun Pesta Elegan", 
    rating: 4.8, 
    reviewCount: 150, 
    category: "women", 
    description: "Gaun elegan dengan bahan premium, cocok untuk acara spesial Anda.",
    variants: [
      { size: "S", price: 350000, stock: 10 },
      { size: "M", price: 350000, stock: 15 },
      { size: "L", price: 350000, stock: 8 },
    ]
  },
  { 
    id: 2, 
    img: ImgWomen2, 
    title: "Summer Dress Casual", 
    rating: 4.5, 
    reviewCount: 120, 
    category: "women", 
    description: "Dress kasual yang nyaman dan adem, sempurna untuk liburan musim panas.",
    variants: [
      { size: "S", price: 225000, stock: 7 },
      { size: "M", price: 225000, stock: 12 },
    ]
  },
  { 
    id: 3, 
    img: ImgWomen3, 
    title: "Blouse Kantor Modern", 
    rating: 4.7, 
    reviewCount: 195, 
    category: "women", 
    description: "Tampil profesional dan stylish dengan blouse modern untuk ke kantor.",
    variants: [
      { size: "M", price: 180000, stock: 20 },
      { size: "L", price: 180000, stock: 15 },
    ]
  },
  { 
    id: 4, 
    img: ImgWomen4, 
    title: "Jaket Retro 90s", 
    rating: 4.9, 
    reviewCount: 210, 
    category: "women", 
    description: "Jaket bergaya retro yang akan membuat penampilanmu standout.",
    variants: [
      { size: "L", price: 450000, stock: 5 },
      { size: "XL", price: 450000, stock: 3 },
    ]
  },
  // --- Produk untuk "Produk Terbaik" (3 kemeja) ---
  { 
    id: 5, 
    img: ImgShirt1, 
    title: "Kemeja Corduroy Biru", 
    // PERBAIKAN: 5.0 diubah menjadi 5
    rating: 5, 
    reviewCount: 80, 
    category: "men", 
    description: "Kemeja pria bahan corduroy yang tebal namun tetap adem dan nyaman.",
    variants: [
      { size: "M", price: 280000, stock: 20 },
      { size: "L", price: 280000, stock: 18 },
      { size: "XL", price: 300000, stock: 5 },
    ]
  },
  { 
    id: 6, 
    img: ImgShirt2, 
    title: "Kemeja Garis Vertikal", 
    // PERBAIKAN: 5.0 diubah menjadi 5
    rating: 5, 
    reviewCount: 50, 
    category: "men", 
    description: "Kemeja motif garis vertikal yang memberikan kesan lebih ramping dan tinggi.",
    variants: [
        { size: "M", price: 250000, stock: 14 },
        { size: "L", price: 250000, stock: 10 },
    ]
  },
  { 
    id: 7, 
    img: ImgShirt3, 
    title: "Blouse Kotak Simpul", 
    // PERBAIKAN: 5.0 diubah menjadi 5
    rating: 5, 
    reviewCount: 30, 
    category: "women", 
    description: "Blouse wanita modern dengan motif kotak dan aksen simpul di bagian depan.",
    variants: [
        { size: "S", price: 195000, stock: 25 },
        { size: "M", price: 195000, stock: 15 },
    ]
  },
];

let TestimonialData = [
    { id: 1, name: "Andi Wijaya", text: "Kualitas batiknya luar biasa! Bahannya adem dan motifnya unik. Pengiriman juga cepat. Sangat puas belanja di sini.", img: "https://i.pravatar.cc/150?u=andi" },
    { id: 2, name: "Rina Sugiarto", text: "Akhirnya nemu dress tenun yang pas di badan dan modelnya modern. Deskripsi produknya sangat akurat. Terima kasih LokalStyle!", img: "https://i.pravatar.cc/150?u=rina" },
    { id: 3, name: "Budi Santoso", text: "Sebagai kolektor kemeja, saya sangat terkesan dengan pilihan produk dari UMKM lokal di sini. Terkurasi dengan baik!", img: "https://i.pravatar.cc/150?u=budi" },
    { id: 4, name: "Dewi Lestari", text: "Pelayanannya ramah dan responsif. Awalnya ragu, tapi ternyata produknya jauh lebih bagus dari fotonya. Pasti langganan.", img: "https://i.pravatar.cc/150?u=dewi" },
];

// --- FUNGSI-FUNGSI PENGELOLA DATA ---

const getProducts = () => ProductsData;

// PERBAIKAN: 5.0 diubah menjadi 5
const getTopRatedProducts = () => ProductsData.filter((p) => p.rating === 5).slice(0, 3);

const getBestSellingProducts = () => {
  const womenProducts = ProductsData.filter((p) => p.category === 'women');
  womenProducts.sort((a, b) => b.reviewCount - a.reviewCount);
  return womenProducts.slice(0, 4);
};

const getTestimonials = () => {
  const storedTestimonials = localStorage.getItem('testimonials');
  if (storedTestimonials) {
    return JSON.parse(storedTestimonials);
  }
  return TestimonialData;
};

const getProductById = (id) => ProductsData.find((product) => product.id === id);

const addTestimonial = (testimonial) => {
  const testimonials = getTestimonials();
  const newTestimonial = {
    id: Date.now(), 
    img: `https://i.pravatar.cc/150?u=${testimonial.name}`, 
    ...testimonial,
  };
  const updatedTestimonials = [newTestimonial, ...testimonials];
  localStorage.setItem('testimonials', JSON.stringify(updatedTestimonials));
};

// Fungsi Tambah, Hapus, Perbarui (CRUD)
const addProduct = (newProduct) => {
  // PERBAIKAN: +new Date() diubah menjadi Date.now()
  ProductsData.push({ id: Date.now(), ...newProduct });
};
const deleteProduct = (id) => {
  ProductsData = ProductsData.filter((product) => product.id !== id);
};
const updateProduct = (id, updatedData) => {
  ProductsData = ProductsData.map((product) => product.id === id ? { ...product, ...updatedData } : product);
};

export {
  getProducts,
  getTopRatedProducts,
  getBestSellingProducts,
  getTestimonials,
  getProductById,
  addProduct,
  deleteProduct,
  updateProduct,
  addTestimonial,
};