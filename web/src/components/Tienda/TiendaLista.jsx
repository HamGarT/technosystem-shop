import React, { useState } from 'react';

const TiendaLista = () => {

  const [filters, setFilters] = useState({
    category: '',
    priceRange: '',
    brand: '',
    inStock: false
  });

  // Datos de ejemplo para productos
  const products = [
    {
      id: 1,
      name: 'Laptop Dell XPS 13',
      price: 1299.99,
      category: 'laptops',
      brand: 'Dell',
      description: 'Laptop ultradelgada con pantalla InfinityEdge',
      image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400',
      inStock: true
    },
    {
      id: 2,
      name: 'MacBook Pro 14"',
      price: 1999.99,
      category: 'laptops',
      brand: 'Apple',
      description: 'Potente laptop para profesionales',
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400',
      inStock: true
    },
    {
      id: 3,
      name: 'ASUS ROG Gaming',
      price: 1599.99,
      category: 'laptops',
      brand: 'ASUS',
      description: 'Laptop gaming con RTX 4060',
      image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400',
      inStock: false
    },
    {
      id: 4,
      name: 'iPhone 15 Pro',
      price: 999.99,
      category: 'smartphones',
      brand: 'Apple',
      description: 'Smartphone flagship con cámara profesional',
      image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400',
      inStock: true
    },
    {
      id: 5,
      name: 'Samsung Galaxy S24',
      price: 849.99,
      category: 'smartphones',
      brand: 'Samsung',
      description: 'Teléfono Android con IA integrada',
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',
      inStock: true
    },
    {
      id: 6,
      name: 'iPad Air',
      price: 599.99,
      category: 'tablets',
      brand: 'Apple',
      description: 'Tablet versátil para trabajo y entretenimiento',
      image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400',
      inStock: true
    }
  ];

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
  const filteredProducts = products.filter(product => {
    return (
      (filters.category === '' || product.category === filters.category) &&
      (filters.brand === '' || product.brand === filters.brand) &&
      (!filters.inStock || product.inStock) &&
      (filters.priceRange === '' || 
        (filters.priceRange === 'low' && product.price < 1000) ||
        (filters.priceRange === 'medium' && product.price >= 1000 && product.price < 1500) ||
        (filters.priceRange === 'high' && product.price >= 1500))
    );
  });

  return (
    <div className="min-h-screen bg-gray-50">
        <div className='flex flex-2 justify-between  gap-8 bg-gray-300'>
            <h1 className="text-5xl p-12 font-bold text-gray-900 m-2">
                EXPLORA TODOS <br /> NUESTROS PRODUCTOS
            </h1>
            <img src="/images/laptop.png" alt="Laptop" className="w-70 h-70 m-4 p-3 object-contain" />
        </div>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Panel de Filtros - Lado Izquierdo en móvil, Derecho en desktop */}
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
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Todas las categorías</option>
                  <option value="laptops">Laptops</option>
                  <option value="smartphones">Smartphones</option>
                  <option value="tablets">Tablets</option>
                </select>
              </div>

              {/* Filtro por Marca */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-700 mb-3">Marca</h3>
                <select 
                  value={filters.brand}
                  onChange={(e) => handleFilterChange('brand', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Todas las marcas</option>
                  <option value="Apple">Apple</option>
                  <option value="Dell">Dell</option>
                  <option value="ASUS">ASUS</option>
                  <option value="Samsung">Samsung</option>
                </select>
              </div>

              {/* Filtro por Precio */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-700 mb-3">Rango de Precio</h3>
                <select 
                  value={filters.priceRange}
                  onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Todos los precios</option>
                  <option value="low">Menos de $1000</option>
                  <option value="medium">$1000 - $1500</option>
                  <option value="high">Más de $1500</option>
                </select>
              </div>

              {/* Filtro por Disponibilidad */}
              <div className="mb-4">
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    checked={filters.inStock}
                    onChange={(e) => handleFilterChange('inStock', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-700">Solo productos en stock</span>
                </label>
              </div>
            </div>
          </div>

          {/* Lista de Productos - Lado Derecho */}
          <div className="lg:w-3/4 order-1 lg:order-2">
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">
                {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <div key={product.id} className="p-4 bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <div className='p-2'><label className='text-lg font-medium text-gray-700'>{product.category}</label></div>
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full rounded-lg h-48 object-cover"
                  />
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg text-gray-800">{product.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        product.inStock 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {product.inStock ? 'En stock' : 'Agotado'}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">{product.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-black">
                        ${product.price}
                      </span>
                      <button 
                        disabled={!product.inStock}
                        className={`px-4 py-2 rounded-md font-medium ${
                          product.inStock
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        {product.inStock ? 'Agregar al carrito' : 'Agotado'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No se encontraron productos con los filtros seleccionados.</p>
                <button 
                  onClick={clearFilters}
                  className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
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