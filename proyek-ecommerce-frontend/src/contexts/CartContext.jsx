import { createContext, useContext } from 'react';

// 1. Buat Context
export const CartContext = createContext();

// 2. Buat Custom Hook (Pindah ke sini)
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart harus digunakan di dalam CartProvider');
  }
  return context;
};