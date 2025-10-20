import React from 'react';
import { FiHeart, FiShoppingCart, FiEye } from 'react-icons/fi';

const ProductCard = ({ product }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 text-left h-[438px] w-[288px] flex flex-col">
      <div className="flex justify-between items-center mb-3">
        <span className="bg-gray-100 text-gray-600  text-[20px] px-2.5 py-1 rounded">
          GRÁFICA
        </span>
        <div className="flex items-center space-x-2 text-gray-400">
          <button className="hover:text-red-500 transition-colors"><FiHeart size={20} /></button>
          <button className="hover:text-blue-500 transition-colors"><FiEye size={20} /></button>
        </div>
      </div>
      <div className="flex-shrink-0 my-4 h-40 flex items-center justify-center">
        <img 
          src="https://www.digitalcombatsimulator.com/upload/iblock/445/zgwp40uxl1b5tylmiu2n06wvgpsfaiud/DCS_2022-08-23_22-44-24.jpg" 
          alt={product.title} 
          className="max-w-full object-contain rounded-[10px]" 
        />
      </div>
      <h3 className="text-[22px] flex-grow mb-4 leading-tight">
        {product.title}
      </h3>
      <div className="flex justify-between items-center mt-auto">
        <span className="text-[32px]">
          S/. {product.price}
        </span>
        <button className="text-gray-600 hover:text-blue-600 transition-colors">
          <FiShoppingCart size={24} />
        </button>
      </div>
    </div>
  );
};

export default ProductCard;