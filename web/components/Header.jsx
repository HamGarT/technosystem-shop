
import { Link } from 'react-router-dom';
import { FiPhoneCall, FiMenu, FiSearch, FiUser, FiShoppingCart } from 'react-icons/fi';
// src/components/Header.jsx


export const Header = () => {
  return (
    <header className="shadow-sm">      
      <div className="bg-white py-2 px-6 text-sm">
        <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-12">
                <div className="font-extrabold tracking-widest text-gray-800">
                TECHNOSYSTEM
                </div>
        <nav className="hidden md:flex">
        <ul className="flex space-x-8 font-semibold text-gray-600">
          <li><Link to="/" className="hover:text-blue-600 transition-colors">Home</Link></li>
          <li><Link to="/about" className="hover:text-blue-600 transition-colors">Sobre Nosotros</Link></li>
          <li><Link to="/shop" className="hover:text-blue-600 transition-colors">Tienda</Link></li>
        </ul>
        </nav>
                
            </div>
            <div className="flex items-center space-x-2 text-gray-800">
                <FiPhoneCall size={20} />
                <span className="font-bold">+51 980671234</span>
            </div>
            </div>
      </div>
      <hr />
      <div className="bg-blue-600 py-3 px-6 text-white">
        <div className="container mx-auto flex justify-between items-center space-x-4">
          <div className="flex items-center space-x-4">
            <button className="md:hidden"> 
              <FiMenu size={28} />
            </button>
            <div className="font-extrabold tracking-widest text-lg">
              TECHNOSYSTEM
            </div>
          </div>
          <div className="flex-grow max-w-2xl">
            <div className="flex bg-white rounded-md overflow-hidden">
              <span className="px-4 py-2 text-gray-500 border-r border-gray-200">
                All categorias▾
              </span>
              <input 
                type="text" 
                placeholder="Ingresar producto a buscar" 
                className="w-full p-2 text-gray-800 focus:outline-none"
              />
              <button className="px-4 text-gray-600 bg-gray-100 hover:bg-gray-200">
                <FiSearch size={20} />
              </button>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <button className="hover:text-gray-200">
              <FiUser size={26} />
            </button>
            <button className="hover:text-gray-200">
              <FiShoppingCart size={26} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;