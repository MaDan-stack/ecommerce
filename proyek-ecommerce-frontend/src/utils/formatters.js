/**
 * Memformat angka menjadi format mata uang Rupiah (IDR).
 * Contoh: 150000 -> "Rp 150.000"
 * @param {number} price - Angka yang akan diformat.
 * @returns {string} String harga dalam format Rupiah.
 */
export const formatPrice = (price) => {
  // Memastikan input adalah angka, jika tidak, kembalikan format untuk 0.
  if (Number.isNaN(price)) {
    price = 0;
  }
  return new Intl.NumberFormat('id-ID', { 
    style: 'currency', 
    currency: 'IDR', 
    minimumFractionDigits: 0 
  }).format(price);
};

// -----------------------------------------------------------------------------

/**
 * Memformat tanggal dari format ISO string (contoh: "2025-10-12T12:00:00.000Z")
 * menjadi format yang lebih mudah dibaca.
 * Contoh: "12 Oktober 2025"
 * @param {string} dateString - String tanggal dalam format ISO.
 * @returns {string} String tanggal yang sudah diformat.
 */
export const formatDate = (dateString) => {
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return new Date(dateString).toLocaleDateString('id-ID', options);
};

// -----------------------------------------------------------------------------

/**
 * Membuat potongan teks (excerpt) dari deskripsi yang panjang.
 * Berguna untuk kartu produk agar deskripsi tidak terlalu memakan tempat.
 * Contoh: "Ini adalah deskripsi produk yang sangat panjang..." -> "Ini adalah deskripsi..."
 * @param {string} text - Teks asli yang akan dipotong.
 * @param {number} maxLength - Jumlah karakter maksimal sebelum dipotong. Default 100.
 * @returns {string} Potongan teks yang diakhiri dengan "...".
 */
export const createExcerpt = (text, maxLength = 100) => {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength) + '...';
};

// -----------------------------------------------------------------------------

/**
 * Mengubah format angka rating menjadi format dengan satu desimal.
 * Berguna untuk memastikan konsistensi tampilan rating.
 * Contoh: 4 -> "4.0", 4.56 -> "4.6"
 * @param {number} rating - Angka rating.
 * @returns {string} String rating dengan satu angka di belakang koma.
 */
export const formatRating = (rating) => {
  return rating.toFixed(1);
};