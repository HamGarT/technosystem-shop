
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, A11y } from 'swiper/modules';
import ProductCard from './ProductCard';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import axios from 'axios';

const ProductCarousel = () => {
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
    <div className="py-8">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 relative">
        <Swiper
          modules={[Navigation, Pagination, A11y]}
          spaceBetween={30}
          slidesPerView={5}
          loop={true}
          pagination={{ clickable: true }}
          navigation={{
            nextEl: '.swiper-button-next-custom',
            prevEl: '.swiper-button-prev-custom',
          }}
          breakpoints={{
            320: { slidesPerView: 1, spaceBetween: 10 },
            640: { slidesPerView: 2, spaceBetween: 20 },
            768: { slidesPerView: 3, spaceBetween: 30 },
            1024: { slidesPerView: 4, spaceBetween: 30 },
            1280: { slidesPerView: 5, spaceBetween: 30 },
          }}
          className="!pb-12"
        >
          {products.map((product) => (
            <SwiperSlide key={product.id} className="h-auto">
              <ProductCard product={product} />
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="swiper-button-prev-custom absolute top-1/2 -translate-y-1/2 left-0 z-10 cursor-pointer p-2 bg-white rounded-full shadow-md">
          <FiChevronLeft size={24} className="text-gray-600" />
        </div>
        <div className="swiper-button-next-custom absolute top-1/2 -translate-y-1/2 right-0 z-10 cursor-pointer p-2 bg-white rounded-full shadow-md">
          <FiChevronRight size={24} className="text-gray-600" />
        </div>
      </div>
    </div>
  );
};

export default ProductCarousel;