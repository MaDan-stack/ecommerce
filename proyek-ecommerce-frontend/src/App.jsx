import React, { useContext, useEffect } from "react";
import { Routes, Route, useLocation } from 'react-router-dom';
import AOS from "aos";
import "aos/dist/aos.css";
import { Toaster } from 'react-hot-toast';

// Layout & Auth
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AdminRoute from "./components/auth/AdminRoute";     // <-- BARU
import AdminLayout from "./components/layout/AdminLayout"; // <-- BARU

// Contexts
import { CartContext } from "./contexts/CartContext";
import CartSidebar from "./components/ui/CartSidebar";

// Pages User
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import SearchPage from "./pages/SearchPage";
import CheckoutPage from "./pages/CheckoutPage";
import NotFoundPage from "./pages/NotFoundPage";
import OrderHistoryPage from "./pages/OrderHistoryPage";

// Pages Admin
import AdminDashboard from "./pages/admin/AdminDashboard";     // <-- BARU
import AdminProductList from "./pages/admin/AdminProductList"; // <-- BARU
import AdminAddProduct from "./pages/admin/AdminAddProduct"
import AdminEditProduct from "./pages/admin/AdminEditProduct";
import AdminOrderList from "./pages/admin/AdminOrderList";

const App = () => {
  const { isCartOpen, toggleCart } = useContext(CartContext);
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  
  useEffect(() => {
    AOS.init({
      offset: 100,
      duration: 800,
      easing: "ease-in-sine",
      delay: 100,
    });
    AOS.refresh();
  }, []);

  return (
    <div className="bg-white dark:bg-gray-900 dark:text-white duration-200 min-h-screen flex flex-col">
      <Toaster 
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        }}
      />
      <Routes>
        {/* --- RUTE ADMIN (Layout Terpisah) --- */}
        <Route path="/admin" element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }>
           <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProductList />} />
          <Route path="add-product" element={<AdminAddProduct />} />
          <Route path="products/edit/:id" element={<AdminEditProduct />} />
          <Route path="orders" element={<AdminOrderList />} />
        </Route>

        {/* --- RUTE USER (Menggunakan Header & Footer) --- */}
        <Route path="*" element={
          <>
            <Header />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/products" element={<ProductsPage />} />
                {/* Rute Detail Produk bisa diakses publik sekarang */}
                <Route path="/products/:id" element={<ProductDetailPage />} />
                
                <Route path="/checkout" element={
                  <ProtectedRoute>
                    <CheckoutPage />
                  </ProtectedRoute>
                } />

                <Route 
              path="/orders" 
              element={
                <ProtectedRoute>
                  <OrderHistoryPage />
                </ProtectedRoute>
              } 
            />
                
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
            <Footer />
            <CartSidebar isOpen={isCartOpen} toggleCart={toggleCart} />
          </>
        } />
      </Routes>
    </div>
  );
};

export default App;