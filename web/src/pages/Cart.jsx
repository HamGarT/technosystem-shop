// web/src/pages/Cart.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/useCart';
import CartItem from '../components/CartItem';

const currencyFormat = (v) => Number(v).toFixed(2);

const CheckoutModal = ({ isOpen, onClose, onConfirm, total, itemCount }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#0000009c] bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg 
              className="w-8 h-8 text-blue-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Confirmar Pedido
          </h3>
          
          <div className="bg-gray-50 rounded-lg p-4 my-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Productos:</span>
              <span className="font-semibold">{itemCount} {itemCount === 1 ? 'item' : 'items'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total a pagar:</span>
              <span className="text-2xl font-bold text-green-600">
                S/. {currencyFormat(total)}
              </span>
            </div>
          </div>

          <p className="text-gray-600 mb-6 text-sm">
            ¿Estás seguro de que quieres proceder con la compra? Serás redirigido al proceso de pago seguro.
          </p>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-700 px-4 py-3 rounded-md hover:bg-gray-50 transition-colors font-medium"
            >
              Seguir comprando
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 bg-green-600 text-white px-4 py-3 rounded-md hover:bg-green-700 transition-colors font-medium"
            >
              Confirmar y Pagar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Cart() {
  const { cart, updateQuantity, removeItem, clearCart } = useCart();
  const navigate = useNavigate();
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  const totals = cart.reduce((s, it) => {
    const price = Number(it.product?.precio || it.product?.price || 0);
    s.items += it.quantity;
    s.subtotal += price * it.quantity;
    return s;
  }, { items: 0, subtotal: 0 });

  const handleCheckoutClick = () => {
    if (cart.length === 0) {
      alert('Tu carrito está vacío');
      return;
    }
    setShowCheckoutModal(true);
  };

  const handleConfirmCheckout = () => {
    setShowCheckoutModal(false);
    
    console.log('Procesando pedido:', {
      items: cart,
      total: totals.subtotal,
      itemCount: totals.items
    });
    
    // Ejemplo de redirección al checkout
    // navigate('/checkout', { 
    //   state: { 
    //     cartItems: cart,
    //     total: totals.subtotal 
    //   }
    // });
    
    
    // Limpiar carrito después de confirmar (opcional)
    // clearCart();
  };

  const handleClearCart = () => {
    if (window.confirm('¿Estás seguro de que quieres vaciar el carrito? Se eliminarán todos los productos.')) {
      clearCart();
    }
  };

  if (!cart || cart.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20">
        <h1 className="text-2xl font-bold mb-6">Tu carrito está vacío</h1>
        <Link 
          to="/" 
          className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Volver a la tienda
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-7xl bg-gray-50 mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
              <button 
                onClick={handleCheckoutClick} 
                className="w-full bg-blue-600 text-white px-4 py-3 rounded-md hover:bg-blue-700 transition-colors font-medium"
              >
                Finalizar compra
              </button>
              <button 
                onClick={handleClearCart} 
                className="w-full border border-gray-300 px-4 py-3 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Vaciar carrito
              </button>
              <Link 
                to="/" 
                className="block text-center text-sm text-blue-600 hover:text-blue-700 mt-2 font-medium"
              >
                Continuar comprando
              </Link>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Pago 100% seguro</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Envío garantizado</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Devolución fácil</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <CheckoutModal
        isOpen={showCheckoutModal}
        onClose={() => setShowCheckoutModal(false)}
        onConfirm={handleConfirmCheckout}
        total={totals.subtotal}
        itemCount={totals.items}
      />
    </>
  );
}