import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-blue-800 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">          
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <span className="text-blue-600 font-bold text-xl">T</span>
              </div>
              <span className="text-white font-bold text-xl hidden sm:block">
                TECHNOSYSTEM
              </span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                isActive('/') 
                  ? 'bg-blue-700 text-white' 
                  : 'text-blue-100 hover:bg-blue-500 hover:text-white'
              }`}
            >
              Inicio
            </Link>
            <Link
              to="/about"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                isActive('/about') 
                  ? 'bg-blue-700 text-white' 
                  : 'text-blue-100 hover:bg-blue-500 hover:text-white'
              }`}
            >
              Sobre de Nosotros
            </Link>
            <Link
              to="/tienda"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                isActive('/tienda') 
                  ? 'bg-blue-700 text-white' 
                  : 'text-blue-100 hover:bg-blue-500 hover:text-white'
              }`}
            >
              Tienda
            </Link>
            
          </div>

          {/* Iconos de usuario y carrito */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="text-blue-100 hover:text-white p-2 rounded-md hover:bg-blue-500 transition-colors duration-200">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>
            <button className="text-blue-100 hover:text-white p-2 rounded-md hover:bg-blue-500 transition-colors duration-200 relative">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5H21" />
              </svg>
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                0
              </span>
            </button>
          </div>

          {/* Botón del menú móvil */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-blue-100 hover:text-white focus:outline-none focus:text-white p-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Menú móvil */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-blue-700">
              <Link
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                  isActive('/') 
                    ? 'bg-blue-800 text-white' 
                    : 'text-blue-100 hover:bg-blue-600 hover:text-white'
                }`}
              >
                Inicio
              </Link>
              <Link
                to="/about"
                onClick={() => setIsMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                  isActive('/about') 
                    ? 'bg-blue-800 text-white' 
                    : 'text-blue-100 hover:bg-blue-600 hover:text-white'
                }`}
              >
                Acerca de Nosotros
              </Link>
              <Link
                to="/tienda"
                onClick={() => setIsMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                  isActive('/tienda') 
                    ? 'bg-blue-800 text-white' 
                    : 'text-blue-100 hover:bg-blue-600 hover:text-white'
                }`}
              >
                Tienda
              </Link>
              <Link
                to="/bienvenida"
                onClick={() => setIsMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                  isActive('/bienvenida') 
                    ? 'bg-blue-800 text-white' 
                    : 'text-blue-100 hover:bg-blue-600 hover:text-white'
                }`}
              >
                Bienvenida
              </Link>
              
              {/* Opciones móviles para usuario y carrito */}
              <div className="border-t border-blue-600 pt-4 mt-4">
                <button className="flex items-center w-full px-3 py-2 text-blue-100 hover:bg-blue-600 hover:text-white rounded-md transition-colors duration-200">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Mi Cuenta
                </button>
                <button className="flex items-center w-full px-3 py-2 text-blue-100 hover:bg-blue-600 hover:text-white rounded-md transition-colors duration-200">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5H21" />
                  </svg>
                  Carrito (0)
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;