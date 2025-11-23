import React from "react";

const CartPage = () => {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold">Halaman Keranjang Belanja</h1>
      <p className="text-gray-500 mt-2">
        Di sini, pengguna akan melihat daftar produk yang telah mereka tambahkan ke keranjang dan bisa melanjutkan ke proses checkout.
      </p>
      {/* Komponen keranjang belanja akan ditempatkan di sini */}
    </div>
  );
};

export default CartPage;