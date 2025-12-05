import React, { useContext, useEffect, Suspense } from "react";
import { Routes, Route, useLocation } from 'react-router-dom';
import AOS from "aos";
import "aos/dist/aos.css";
import { Toaster } from 'react-hot-toast';

// Layout & Auth
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AdminRoute from "./components/auth/AdminRoute";
import AdminLayout from "./components/layout/AdminLayout";

// Contexts
import { CartContext } from "./contexts/CartContext";
import CartSidebar from "./components/ui/CartSidebar";

// --- LAZY IMPORT ---

// Halaman User
const HomePage = React.lazy(() => import("./pages/HomePage"));
const ProductsPage = React.lazy(() => import("./pages/ProductsPage"));
const ProductDetailPage = React.lazy(() => import("./pages/ProductDetailPage"));
const SearchPage = React.lazy(() => import("./pages/SearchPage"));
const NotFoundPage = React.lazy(() => import("./pages/NotFoundPage"));
const LoginPage = React.lazy(() => import("./pages/LoginPage"));
const RegisterPage = React.lazy(() => import("./pages/RegisterPage"));
const ForgotPasswordPage = React.lazy(() => import("./pages/ForgotPasswordPage"));
const ResetPasswordPage = React.lazy(() => import("./pages/ResetPasswordPage"));
const UserProfilePage = React.lazy(() => import("./pages/UserProfilePage"));
const CheckoutPage = React.lazy(() => import("./pages/CheckoutPage"));
const OrderHistoryPage = React.lazy(() => import("./pages/OrderHistoryPage"));
const PaymentPage = React.lazy(() => import("./pages/PaymentPage"));

// Halaman Khusus (Invoice) - BARU
const InvoicePage = React.lazy(() => import("./pages/InvoicePage")); 

// Halaman Admin
const AdminDashboard = React.lazy(() => import("./pages/admin/AdminDashboard"));
const AdminProductList = React.lazy(() => import("./pages/admin/AdminProductList"));
const AdminAddProduct = React.lazy(() => import("./pages/admin/AdminAddProduct"));
const AdminEditProduct = React.lazy(() => import("./pages/admin/AdminEditProduct"));
const AdminOrderList = React.lazy(() => import("./pages/admin/AdminOrderList"));
const AdminHeroPage = React.lazy(() => import("./pages/admin/AdminHeroPage"));
const AdminReviewList = React.lazy(() => import("./pages/admin/AdminReviewList"));
const AdminPaymentSettings = React.lazy(() => import("./pages/admin/AdminPaymentSettings"));

// Komponen Loading
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-orange-500"></div>
  </div>
);

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
      
      <Suspense fallback={<div className="h-screen flex items-center justify-center">Loading App...</div>}>
        <Routes>
          
          {/* --- RUTE ADMIN --- */}
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
            <Route path="hero" element={<AdminHeroPage />} />
            <Route path="reviews" element={<AdminReviewList />} />
            <Route path="payments" element={<AdminPaymentSettings />} />
          </Route>

          {/* --- RUTE INVOICE (Diluar Layout User agar Header/Footer tidak muncul) --- */}
          {/* --- PERBAIKAN: Tambahkan route ini --- */}
          <Route path="/invoice/:id" element={
            <ProtectedRoute>
              <InvoicePage />
            </ProtectedRoute>
          } />

          {/* --- RUTE USER (Dengan Header & Footer) --- */}
          <Route path="*" element={
            <>
              <Header />
              <main className="flex-grow">
                <Suspense fallback={<LoadingSpinner />}>
                  <Routes>
                    {/* Halaman Publik */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/search" element={<SearchPage />} />
                    <Route path="/products" element={<ProductsPage />} />
                    <Route path="/products/:id" element={<ProductDetailPage />} />
                    
                    {/* Auth */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                    <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

                    {/* Halaman Terproteksi */}
                    <Route path="/profile" element={
                      <ProtectedRoute>
                        <UserProfilePage />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/checkout" element={
                      <ProtectedRoute>
                        <CheckoutPage />
                      </ProtectedRoute>
                    } />

                    <Route path="/orders" element={
                      <ProtectedRoute>
                        <OrderHistoryPage />
                      </ProtectedRoute>
                    } />

                    <Route path="/payment/:id" element={
                      <ProtectedRoute>
                        <PaymentPage />
                      </ProtectedRoute>
                    } />
                    
                    {/* 404 Not Found */}
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </Suspense>
              </main>
              <Footer />
              <CartSidebar isOpen={isCartOpen} toggleCart={toggleCart} />
            </>
          } />
        </Routes>
      </Suspense>
    </div>
  );
};

export default App;