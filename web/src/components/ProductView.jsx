// src/pages/ProductView.jsx

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { useCart } from '../contexts/useCart';

// Importamos los íconos
import { FiShoppingCart, FiPlus, FiMinus } from 'react-icons/fi';

const ProductView = () => {
  const apiUrl =  import.meta.env.VITE_API_URL;
  const { id } = useParams(); // Obtiene el 'id' de la URL, ej: /product/5
  const { addItem } = useCart();
  
  // Estados para manejar los datos de la API
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true); // Inicia la carga
      setError(null);
      
      try {
        const productResponse = await axios.get(`${apiUrl}/api/products/${id}`);
        setProduct(productResponse.data.data);
        const relatedResponse = await axios.get(`${apiUrl}/api/products`);
        const filteredRelated = relatedResponse.data.data.filter(p => p.id !== parseInt(id));
        setRelatedProducts(filteredRelated);

      } catch (err) {
        setError("No se pudo cargar el producto. Por favor, intente de nuevo más tarde.");
        console.error("Error fetching product data:", err);
      } finally {
        setLoading(false); 
      }
    };

    fetchProductData();
  }, [id]);

  const handleQuantityChange = (amount) => {
    setQuantity(prev => Math.max(1, prev + amount));
  };

  // --- Renderizado Condicional ---
  if (loading) {
    return <div className="text-center py-20">Cargando producto...</div>;
  }

  if (error) {
    return <div className="text-center py-20 text-red-500">{error}</div>;
  }

  if (!product) {
    return <div className="text-center py-20">Producto no encontrado.</div>;
  }

  // --- Vista Principal ---
  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          
          {/* Columna Izquierda: Imagen */}
          <div>
            <div className="bg-white border border-gray-200 rounded-lg p-8 flex items-center justify-center mb-4">
              <img src={product.image_url} alt={product.nombre} className="max-h-96 object-contain" />
            </div>
            {/* Puedes añadir logos de marcas dinámicamente si tu API los proporciona */}
          </div>

          {/* Columna Derecha: Detalles */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">{product.nombre}</h1>
            <div className="text-sm text-gray-600 space-y-1 mb-6">
              <p><strong>CATEGORÍA:</strong> {product.categoria}</p>
              <p><strong>STOCK DISPONIBLE:</strong> {product.stock}</p>
              {/* Añade más detalles si tu API los tiene */}
            </div>

            <div className="mb-6">
              <p className="text-gray-600 text-sm">Precio total:</p>
              <p className="text-4xl font-bold text-gray-900">S/. {product.precio}</p>
              <p className="text-xs text-gray-500">O precio incluye IGV.</p>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center border border-gray-300 rounded-md">
                <button onClick={() => handleQuantityChange(-1)} className="p-3 text-gray-600 hover:bg-gray-100 rounded-l-md"><FiMinus /></button>
                <input type="text" value={quantity} readOnly className="w-12 text-center border-l border-r border-gray-300 focus:outline-none" />
                <button onClick={() => handleQuantityChange(1)} className="p-3 text-gray-600 hover:bg-gray-100 rounded-r-md"><FiPlus /></button>
              </div>
              
              <button onClick={() => addItem(product, quantity)} className="flex-grow bg-blue-600 text-white font-semibold py-3 px-6 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
                <FiShoppingCart size={20} />
                <span>Añadir al carrito</span>
              </button>
            </div>
          </div>
        </div>

        {/* --- SECCIÓN PRODUCTOS RELACIONADOS --- */}
        <div className="mt-20">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">PRODUCTOS RELACIONADOS</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            {relatedProducts.slice(0, 5).map((prod) => (
              // Envolvemos cada tarjeta en un Link para que sea navegable
              <Link key={prod.id} to={`/product/${prod.id}`}>
                <ProductCard product={prod} />
              </Link>
            ))}
          </div>
        </div>

        {/* --- SECCIÓN ESPECIFICACIONES TÉCNICAS (Opcional) --- */}
        {/* Nota: Tu API no parece devolver una lista de especificaciones. */}
        {/* Puedes añadir esta sección si modificas la API o tienes los datos en otro lugar. */}
        {/* <div className="mt-20"> ... </div> */}

      </div>
    </div>
  );
};

export default ProductView;