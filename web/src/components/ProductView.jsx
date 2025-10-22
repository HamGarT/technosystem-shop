// src/pages/ProductView.jsx

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { useCart } from '../contexts/useCart';

import { FiShoppingCart, FiPlus, FiMinus } from 'react-icons/fi';

const ConfirmationModal = ({ isOpen, onClose, product, quantity, onContinueShopping, onGoToCart }) => {
  
  if (!isOpen) return null;

  const totalPrice = product.precio * quantity;

  return (
    <div className="fixed inset-0 bg-[#0000009c] bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full animate-fade-in">
        <div className="p-6">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">¡Producto agregado!</h3>
          </div>
          
          <div className="flex items-center mb-4 p-4 bg-gray-50 rounded-lg">
            <img
              src={product?.image_url || "/images/placeholder.jpg"}
              alt={product?.nombre}
              className="w-16 h-16 object-cover rounded-md mr-4"
            />
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">{product?.nombre}</h4>
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-gray-600">Cantidad: {quantity}</span>
                <span className="text-lg font-bold text-blue-600">S/. {totalPrice.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Precio unitario:</span>
              <span className="font-medium">S/. {product?.precio?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span className="text-gray-600">Cantidad:</span>
              <span className="font-medium">{quantity}</span>
            </div>
            <div className="flex justify-between text-lg font-bold mt-2 pt-2 border-t border-blue-200">
              <span>Total:</span>
              <span className="text-blue-600">S/. {totalPrice.toLocaleString()}</span>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={onContinueShopping}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors font-medium"
            >
              Seguir comprando
            </button>
            <button
              onClick={onGoToCart}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
            >
              Ver carrito
            </button>
          </div>
        </div>
        
        <div className="px-6 py-3 bg-gray-50 rounded-b-lg flex justify-end">
          <button
            onClick={onClose}
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

const ProductView = () => {
  const { id } = useParams();
  const { addItem } = useCart();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [quantity, setQuantity] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const productResponse = await axios.get(`https://technosystem-shop-production.up.railway.app/api/products/${id}`);
        setProduct(productResponse.data.data);

        const relatedResponse = await axios.get('https://technosystem-shop-production.up.railway.app/api/products');
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

  const handleAddToCart = (product, quantity) => {
    
    if (product.stock <= 0) {
      alert(`No hay stock disponible de "${product.nombre}"`);
      return;
    }

    if (quantity > product.stock) {
      alert(`Solo hay ${product.stock} unidades disponibles de "${product.nombre}"`);
      return;
    }

    const success = addItem(product, quantity);
    
    if (success) {
      setSelectedProduct(product);
      setSelectedQuantity(quantity);
      setModalOpen(true);
    } else {
      alert(`Error al agregar "${product.nombre}" al carrito`);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedProduct(null);
    setSelectedQuantity(1);
  };
  const handleContinueShopping = () => {
    setModalOpen(false);
    setSelectedProduct(null);
    setSelectedQuantity(1);
    setQuantity(1);
  };

  const handleGoToCart = () => {
    setModalOpen(false);
    setSelectedProduct(null);
    setSelectedQuantity(1);
    navigate('/cart');
  };

  useEffect(() => {
  }, [modalOpen]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-500 text-lg mt-4">Cargando producto...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-4">{error}</p>
          <Link
            to="/"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Volver a la tienda
          </Link>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg mb-4">Producto no encontrado.</p>
          <Link
            to="/"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Volver a la tienda
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-300 min-h-screen">
      <ConfirmationModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        product={selectedProduct}
        quantity={selectedQuantity}
        onContinueShopping={handleContinueShopping}
        onGoToCart={handleGoToCart}
      />


      <div className="max-w-7xl bg-gray-300 mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          
          <div>
            <div className="bg-white border border-gray-200 rounded-lg p-8 flex items-center justify-center mb-4">
              <img 
                src={product.image_url} 
                alt={product.nombre} 
                className="max-h-96 object-contain"
                onError={(e) => {
                  e.target.src = "/images/placeholder.jpg";
                }}
              />
            </div>
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">{product.nombre}</h1>
            <div className="text-sm text-gray-600 space-y-1 mb-6">
              <p><strong>CATEGORÍA:</strong> {product.categoria}</p>
              <p><strong>STOCK DISPONIBLE:</strong> {product.stock}</p>
            </div>

            <div className="mb-6">
              <p className="text-gray-600 text-sm">Precio total:</p>
              <p className="text-4xl font-bold text-gray-900">S/. {product.precio?.toLocaleString()}</p>
              <p className="text-xs text-gray-500">O precio incluye IGV.</p>
            </div>

            <div className="flex items-center space-x-4 mb-6">
              <div className="flex items-center bg-gray-100 border border-gray-500 rounded-md">
                <button 
                  onClick={() => handleQuantityChange(-1)} 
                  disabled={quantity <= 1}
                  className={`p-3 rounded-l-md ${
                    quantity <= 1 
                      ? 'text-gray-400 cursor-not-allowed' 
                      : 'text-gray-600 hover:bg-gray-300'
                  }`}
                >
                  <FiMinus />
                </button>
                <input 
                  type="text" 
                  value={quantity} 
                  readOnly 
                  className="w-12 text-center border-l border-r border-gray-300 focus:outline-none bg-white" 
                />
                <button 
                  onClick={() => handleQuantityChange(1)} 
                  disabled={quantity >= product.stock}
                  className={`p-3 rounded-r-md ${
                    quantity >= product.stock 
                      ? 'text-gray-400 cursor-not-allowed' 
                      : 'text-gray-600 hover:bg-gray-300'
                  }`}
                >
                  <FiPlus />
                </button>
              </div>
              
              <button 
                onClick={() => handleAddToCart(product, quantity)} 
                disabled={product.stock <= 0}
                className={`flex-grow font-semibold py-3 px-6 rounded-md transition-colors flex items-center justify-center space-x-2 ${
                  product.stock > 0
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                }`}
              >
                <FiShoppingCart size={20} />
                <span>
                  {product.stock > 0 ? 'Añadir al carrito' : 'Agotado'}
                </span>
              </button>
            </div>

            {product.stock > 0 && product.stock < 10 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                <p className="text-yellow-800 text-sm">
                  ⚠️ Solo quedan {product.stock} unidades en stock
                </p>
              </div>
            )}

            {product.stock <= 0 && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-red-800 text-sm">
                  🔴 Producto agotado
                </p>
              </div>
            )}
          </div>
        </div>

        {/* --- SECCIÓN PRODUCTOS RELACIONADOS --- */}
        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">PRODUCTOS RELACIONADOS</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
              {relatedProducts.slice(0, 5).map((prod) => (
                <Link key={prod.id} to={`/product/${prod.id}`}>
                  <ProductCard product={prod} />
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ProductView;