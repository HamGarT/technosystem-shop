import ProductCard from './ProductCard'; 

const products = [
  { id: 1, title: 'TARJETA DE VIDEO GIGABYTE GEFORCE RTX 5060 8GB AERO OC DDR7', price: '2050', image: 'https://i.imgur.com/v2FcB2s.png' },
  { id: 2, title: 'TARJETA DE VIDEO GIGABYTE GEFORCE RTX 5060 8GB AERO OC DDR7', price: '2050', image: 'https://i.imgur.com/v2FcB2s.png' },
  { id: 3, title: 'TARJETA DE VIDEO GIGABYTE GEFORCE RTX 5060 8GB AERO OC DDR7', price: '2050', image: 'https://i.imgur.com/v2FcB2s.png' },
  { id: 4, title: 'TARJETA DE VIDEO GIGABYTE GEFORCE RTX 5060 8GB AERO OC DDR7', price: '2050', image: 'https://i.imgur.com/v2FcB2s.png' },
  { id: 5, title: 'TARJETA DE VIDEO GIGABYTE GEFORCE RTX 5060 8GB AERO OC DDR7', price: '2050', image: 'https://i.imgur.com/v2FcB2s.png' },
  { id: 6, title: 'TARJETA DE VIDEO GIGABYTE GEFORCE RTX 5060 8GB AERO OC DDR7', price: '2050', image: 'https://i.imgur.com/v2FcB2s.png' },
];

const ProductGrid = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-8">
          NUEVOS PRODUCTOS
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
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