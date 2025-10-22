// src/components/ProductCard.jsx

import React from 'react';
import { FiHeart, FiShoppingCart, FiEye } from 'react-icons/fi';
import { useCart } from '../contexts/useCart';

const ProductCard = ({ product }) => {
  const { addItem } = useCart();

  const handleAdd = () => {
    addItem(product, 1);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 text-left h-full flex flex-col w-full hover:shadow-lg transition-shadow duration-300">
      {/* --- Parte Superior: Etiqueta e Íconos --- */}
      <div className="flex justify-between items-center mb-3">
        <span className="bg-gray-100 text-gray-600 text-xs font-semibold px-2.5 py-1 rounded uppercase">
          {/* Usamos el dato de la API */}
          {product.categoria} 
        </span>
        <div className="flex items-center space-x-2 text-gray-400">
          <button className="hover:text-red-500"><FiHeart size={20} /></button>
          <button className="hover:text-blue-500"><FiEye size={20} /></button>
        </div>
      </div>

      {/* --- Imagen del Producto --- */}
      <div className="flex-shrink-0 my-4 h-40 flex items-center justify-center">
        <img 
          src={product.image_url}  /* <-- CAMBIO AQUÍ */
          alt={product.nombre}     /* <-- CAMBIO AQUÍ */
          className="max-h-full max-w-full object-contain" 
        />
      </div>

      {/* --- Título del Producto --- */}
      <h3 className="text-sm font-semibold text-gray-800 flex-grow mb-4 leading-tight">
        {product.nombre} {/* <-- CAMBIO AQUÍ */}
      </h3>

      {/* --- Parte Inferior: Precio e Ícono de Carrito --- */}
      <div className="flex justify-between items-center mt-auto">
        <span className="text-xl font-bold text-gray-900">
          S/. {product.precio} {/* <-- CAMBIO AQUÍ */}
        </span>
        <button onClick={handleAdd} className="text-gray-600 hover:text-blue-600">
          <FiShoppingCart size={24} />
        </button>
      </div>
    </div>
  );
};

export default ProductCard;