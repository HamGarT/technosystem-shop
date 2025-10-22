// web/src/pages/Cart.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/useCart';
import CartItem from '../components/CartItem';

const currencyFormat = (v) => Number(v).toFixed(2);

export default function Cart() {
  const { cart, updateQuantity, removeItem, clearCart } = useCart();

  const totals = cart.reduce((s, it) => {
    const price = Number(it.product?.precio || it.product?.price || 0);
    s.items += it.quantity;
    s.subtotal += price * it.quantity;
    return s;
  }, { items: 0, subtotal: 0 });

  const handleCheckout = () => {
    // placeholder: redirigir al checkout o procesar la compra
    // Aquí podrías verificar login, enviar al endpoint de orden, etc.
    alert('Checkout: total S/. ' + currencyFormat(totals.subtotal));
    // ejemplo de redirección:
    // navigate('/checkout');
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
    </div>
  );
}