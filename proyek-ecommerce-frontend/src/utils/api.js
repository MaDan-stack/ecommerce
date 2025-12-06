// Gunakan Environment Variable untuk URL Backend.
// Jika tidak ada (di localhost), default ke http://localhost:5000/api
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function getAccessToken() {
  return localStorage.getItem('accessToken');
}

function putAccessToken(accessToken) {
  return localStorage.setItem('accessToken', accessToken);
}

async function fetchWithToken(url, options = {}) {
  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${getAccessToken()}`
    }
  });
}

// --- AUTH ---

async function register({ name, email, password }) {
  try {
    const response = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    const responseJson = await response.json();

    if (responseJson.status !== 'success') {
      return { error: true, message: responseJson.message };
    }
    return { error: false, message: responseJson.message };
  } catch (error) {
    console.error("Register error:", error);
    return { error: true, message: 'Gagal terhubung ke server' };
  }
}

async function login({ email, password }) {
  try {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const responseJson = await response.json();

    if (responseJson.status !== 'success') {
      return { error: true, message: responseJson.message, data: null };
    }
    return { error: false, data: responseJson.data };
  } catch (error) {
    console.error("Login error:", error);
    return { error: true, message: 'Gagal terhubung ke server' };
  }
}

async function getUserLogged() {
  try {
    const response = await fetchWithToken(`${BASE_URL}/auth/me`);
    const responseJson = await response.json();

    if (responseJson.status !== 'success') {
      return { error: true, data: null };
    }
    return { error: false, data: responseJson.data };
  } catch (error) {
    console.error("Get user error:", error);
    return { error: true, data: null };
  }
}

async function updateProfile(profileData) {
  try {
    const response = await fetchWithToken(`${BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profileData),
    });
    const responseJson = await response.json();

    if (responseJson.status !== 'success') {
      return { error: true, message: responseJson.message };
    }
    return { error: false, data: responseJson.data, message: responseJson.message };
  } catch (error) {
    console.error("Update profile error:", error);
    return { error: true, message: "Gagal terhubung ke server" };
  }
}

async function forgotPassword(email) {
  try {
    const response = await fetch(`${BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const responseJson = await response.json();

    if (responseJson.status !== 'success') {
      return { error: true, message: responseJson.message };
    }
    return { error: false, message: responseJson.message };
  } catch (error) {
    console.error("Forgot password error:", error);
    return { error: true, message: "Gagal terhubung ke server" };
  }
}

async function resetPassword(token, newPassword) {
  try {
    const response = await fetch(`${BASE_URL}/auth/reset-password/${token}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newPassword }),
    });
    const responseJson = await response.json();

    if (responseJson.status !== 'success') {
      return { error: true, message: responseJson.message };
    }
    return { error: false, message: responseJson.message };
  } catch (error) {
    console.error("Reset password error:", error);
    return { error: true, message: "Gagal terhubung ke server" };
  }
}

// --- PRODUCTS ---

async function getProducts(params) {
  try {
    let url = `${BASE_URL}/products`;
    if (params) {
      const queryParams = new URLSearchParams(params).toString();
      url += `?${queryParams}`;
    }

    const response = await fetch(url);
    const responseJson = await response.json();

    if (responseJson.status !== 'success') {
      return { error: true, data: [] };
    }
    return { error: false, data: responseJson.data.products };
  } catch (error) {
    console.error("Get products error:", error);
    return { error: true, data: [] };
  }
}

async function getProductById(id) {
  try {
    const response = await fetch(`${BASE_URL}/products/${id}`);
    const responseJson = await response.json();

    if (responseJson.status !== 'success') {
      return { error: true, data: null };
    }
    return { error: false, data: responseJson.data.product };
  } catch (error) {
    console.error("Get product detail error:", error);
    return { error: true, data: null };
  }
}

async function addProduct(productData) {
  try {
    const response = await fetchWithToken(`${BASE_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData),
    });
    const responseJson = await response.json();

    if (responseJson.status !== 'success') {
      return { error: true, message: responseJson.message };
    }
    return { error: false, message: 'Produk berhasil ditambahkan' };
  } catch (error) {
    console.error("Add product error:", error);
    return { error: true, message: 'Gagal terhubung ke server' };
  }
}

async function deleteProduct(id) {
  try {
    const response = await fetchWithToken(`${BASE_URL}/products/${id}`, {
      method: 'DELETE',
    });
    const responseJson = await response.json();

    if (responseJson.status !== 'success') {
      return { error: true, message: responseJson.message };
    }
    return { error: false, message: 'Produk berhasil dihapus' };
  } catch (error) {
    console.error("Delete product error:", error);
    return { error: true, message: 'Gagal menghapus produk' };
  }
}

async function updateProduct(id, productData) {
  try {
    const response = await fetchWithToken(`${BASE_URL}/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData),
    });
    const responseJson = await response.json();

    if (responseJson.status !== 'success') {
      return { error: true, message: responseJson.message };
    }
    return { error: false, message: 'Produk berhasil diperbarui' };
  } catch (error) {
    console.error("Update product error:", error);
    return { error: true, message: 'Gagal terhubung ke server' };
  }
}

async function uploadImage(file) {
  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await fetch(`${BASE_URL}/upload`, { 
      method: 'POST',
      body: formData,
    });
    const responseJson = await response.json();

    if (responseJson.status !== 'success') {
      return { error: true, message: responseJson.message };
    }
    return { error: false, url: responseJson.data.imageUrl };
  } catch (error) {
    console.error("Upload image error:", error);
    return { error: true, message: 'Gagal upload gambar' };
  }
}

// --- ORDERS ---

async function createOrder(orderData) {
  try {
    const response = await fetchWithToken(`${BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    const responseJson = await response.json();

    if (responseJson.status !== 'success') {
      return { error: true, message: responseJson.message };
    }
    
    return { error: false, data: responseJson.data };
  } catch (error) {
    console.error("Create order error:", error);
    return { error: true, message: 'Gagal memproses pesanan' };
  }
}

async function getMyOrders() {
  try {
    const response = await fetchWithToken(`${BASE_URL}/orders/my-orders`);
    const responseJson = await response.json();

    if (responseJson.status !== 'success') {
      return { error: true, data: [] };
    }
    return { error: false, data: responseJson.data.orders };
  } catch (error) {
    console.error("Get my orders error:", error);
    return { error: true, data: [] };
  }
}

async function getAllOrders(page = 1) {
  try {
    const response = await fetchWithToken(`${BASE_URL}/orders?page=${page}&limit=10`); 
    const responseJson = await response.json();

    if (responseJson.status !== 'success') {
      return { error: true, data: [], pagination: {} };
    }
    return { 
        error: false, 
        data: responseJson.data.orders, 
        pagination: responseJson.data.pagination 
    };
  } catch (error) {
    console.error("Get all orders error:", error);
    return { error: true, data: [], pagination: {} };
  }
}

async function updateOrderStatus(id, status, trackingNumber = null) {
  try {
    const payload = { status };
    if (trackingNumber) payload.trackingNumber = trackingNumber;

    const response = await fetchWithToken(`${BASE_URL}/orders/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const responseJson = await response.json();

    if (responseJson.status !== 'success') {
      return { error: true, message: responseJson.message };
    }
    return { error: false, message: 'Status berhasil diperbarui' };
  } catch (error) {
    console.error("Update status error:", error);
    return { error: true, message: 'Gagal update status' };
  }
}

// --- DASHBOARD ---

async function getDashboardStats() {
  try {
    const response = await fetchWithToken(`${BASE_URL}/dashboard/stats`);
    const responseJson = await response.json();

    if (responseJson.status !== 'success') {
      return { error: true, data: null };
    }
    return { error: false, data: responseJson.data };
  } catch (error) {
    console.error("Get stats error:", error);
    return { error: true, data: null };
  }
}

// --- REVIEWS ---

async function getProductReviews(productId) {
  try {
    const response = await fetch(`${BASE_URL}/reviews/${productId}`);
    const responseJson = await response.json();

    if (responseJson.status !== 'success') {
      return { error: true, data: [] };
    }
    return { error: false, data: responseJson.data };
  } catch (error) {
    console.error("Get reviews error:", error);
    return { error: true, data: [] };
  }
}

async function addReview({ productId, orderId, rating, comment }) {
  try {
    const response = await fetchWithToken(`${BASE_URL}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, orderId, rating, comment }),
    });
    const responseJson = await response.json();

    if (responseJson.status !== 'success') {
      return { error: true, message: responseJson.message };
    }
    return { error: false, data: responseJson.data };
  } catch (error) {
    console.error("Add review error:", error);
    return { error: true, message: "Gagal terhubung ke server" };
  }
}

async function getAllReviewsAdmin() {
  try {
    const response = await fetchWithToken(`${BASE_URL}/reviews`);
    const responseJson = await response.json();

    if (responseJson.status !== 'success') {
      return { error: true, data: [] };
    }
    return { error: false, data: responseJson.data };
  } catch (error) {
    console.error("Get admin reviews error:", error);
    return { error: true, data: [] };
  }
}

async function deleteReview(id) {
  try {
    const response = await fetchWithToken(`${BASE_URL}/reviews/${id}`, {
      method: 'DELETE',
    });
    const responseJson = await response.json();

    if (responseJson.status !== 'success') {
      return { error: true, message: responseJson.message };
    }
    return { error: false };
  } catch (error) {
    console.error("Delete review error:", error);
    return { error: true, message: "Gagal menghapus review" };
  }
}

// --- TESTIMONIALS ---

async function getAllTestimonials() {
  try {
    const response = await fetch(`${BASE_URL}/testimonials`);
    const responseJson = await response.json();

    if (responseJson.status !== 'success') {
      return { error: true, data: [] };
    }
    return { error: false, data: responseJson.data };
  } catch (error) {
    console.error("Get testimonials error:", error);
    return { error: true, data: [] };
  }
}

async function addTestimonialAPI(text) {
  try {
    const response = await fetchWithToken(`${BASE_URL}/testimonials`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    const responseJson = await response.json();

    if (responseJson.status !== 'success') {
      return { error: true, message: responseJson.message };
    }
    return { error: false, data: responseJson.data };
  } catch (error) {
    console.error("Add testimonial error:", error);
    return { error: true, message: 'Gagal terhubung ke server' };
  }
}

async function deleteTestimonial(id) {
  try {
    const response = await fetchWithToken(`${BASE_URL}/testimonials/${id}`, {
      method: 'DELETE',
    });
    const responseJson = await response.json();

    if (responseJson.status !== 'success') {
      return { error: true, message: responseJson.message };
    }
    return { error: false };
  } catch (error) {
    console.error("Delete testimonial error:", error);
    return { error: true, message: "Gagal menghapus testimoni" };
  }
}

// --- NEWSLETTER ---

async function subscribeNewsletter(email) {
  try {
    const response = await fetch(`${BASE_URL}/newsletter/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const responseJson = await response.json();
    
    if (responseJson.status !== 'success') {
      return { error: true, message: responseJson.message };
    }
    return { error: false, message: responseJson.message };
  } catch (error) {
    console.error("Subscribe error:", error);
    return { error: true, message: "Gagal koneksi ke server" };
  }
}

async function getSubscribers() {
  try {
    const response = await fetchWithToken(`${BASE_URL}/newsletter`);
    const responseJson = await response.json();
    if (responseJson.status !== 'success') return { error: true, data: [] };
    return { error: false, data: responseJson.data };
  } catch (error) {
    console.error("Get subscribers error:", error);
    return { error: true, data: [] };
  }
}

async function deleteSubscriber(id) {
  try {
    const response = await fetchWithToken(`${BASE_URL}/newsletter/${id}`, { method: 'DELETE' });
    const responseJson = await response.json();
    if (responseJson.status !== 'success') return { error: true };
    return { error: false };
  } catch (error) {
    console.error("Delete subscriber error:", error);
    return { error: true };
  }
}

// --- HERO SLIDES ---

async function getHeroSlides() {
  try {
    const response = await fetch(`${BASE_URL}/hero`);
    const responseJson = await response.json();
    if (responseJson.status !== 'success') return { error: true, data: [] };
    return { error: false, data: responseJson.data };
  } catch (error) {
    console.error("Get hero slides error:", error);
    return { error: true, data: [] };
  }
}

async function addHeroSlide(slideData) {
  try {
    const response = await fetchWithToken(`${BASE_URL}/hero`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(slideData),
    });
    const responseJson = await response.json();
    if (responseJson.status !== 'success') return { error: true, message: responseJson.message };
    return { error: false };
  } catch (error) {
    console.error("Add hero slide error:", error);
    return { error: true, message: "Gagal koneksi" };
  }
}

async function deleteHeroSlide(id) {
  try {
    const response = await fetchWithToken(`${BASE_URL}/hero/${id}`, { method: 'DELETE' });
    const responseJson = await response.json();
    if (responseJson.status !== 'success') return { error: true };
    return { error: false };
  } catch (error) {
    console.error("Delete hero slide error:", error);
    return { error: true };
  }
}

// --- PAYMENT PROOF & METHODS ---

async function uploadPaymentProof(orderId, file) {
  const formData = new FormData();
  formData.append('image', file); 

  try {
    const token = getAccessToken();
    const response = await fetch(`${BASE_URL}/orders/${orderId}/payment-proof`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const responseJson = await response.json();

    if (responseJson.status !== 'success') {
      return { error: true, message: responseJson.message };
    }
    return { error: false, data: responseJson.data };
  } catch (error) {
    console.error("Upload payment proof error:", error);
    return { error: true, message: "Gagal terhubung ke server" };
  }
}

async function getPaymentMethods() {
  try {
    const response = await fetch(`${BASE_URL}/payments`);
    const responseJson = await response.json();
    if (responseJson.status !== 'success') return { error: true, data: [] };
    return { error: false, data: responseJson.data };
  } catch (error) {
    // Perbaikan: Log error agar tidak unused
    console.error("Get payment methods error:", error);
    return { error: true, data: [] };
  }
}

async function addPaymentMethod(formData) {
  try {
    const token = getAccessToken();
    const response = await fetch(`${BASE_URL}/payments`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData, 
    });
    const responseJson = await response.json();
    if (responseJson.status !== 'success') return { error: true, message: responseJson.message };
    return { error: false };
  } catch (error) {
    // Perbaikan: Log error
    console.error("Add payment method error:", error);
    return { error: true, message: "Gagal koneksi" };
  }
}

async function deletePaymentMethod(id) {
  try {
    const response = await fetchWithToken(`${BASE_URL}/payments/${id}`, { method: 'DELETE' });
    const responseJson = await response.json();
    if (responseJson.status !== 'success') return { error: true };
    return { error: false };
  } catch (error) {
    // Perbaikan: Log error
    console.error("Delete payment method error:", error);
    return { error: true };
  }
}

export { 
  getAccessToken, 
  putAccessToken, 
  login, 
  register, 
  getUserLogged,
  updateProfile,
  forgotPassword,
  resetPassword,
  getProducts,
  getProductById,
  addProduct,
  deleteProduct,
  updateProduct,
  uploadImage,
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  getDashboardStats,
  getProductReviews,
  addReview,
  getAllReviewsAdmin,
  deleteReview,
  getAllTestimonials,
  addTestimonialAPI,
  deleteTestimonial,
  subscribeNewsletter,
  getSubscribers,
  deleteSubscriber,
  getHeroSlides,
  addHeroSlide,
  deleteHeroSlide,
  uploadPaymentProof,
  getPaymentMethods,
  addPaymentMethod,
  deletePaymentMethod
};