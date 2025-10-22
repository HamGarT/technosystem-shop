import React from 'react';
import { useCart } from '../../contexts/useCart'; // Importamos nuestro hook (ruta corregida)
import { Link } from 'react-router-dom';
import { FiTrash2 } from 'react-icons/fi';

const CartPage = () => {
  const { cart, removeItem: removeFromCart } = useCart();

  // Calcula el subtotal
  const subtotal = cart.reduce((total, item) => {
    return total + (parseFloat(item.precio) * item.quantity);
  }, 0);

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 text-center">
        <h1 className="text-3xl font-bold mb-4">Tu Carrito está Vacío</h1>
        <p className="text-gray-600 mb-8">Parece que aún no has añadido nada.</p>
        <Link 
          to="/" 
          className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-md hover:bg-blue-700"
        >
          Ir a la tienda
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="max-w-4xl mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-8">Mi Carrito</h1>
        
        {/* Lista de Productos */}
        <div className="border-t border-b border-gray-200 divide-y divide-gray-200">
          {cart.map((entry) => {
            const product = entry.product || {};
            const qty = entry.quantity || 1;
            return (
              <div key={product.id} className="flex items-center py-6">
                <img 
                  src={product.image_url || product.image || 'https://via.placeholder.com/150'} 
                  alt={product.nombre || product.title} 
                  className="w-24 h-24 object-contain rounded-md border border-gray-200 mr-6" 
                />
                <div className="flex-grow">
                  <Link to={`/product/${product.id}`} className="text-lg font-semibold text-gray-900 hover:text-blue-600">
                    {product.nombre || product.title}
                  </Link>
                  <p className="text-sm text-gray-500">Cantidad: {qty}</p>
                  <p className="text-lg font-bold text-gray-900 mt-1">
                    S/. {Number(product.precio || product.price || 0).toFixed(2)}
                  </p>
                </div>
                <button 
                  onClick={() => removeFromCart(product.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FiTrash2 size={20} />
                </button>
              </div>
            );
          })}
        </div>

        {/* Resumen de Compra */}
        <div className="mt-8 flex justify-end">
          <div className="w-full max-w-sm">
            <div className="flex justify-between text-xl font-semibold mb-4">
              <span>Subtotal:</span>
              <span>S/. {subtotal.toFixed(2)}</span>
            </div>
            <p className="text-sm text-gray-500 mb-4">El costo de envío será calculado en el checkout.</p>
            <button className="w-full bg-blue-600 text-white font-semibold py-3 px-6 rounded-md hover:bg-blue-700">
              Ir a Pagar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;