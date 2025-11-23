const BASE_URL = 'http://localhost:5000/api'; 

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
      alert(responseJson.message);
      return { error: true };
    }
    return { error: false };
  } catch (error) {
    console.error("Register error:", error);
    alert('Gagal terhubung ke server');
    return { error: true };
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
      alert(responseJson.message);
      return { error: true, data: null };
    }
    return { error: false, data: responseJson.data };
  } catch (error) {
    console.error("Login error:", error);
    alert('Gagal terhubung ke server');
    return { error: true };
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

// --- PRODUCTS ---

// 1. Ambil Produk (Bisa Semua, atau Filter berdasarkan Title/Category)
async function getProducts(params) {
  try {
    // Buat URL dasar
    let url = `${BASE_URL}/products`;

    // Jika ada parameter (misal: { title: 'kemeja' }), tambahkan ke URL
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
      alert(responseJson.message);
      return { error: true };
    }
    return { error: false };
  } catch (error) {
    console.error("Add product error:", error);
    alert('Gagal terhubung ke server');
    return { error: true };
  }
}

async function deleteProduct(id) {
  try {
    const response = await fetchWithToken(`${BASE_URL}/products/${id}`, {
      method: 'DELETE',
    });
    const responseJson = await response.json();

    if (responseJson.status !== 'success') {
      alert(responseJson.message);
      return { error: true };
    }
    return { error: false };
  } catch (error) {
    console.error("Delete product error:", error);
    return { error: true };
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
      alert(responseJson.message);
      return { error: true };
    }
    return { error: false };
  } catch (error) {
    console.error("Update product error:", error);
    alert('Gagal terhubung ke server');
    return { error: true };
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
      alert(responseJson.message);
      return { error: true };
    }
    return { error: false, url: responseJson.data.imageUrl };
  } catch (error) {
    console.error("Upload image error:", error);
    alert('Gagal upload gambar');
    return { error: true };
  }
}

// Fungsi untuk membuat pesanan baru
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
      alert(responseJson.message);
      return { error: true };
    }
    
    return { error: false, data: responseJson.data };
  } catch (error) {
    console.error("Create order error:", error);
    alert('Gagal memproses pesanan. Cek koneksi server.');
    return { error: true };
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

// Ambil SEMUA pesanan (Khusus Admin)
async function getAllOrders() {
  try {
    const response = await fetchWithToken(`${BASE_URL}/orders`); // GET /api/orders
    const responseJson = await response.json();

    if (responseJson.status !== 'success') {
      return { error: true, data: [] };
    }
    return { error: false, data: responseJson.data.orders };
  } catch (error) {
    console.error("Get all orders error:", error);
    return { error: true, data: [] };
  }
}

// Update Status Pesanan (Khusus Admin)
async function updateOrderStatus(id, status) {
  try {
    const response = await fetchWithToken(`${BASE_URL}/orders/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });

    const responseJson = await response.json();

    if (responseJson.status !== 'success') {
      alert(responseJson.message);
      return { error: true };
    }
    return { error: false };
  } catch (error) {
    console.error("Update status error:", error);
    alert('Gagal update status');
    return { error: true };
  }
}

// Ambil Statistik Dashboard (Admin)
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

export { 
  getAccessToken, 
  putAccessToken, 
  login, 
  register, 
  getUserLogged,
  getProducts,
  getProductById,
  addProduct,
  deleteProduct,
  updateProduct,
  uploadImage,
  createOrder,
  getMyOrders,
  getAllOrders,      // <-- Baru
  updateOrderStatus,
  getDashboardStats
};