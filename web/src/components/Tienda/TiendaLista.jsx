import axios from 'axios';
import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { useNotification } from '../../hooks/useNotification';

const ConfirmationModal = ({ isOpen, onClose, product, onContinueShopping, onGoToCart }) => {
  if (!isOpen) return null;

  return (
 <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-t-xl p-6 text-white">
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
          
          <div className="flex items-center mb-6 p-4 bg-gray-50 rounded-lg">
            <img
              src={product?.imagen || product?.image_url || "/images/placeholder.jpg"}
              alt={product?.nombre}
              className="w-16 h-16 object-cover rounded-md mr-4"
            />
            <div>
              <h4 className="font-medium text-gray-900">{product?.nombre}</h4>
              <p className="text-lg font-bold text-blue-600">${product?.precio?.toLocaleString() || '0'}</p>
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

const TiendaLista = () => {
  const [filters, setFilters] = useState({
    category: '',
    priceRange: '',
    brand: '',
    inStock: false
  });

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  const { addToCart } = useCart();
  const { showSuccess, showError } = useNotification();

  useEffect(() => {
    setLoading(true);
    axios.get('https://technosystem-shop-production.up.railway.app/api/products')
      .then((response) => {
        console.log('Respuesta de la API:', response);
        setProducts(response.data.data);
        setError(null);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setError("No se pudieron cargar los productos. Por favor, intenta nuevamente.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleAddToCart = (product) => {
    const success = addToCart(product);
    
    if (success) {
      setSelectedProduct(product);
      setModalOpen(true);
      showSuccess(`"${product.nombre}" agregado al carrito`);
    } else {
      showError(`No hay suficiente stock de "${product.nombre}"`);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedProduct(null);
  };

  const handleContinueShopping = () => {
    setModalOpen(false);
    setSelectedProduct(null);
  };

  const handleGoToCart = () => {
    setModalOpen(false);
    setSelectedProduct(null);
    navigate('/cart');
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      priceRange: '',
      brand: '',
      inStock: false
    });
  };

  // Filtrar productos basado en los filtros seleccionados
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesCategory = filters.category === '' || product.categoria === filters.category;
      const matchesBrand = filters.brand === '' || product.marca === filters.brand;
      const matchesStock = !filters.inStock || product.stock > 0;
      
      let matchesPrice = true;
      if (filters.priceRange !== '') {
        switch (filters.priceRange) {
          case 'low':
            matchesPrice = product.precio < 1000;
            break;
          case 'medium':
            matchesPrice = product.precio >= 1000 && product.precio < 1500;
            break;
          case 'high':
            matchesPrice = product.precio >= 1500;
            break;
          default:
            matchesPrice = true;
        }
      }

      return matchesCategory && matchesBrand && matchesStock && matchesPrice;
    });
  }, [products, filters]);

  // Función para manejar errores de imagen
  const handleImageError = (e) => {
    e.target.src = "/images/placeholder.jpg";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-500 text-lg mt-4">Cargando productos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Modal de Confirmación */}
      <ConfirmationModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        product={selectedProduct}
        onContinueShopping={handleContinueShopping}
        onGoToCart={handleGoToCart}
      />

      <div className='flex flex-2 justify-between gap-8 bg-gray-300'>
        <h1 className="text-5xl p-12 font-bold text-gray-900 m-2">
          EXPLORA TODOS <br /> NUESTROS PRODUCTOS
        </h1>
        <img src="/images/laptop.png" alt="Laptop" className="w-70 h-70 m-4 p-3 object-contain" />
      </div>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Panel de Filtros */}
          <div className="lg:w-1/4 order-2 lg:order-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Filtros</h2>
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Limpiar
                </button>
              </div>

              {/* Filtro por Categoría */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-700 mb-3">Categoría</h3>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="">Todas las categorías</option>
                  <option value="laptops">Laptops</option>
                  <option value="smartphones">Smartphones</option>
                  <option value="tablets">Tablets</option>
                  <option value="accesorios">Accesorios</option>
                </select>
              </div>

              <div className="mb-6">
                <h3 className="font-medium text-gray-700 mb-3">Marca</h3>
                <select
                  value={filters.brand}
                  onChange={(e) => handleFilterChange('brand', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="">Todas las marcas</option>
                  <option value="Apple">Apple</option>
                  <option value="Dell">Dell</option>
                  <option value="ASUS">ASUS</option>
                  <option value="Samsung">Samsung</option>
                  <option value="HP">HP</option>
                  <option value="Lenovo">Lenovo</option>
                </select>
              </div>

              <div className="mb-6">
                <h3 className="font-medium text-gray-700 mb-3">Rango de Precio</h3>
                <select
                  value={filters.priceRange}
                  onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="">Todos los precios</option>
                  <option value="low">Menos de $1000</option>
                  <option value="medium">$1000 - $1500</option>
                  <option value="high">Más de $1500</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.inStock}
                    onChange={(e) => handleFilterChange('inStock', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-700">Solo productos en stock</span>
                </label>
              </div>

              <div className="lg:hidden mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </div>

          {/* Lista de Productos */}
          <div className="lg:w-3/4 order-1 lg:order-2">
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600 hidden lg:block">
                {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}
              </p>
              <div className="text-sm text-gray-500">
                Mostrando {filteredProducts.length} de {products.length} productos
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <div 
                  key={product.id} 
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 hover:translate-y-[-4px]"
                >
                  <div className='p-3 bg-gray-50 border-b'>
                    <span className='text-sm font-medium text-gray-600 uppercase tracking-wide'>
                      {product.categoria}
                    </span>
                  </div>
                  <div className="p-4">
                    <img
                      src={product.imagen || product.image_url || "/images/placeholder.jpg"}
                      alt={product.nombre}
                      className="w-full rounded-lg h-48 object-cover mb-4"
                      onError={handleImageError}
                    />
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg text-gray-800 line-clamp-2">
                        {product.nombre}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium min-w-[80px] text-center ${
                        product.stock > 0 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {product.stock > 0 ? `En stock (${product.stock})` : 'Agotado'}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {product.descripcion || product.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-gray-900">
                        ${product.precio?.toLocaleString() || '0'}
                      </span>
                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={product.stock <= 0}
                        className={`px-4 py-2 rounded-md font-medium transition-colors ${
                          product.stock > 0
                            ? 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        {product.stock > 0 ? 'Agregar al carrito' : 'Agotado'}
                      </button>
                    </div>
                    {product.marca && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <span className="text-sm text-gray-500">Marca: {product.marca}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <p className="text-gray-500 text-lg mb-4">No se encontraron productos con los filtros seleccionados.</p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Limpiar filtros
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TiendaLista;