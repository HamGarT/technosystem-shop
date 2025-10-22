import { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import axios from 'axios';
import { Link } from 'react-router-dom'; // <-- 1. Importa Link

const ProductGrid = () => {
  const apiUrl =  import.meta.env.VITE_API_URL;
  const [products, setProducts] = useState([]);
  useEffect(() => {
    axios.get(`${apiUrl}/api/products`)
      .then((response) => {
        console.log(response)
        setProducts(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, []);

  return (
    <section className="py-16 bg-white">
      <div className="px-4 sm:px-6 lg:px-8">
        <h2 className="text-[64px] mb-8">
          NUEVOS PRODUCTOS
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.slice(0, 8).map((product) => (
            
            // 2. Reemplaza el 'div' por un 'Link'
            //    Asegúrate de que tu ruta a ProductView sea '/product/:id'
            <Link 
              key={product.id} 
              to={`/product/${product.id}`} 
              className="h-full"
            >
              <ProductCard product={product} />
            </Link>

          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;