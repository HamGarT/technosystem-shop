import axios from 'axios';
import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useCart from '../../contexts/useCart';
import { useNotification } from '../../hooks/useNotification';
import GraphicCard from '@/assets/images/graphiccard.png'
import { Search, SlidersHorizontal, Menu, ArrowUpDown, DollarSign, X } from "lucide-react"

const apiUrl = import.meta.env.VITE_API_URL;
const sortOptions = [
  { id: "name-asc", label: "Nombre Ascendente" },
  { id: "name-desc", label: "Nombre Descendente" },
  { id: "price-desc", label: "Mayor a menor precio" },
  { id: "price-asc", label: "Menor a mayor precio" },
]

const categories = [
  { name: "Laptops", count: 42 },
  { name: "Teclados", count: 12 },
  { name: "Procesadores", count: 100 },
]

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

const TiendaLista = () => {

  const [filters, setFilters] = useState({
    categories: [],
    priceMin: 0,
    priceMax: 5000,
    sortBy: "name-asc",
    search: "",
  })

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const { addItem } = useCart();
  const { showSuccess, showError } = useNotification();

  const [searchParams] = useSearchParams();
  const name = searchParams.get('name') || '';
  const categoria = searchParams.get('categoria') || '';

  useEffect(() => {
    setLoading(true);
    setError(null);

    // Check if there are any search parameters
    const hasSearchParams = name || categoria;

    if (!hasSearchParams) {
      // No search params - fetch all products
      axios.get(`${apiUrl}/api/products`)
        .then((response) => {
          console.log('Respuesta de la API:', response);
          setProducts(response.data.data);
        })
        .catch((error) => {
          console.error("Error fetching products:", error);
          setError("No se pudieron cargar los productos. Por favor, intenta nuevamente.");
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      // Has search params - search products
      axios.get(`${apiUrl}/api/products/search`, {
        params: {
          name: name || undefined,
          categoria: categoria || undefined
        }
      })
        .then((response) => {
          console.log('Search results:', response);
          setProducts(response.data.data);
        })
        .catch((error) => {
          console.error("Error searching products:", error);
          setError("Error al buscar productos. Por favor, intenta nuevamente.");
        })
        .finally(() => {
          setLoading(false);
        });
    }

  }, [name, categoria]);

  const activeFilterTags = useMemo(() => {
    const tags = []

    filters.categories.forEach((cat) => {
      tags.push({ label: cat, key: `cat-${cat}` })
    })

    if (filters.priceMin > 0 || filters.priceMax < 5000) {
      tags.push({ label: `S/. ${filters.priceMin}-${filters.priceMax}`, key: "price" })
    }

    if (filters.search) {
      tags.push({ label: filters.search, key: "search" })
    }

    return tags
  }, [filters]);


  const removeFilterTag = (key) => {
    if (key.startsWith("cat-")) {
      const category = key.replace("cat-", "")
      setFilters((prev) => ({
        ...prev,
        categories: prev.categories.filter((c) => c !== category),
      }))
    } else if (key === "price") {
      setFilters((prev) => ({ ...prev, priceMin: 0, priceMax: 5000 }))
    } else if (key === "search") {
      setFilters((prev) => ({ ...prev, search: "" }))
    }
  }

  const handleCategoryChange = (category) => {
    setFilters((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category],
    }))
  }

  const clearFilters = () => {
    setFilters({
      categories: [],
      priceMin: 0,
      priceMax: 5000,
      sortBy: "name-asc",
      search: "",
    })
  }

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    const result = products.filter((product) => {
      const matchesCategory = filters.categories.length === 0 || filters.categories.includes(product.categoria)
      const matchesPrice = product.precio >= filters.priceMin && product.precio <= filters.priceMax
      const matchesSearch =
        filters.search === "" ||
        product.nombre.toLowerCase().includes(filters.search.toLowerCase()) ||
        product.descripcion.toLowerCase().includes(filters.search.toLowerCase())

      return matchesCategory && matchesPrice && matchesSearch
    })

    // Sort
    switch (filters.sortBy) {
      case "name-asc":
        result.sort((a, b) => a.nombre.localeCompare(b.nombre))
        break
      case "name-desc":
        result.sort((a, b) => b.nombre.localeCompare(a.nombre))
        break
      case "price-asc":
        result.sort((a, b) => a.precio - b.precio)
        break
      case "price-desc":
        result.sort((a, b) => b.precio - a.precio)
        break
    }

    return result
  }, [products, filters])


  const FilterPanel = () => (
    <div className="bg-background rounded-2xl shadow-lg p-6 ">
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-foreground" />
          <h2 className="text-xl font-semibold text-foreground">Filtros</h2>
        </div>
        <button
          onClick={clearFilters}
          className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
        >
          Limpiar
        </button>
      </div>

      {/* Active Filter Tags */}
      {activeFilterTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {activeFilterTags.map((tag) => (
            <span
              key={tag.key}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-200 text-foreground rounded-full text-sm font-medium"
            >
              {tag.label}
              <button onClick={() => removeFilterTag(tag.key)} className="ml-1 hover:text-primary transition-colors">
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Buscar productos"
          value={filters.search}
          onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all bg-background text-foreground placeholder:text-muted-foreground"
        />
      </div>

      {/* Categories */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Menu className="w-5 h-5 text-foreground" />
          <h3 className="font-semibold text-lg text-foreground">Categorías</h3>
        </div>
        <div className="h-px bg-border mb-4" />
        <div className="space-y-3">
          {categories.map((category) => (
            <label key={category.name} className="flex items-center justify-between cursor-pointer group">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={filters.categories.includes(category.name)}
                    onChange={() => handleCategoryChange(category.name)}
                    className="peer sr-only"
                  />
                  <div className="w-5 h-5 border-2 border-border rounded-md peer-checked:bg-primary peer-checked:border-primary transition-all flex items-center justify-center">
                    {filters.categories.includes(category.name) && (
                      <svg
                        className="w-3 h-3 text-primary-foreground"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-foreground group-hover:text-primary transition-colors">{category.name}</span>
              </div>
              <span className="text-sm text-muted-foreground bg-gray-200 rounded-full px-2 py-0.5">
                {category.count}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Sort */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <ArrowUpDown className="w-5 h-5 text-foreground" />
          <h3 className="font-semibold text-lg text-foreground">Ordenar por</h3>
        </div>
        <div className="h-px bg-border mb-4" />
        <div className="space-y-3">
          {sortOptions.map((option) => (
            <label key={option.id} className="flex items-center gap-3 cursor-pointer group">
              <div className="relative">
                <input
                  type="radio"
                  name="sortBy"
                  value={option.id}
                  checked={filters.sortBy === option.id}
                  onChange={(e) => setFilters((prev) => ({ ...prev, sortBy: e.target.value }))}
                  className="peer sr-only"
                />
                <div className="w-5 h-5 border-2 border-border rounded-md peer-checked:bg-primary peer-checked:border-primary transition-all flex items-center justify-center">
                  {filters.sortBy === option.id && (
                    <svg
                      className="w-3 h-3 text-primary-foreground"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
              <span className="text-foreground group-hover:text-primary transition-colors">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <DollarSign className="w-5 h-5 text-foreground" />
          <h3 className="font-semibold text-lg text-foreground">Rango de precio</h3>
        </div>
        <div className="px-1">
          <input
            type="range"
            min="0"
            max="12000"
            step="100"
            value={filters.priceMax}
            onChange={(e) => setFilters((prev) => ({ ...prev, priceMax: Number.parseInt(e.target.value) }))}
            className="w-full h-2 bg-muted rounded-lg  cursor-pointer accent-primary border-none"
          />
          <div className="flex justify-between mt-2 text-sm text-muted-foreground">
            <span>S/. {filters.priceMin}</span>
            <span>S/. {filters.priceMax}</span>
          </div>
        </div>
      </div>

      {/* Apply Button */}
      <button
        onClick={() => setMobileFiltersOpen(false)}
        className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors"
      >
        Aplicar Filtros
      </button>
    </div>
  )

  const handleAddToCart = (product) => {
    const success = addItem(product);

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
      <ConfirmationModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        product={selectedProduct}
        quantity={1}
        onContinueShopping={handleContinueShopping}
        onGoToCart={handleGoToCart}
      />

      <div className='flex flex-2 justify-between gap-8 bg-gray-200'>
        <h1 className="text-[88px] p-12  text-gray-900 m-2">
          EXPLORA TODOS <br /> NUESTROS PRODUCTOS
        </h1>
        <img src={GraphicCard} alt="Laptop" className="h-[350px]" />
      </div>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Panel de Filtros */}
          <div className="lg:w-1/4 order-2 lg:order-1">
            <FilterPanel/>
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
                  <div className='p-3 bg-gray-50  border-b-gray-200 border-b'>
                    <span className='text-sm font-medium text-gray-600 uppercase tracking-wide'>
                      {product.categoria}
                    </span>
                  </div>
                  <div className="p-4">
                    <img
                      src={product.imagen || product.image_url || "/images/placeholder.jpg"}
                      alt={product.nombre}
                      className="w-full rounded-lg h-48 object-contain mb-4"
                      onError={handleImageError}
                    />
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg text-gray-800 line-clamp-2">
                        {product.nombre}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium min-w-[80px] text-center ${product.stock > 0
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
                        S/ {product.precio?.toLocaleString() || '0'}
                      </span>
                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={product.stock <= 0}
                        className={`px-4 py-2 rounded-md font-medium transition-colors ${product.stock > 0
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