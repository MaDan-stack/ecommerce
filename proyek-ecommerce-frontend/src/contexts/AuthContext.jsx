import { createContext, useContext } from 'react';

// 1. Buat Context
export const AuthContext = createContext();

// 2. Buat Custom Hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth harus digunakan di dalam AuthProvider');
  }
  return context;
};