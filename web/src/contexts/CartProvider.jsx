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
    
    if (!product || !product.id) {
      return false;
    }
    
    if (quantity <= 0) {
      return false;
    }
    
    if (product.stock <= 0) {
      return false;
    }
    
    const existingItem = cart.find(item => item.product.id === product.id);
    const currentQuantity = existingItem ? existingItem.quantity : 0;
    const newQuantity = currentQuantity + quantity;
    
    if (newQuantity > product.stock) {
      return false;
    }

    setCart(prev => {
      const idx = prev.findIndex(i => i.product.id === product.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], quantity: Math.max(1, copy[idx].quantity + quantity) };
        return copy;
      }
      return [...prev, { product, quantity: Math.max(1, quantity) }];
    });
    
    return true;
  };

  const removeItem = (productId) => {
    setCart(prev => prev.filter(i => i.product.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    
    // Verificar stock si es necesario
    const item = cart.find(i => i.product.id === productId);
    if (item && quantity > item.product.stock) {
      return false;
    }
    
    setCart(prev => prev.map(i => i.product.id === productId ? { ...i, quantity: Math.max(1, quantity) } : i));
    return true;
  };

  const clearCart = () => setCart([]);

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.product.precio * item.quantity), 0);
  };

  const value = {
    cart,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    totals: getTotals(),
    items: cart,
    getTotalItems,
    getTotalPrice
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}