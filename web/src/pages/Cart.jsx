// web/src/pages/Cart.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/useCart';
import CartItem from '../components/CartItem';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { LoginForm } from '../components/login-form';

const currencyFormat = (v) => Number(v).toFixed(2);

export default function Cart() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const { cart, updateQuantity, removeItem, clearCart } = useCart();
  const [order, setOrder] = useState({
    departamento: "Lima",
    provincia: "Lima",
    direccion: "Av. Arequipa 1234, Miraflores",
    usuario_id: user?.id,
    pedido_items: []
  })

  useEffect(() => {
    const pedido_items = cart.map(item => ({
      producto_id: item.product.id,
      cantidad: item.quantity
    }));
    setOrder(prev => ({
      ...prev,
      pedido_items
    }));

    console.log(pedido_items);
    console.log(order);
  }, [cart]);

  useEffect(() => {
    console.log("Order (after update):", order);
  }, [order]);


  const totals = cart.reduce((s, it) => {
    const price = Number(it.product?.precio || it.product?.price || 0);
    s.items += it.quantity;
    s.subtotal += price * it.quantity;
    return s;
  }, { items: 0, subtotal: 0 });

  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    setIsLoading(true);
    console.log(isAuthenticated)
    try {
      if (isAuthenticated) {
        newOrder = {
          ...order,
          usuario_id: user.id
        }
        console.log(newOrder)
        await axios.post(`${apiUrl}/api/pedidos`, {...order, usuario_id: user.id});
        alert('SU PEDIDO A SIDO REGISTRADO CORRECTAMENTE');
      } else {
        setIsLoginOpen(true)
      }

    } catch (error) {
      alert('Error al registrar el pedido');
    } finally {
      setIsLoading(false);
    }
  };

  if (!cart || cart.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20">
        <h1 className="text-2xl font-bold mb-6">Tu carrito está vacío</h1>
        <Link to="/" className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md">Volver a la tienda</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-2xl font-bold mb-6">Carrito de compras</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {cart.map((it) => (
            <CartItem
              key={it.product.id}
              item={it}
              onRemove={() => removeItem(it.product.id)}
              onUpdate={(qty) => updateQuantity(it.product.id, qty)}
            />
          ))}
        </div>

        <aside className="bg-white border rounded-lg p-6 shadow-sm">
          <h2 className="font-semibold text-lg mb-4">Resumen del pedido</h2>
          <div className="flex justify-between my-2">
            <span>Items</span>
            <span>{totals.items}</span>
          </div>
          <div className="flex justify-between my-2 font-bold text-xl">
            <span>Total</span>
            <span>S/. {currencyFormat(totals.subtotal)}</span>
          </div>

          <div className="mt-6 space-y-3">
            <button onClick={handleCheckout} className="w-full bg-blue-600 text-white px-4 py-3 rounded-md hover:bg-blue-700 transition-colors">
              Finalizar compra
            </button>
            <button onClick={() => { clearCart(); }} className="w-full border border-gray-300 px-4 py-3 rounded-md text-gray-700 hover:bg-gray-50">
              Vaciar carrito
            </button>
            <Link to="/" className="block text-center text-sm text-gray-500 mt-2">Continuar comprando</Link>
          </div>
        </aside>
      </div>
      <LoginForm isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </div>
  );
}