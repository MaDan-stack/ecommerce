import React, { createContext, useState, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

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
      return [...prevItems, { product, variant, quantity: 1, id: `${product.id}-${variant.size}` }];
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

  // --- FUNGSI BARU: Kosongkan Keranjang ---
  const clearCart = useCallback(() => {
    setCartItems([]);
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
    clearCart, // Export fungsi ini
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