// web/src/components/CartItem.jsx
import React from 'react';
import { FiTrash2, FiMinus, FiPlus } from 'react-icons/fi';

export default function CartItem({ item, onRemove, onUpdate }) {
  const product = item?.product || {};
  const qty = item?.quantity || 1;

  return (
    <div className="flex items-center gap-4 p-4 border rounded-lg bg-white">
      <div className="w-24 h-24 flex items-center justify-center bg-gray-50 rounded-md overflow-hidden">
        <img src={product.image_url || product.image || 'https://via.placeholder.com/200'} alt={product.nombre || product.title} className="object-contain max-h-full max-w-full" />
      </div>

      <div className="flex-1">
        <h4 className="font-semibold text-base">{product.nombre || product.title}</h4>
        <p className="text-sm text-gray-500">{product.categoria}</p>
        <p className="mt-2 font-bold text-lg">S/. {product.precio}</p>
      </div>

      <div className="flex flex-col items-end space-y-2">
        <div className="flex items-center border rounded-md overflow-hidden">
          <button onClick={() => onUpdate(Math.max(1, qty - 1))} className="p-2 text-gray-600 hover:bg-gray-100"><FiMinus /></button>
          <div className="px-4">{qty}</div>
          <button onClick={() => onUpdate(qty + 1)} className="p-2 text-gray-600 hover:bg-gray-100"><FiPlus /></button>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={onRemove} className="text-red-500 hover:text-red-600 flex items-center gap-2">
            <FiTrash2 /> <span className="text-sm">Eliminar</span>
          </button>
        </div>
      </div>
    </div>
  );
}