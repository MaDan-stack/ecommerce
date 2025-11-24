import React, { createContext, useState, useMemo, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // 1. Inisialisasi State dari LocalStorage (Lazy Initialization)
  const [cartItems, setCartItems] = useState(() => {
    try {
      const storedCart = localStorage.getItem('cartItems');
      return storedCart ? JSON.parse(storedCart) : [];
    } catch (error) {
      console.error("Gagal memuat keranjang dari localStorage:", error);
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  // 2. Efek Samping: Simpan ke LocalStorage setiap kali cartItems berubah
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = useCallback((product, variant) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item.product.id === product.id && item.variant.size === variant.size
      );

      if (existingItem) {
        return prevItems.map((item) =>
          item.product.id === product.id && item.variant.size === variant.size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      // Pastikan ID unik
      return [...prevItems, { product, variant, quantity: 1, id: `${product.id}-${variant.size}-${Date.now()}` }];
    });
    setIsCartOpen(true);
  }, []);

  const removeFromCart = useCallback((itemId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  }, []);

  const updateQuantity = useCallback((itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
    } else {
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCartItems([]);
    localStorage.removeItem('cartItems'); // Hapus juga dari storage
  }, []);

  const toggleCart = useCallback(() => {
    setIsCartOpen((prev) => !prev);
  }, []);

  const total = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.variant.price * item.quantity, 0);
  }, [cartItems]);

  const cartContextValue = useMemo(() => ({
    cartItems,
    addToCart,
    isCartOpen,
    toggleCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    total,
  }), [cartItems, isCartOpen, total, addToCart, toggleCart, removeFromCart, updateQuantity, clearCart]);

  return (
    <CartContext.Provider value={cartContextValue}>
      {children}
    </CartContext.Provider>
  );
};

CartProvider.propTypes = {
  children: PropTypes.node.isRequired,
};