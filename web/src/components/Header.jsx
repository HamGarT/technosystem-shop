
import { Link } from 'react-router-dom';
import { FiPhoneCall, FiMenu, FiSearch, FiUser, FiShoppingCart } from 'react-icons/fi';
// src/components/Header.jsx


export const Header = () => {
  return (
    <header className="shadow-sm">
      <div className="mx-auto  px-6 flex justify-between items-center">
        <div className="flex items-center space-x-12">
          <div className="text-[36px]">
            TECHNOSYSTEM
          </div>
          <nav className="hidden md:flex">
            <ul className="flex space-x-8 text-[24px] text-gray-800">
              <li>
                <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-blue-600 transition-colors">Sobre Nosotros</Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-blue-600 transition-colors">Tienda</Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="flex items-center space-x-2 text-gray-800">
          <FiPhoneCall size={28} /> {/* aumenté un poco para que quede parejo */}
          <span className="text-[36px]">+51 980671234</span>
        </div>
      </div>
      <div className="bg-blue-600 py-3 px-6 text-white">
        <div className="mx-auto flex justify-between items-center space-x-4">
          <div className="flex items-center space-x-4">
            <button className="md:hidden">
              <FiMenu size={28} />
            </button>
            <div className="text-[36px] text-lg">
              TECHNOSYSTEM
            </div>
          </div>
          <div className="flex-grow max-w-3xl">
            <div className="flex bg-white rounded-md overflow-hidden h-[43px]">
              <div className="w-[150px] px-4 py-2 text-gray-500 border-r border-gray-200">
                All categorias▾
              </div>
              <input
                type="text"
                placeholder="Ingresar producto a buscar"
                className="p-2 text-gray-800 focus:outline-none w-full"
              />
              <button className="px-4 text-gray-600 bg-gray-100 hover:bg-gray-200 items-end">
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