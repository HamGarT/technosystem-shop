import React, { useEffect, useState } from 'react';
import CartContext from './CartContext';

const STORAGE_KEY = 'cart_v1';

export default function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setCart(JSON.parse(raw));
    } catch (err) {
      console.error('Error leyendo carrito desde localStorage', err);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch (err) {
      console.error('Error guardando carrito en localStorage', err);
    }
  }, [cart]);

  const getTotals = (items = cart) => {
    const totalItems = items.reduce((s, it) => s + (it.quantity || 0), 0);
    const totalPrice = items.reduce((s, it) => s + (Number(it.product?.precio || it.product?.price || 0) * (it.quantity || 0)), 0);
    return { totalItems, totalPrice };
  };

  const addItem = (product, quantity = 1) => {
    if (!product || !product.id) return;
    setCart(prev => {
      const idx = prev.findIndex(i => i.product.id === product.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], quantity: Math.max(1, copy[idx].quantity + quantity) };
        return copy;
      }
      return [...prev, { product, quantity: Math.max(1, quantity) }];
    });
  };

  const removeItem = (productId) => {
    setCart(prev => prev.filter(i => i.product.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    setCart(prev => prev.map(i => i.product.id === productId ? { ...i, quantity: Math.max(1, quantity) } : i));
  };

  const clearCart = () => setCart([]);

  const value = {
    cart,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    totals: getTotals()
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
