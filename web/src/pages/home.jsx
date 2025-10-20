import React from 'react';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
import ProductCard from '../components/ProductCard';
import ProductCarousel from '../components/ProductCarousel';
import ProductGrid from '../components/ProductGrid';
import Computer from '@/assets/images/pc.png'

const Home = () => {


    
    return (
        <div className="bg-gray-50 min-h-screen px-[40px]">
            <div className="from-gray-950">
                <div className="mx-auto px-4 sm:px-6 lg:px-8 text-left">
                    <div className='flex justify-between'>
                        <h1 className="text-[118px] mb-6 max-w-2xl">
                            COMPUTADORAS Y ACCESORIOS
                        </h1>
                        <img src={Computer} alt="" srcset="" className='h-[350px]' />
                    </div>

                    <div>
                        <ProductCarousel />
                    </div>
                </div>
            </div>
            <div className="py-16 bg-white">
                <div className=" px-4 sm:px-6 lg:px-8">
                    <div className="py-16">
                        <div className="px-4 sm:px-6 lg:px-8">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                                <div className="p-6">
                                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2">+51 900071234</h3>
                                    <p className="text-gray-600">Atención telefónica</p>
                                </div>

                                <div className="p-6">
                                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5H21" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2">DELIVERY</h3>
                                    <p className="text-gray-600">Envío a domicilio</p>
                                </div>

                                <div className="p-6">
                                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2">ATENCIÓN A LOS RESIDENTES</h3>
                                    <p className="text-gray-600">Servicio personalizado</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <h2 className="text-[64px] mb-12">NUESTROS PRODUCTOS</h2>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                        <div className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow duration-200">
                            <div className="w-16 h-16 bg-gray-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                                <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h3 className="font-semibold">LAPTOPS</h3>
                        </div>

                        <div className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow duration-200">
                            <div className="w-16 h-16 bg-gray-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                                <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                                </svg>
                            </div>
                            <h3 className="font-semibold">CASES</h3>
                        </div>

                        <div className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow duration-200">
                            <div className="w-16 h-16 bg-gray-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                                <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                                </svg>
                            </div>
                            <h3 className="font-semibold">MEMORIAS</h3>
                        </div>

                        <div className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow duration-200">
                            <div className="w-16 h-16 bg-gray-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                                <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 3v9a2 2 0 002 2h6a2 2 0 002-2V7M9 7h6M9 11h6m-3 4h3" />
                                </svg>
                            </div>
                            <h3 className="font-semibold">GRÁFICAS</h3>
                        </div>

                        <div className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow duration-200">
                            <div className="w-16 h-16 bg-gray-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                                <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2H5z" />
                                </svg>
                            </div>
                            <h3 className="font-semibold">DISCOS</h3>
                        </div>

                    </div>
                    {/* Sección de productos completa */}
                    <ProductGrid />
                </div>
            </div>
        </div>
    )

}

export default Home;
