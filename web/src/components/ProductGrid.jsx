import { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import axios from 'axios';

const products = [
  { id: 1, title: 'TARJETA DE VIDEO GIGABYTE GEFORCE RTX 5060 8GB AERO OC DDR7', price: '2050', image: 'https://i.imgur.com/v2FcB2s.png' },
  { id: 2, title: 'TARJETA DE VIDEO GIGABYTE GEFORCE RTX 5060 8GB AERO OC DDR7', price: '2050', image: 'https://i.imgur.com/v2FcB2s.png' },
  { id: 3, title: 'TARJETA DE VIDEO GIGABYTE GEFORCE RTX 5060 8GB AERO OC DDR7', price: '2050', image: 'https://i.imgur.com/v2FcB2s.png' },
  { id: 4, title: 'TARJETA DE VIDEO GIGABYTE GEFORCE RTX 5060 8GB AERO OC DDR7', price: '2050', image: 'https://i.imgur.com/v2FcB2s.png' },
  { id: 5, title: 'TARJETA DE VIDEO GIGABYTE GEFORCE RTX 5060 8GB AERO OC DDR7', price: '2050', image: 'https://i.imgur.com/v2FcB2s.png' },
  { id: 6, title: 'TARJETA DE VIDEO GIGABYTE GEFORCE RTX 5060 8GB AERO OC DDR7', price: '2050', image: 'https://i.imgur.com/v2FcB2s.png' },
];

const ProductGrid = () => {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    axios.get('https://technosystem-shop-production.up.railway.app/api/products')
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
            <div key={product.id} className="h-full">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;