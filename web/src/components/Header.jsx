import { Link } from 'react-router-dom';
import { FiPhoneCall, FiMenu, FiSearch, FiUser, FiShoppingCart, FiLogOut } from 'react-icons/fi';
import { useState } from 'react';
import { LoginForm } from './login-form';
import { useAuth } from '../contexts/AuthContext';
import { SearchBar } from './search-bar';


const Header = () => {
   const [isLoginOpen, setIsLoginOpen] = useState(false);
   const { user, isAuthenticated, logout } = useAuth(); // Usa el context

   const handleUserClick = () => {
    console.log(isAuthenticated)
      if (isAuthenticated) {
         // Si está logeado, mostrar menú de usuario
         setIsLoginOpen(true);
      } else {
         // Si no está logeado, abrir formulario de login
         setIsLoginOpen(true);
      }
   };

   const handleLogout = async () => {
      await logout();
      setIsLoginOpen(false);
   };

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
          <FiPhoneCall size={28} />
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
            <SearchBar/>
          </div>
          <div className="flex items-center space-x-6">
            {isAuthenticated ? (
              // Si está autenticado, mostrar el nombre y ícono de logout
              <div className="flex items-center space-x-4">
                <span className="text-sm">{user?.name}</span>
                <button 
                  onClick={handleLogout}
                  className="hover:text-gray-200 transition-colors"
                  title="Cerrar sesión"
                >
                  <FiLogOut size={26} />
                </button>
              </div>
            ) : (
              // Si no está autenticado, mostrar ícono de login
              <button 
                onClick={handleUserClick}
                className="hover:text-gray-200 transition-colors"
                title="Iniciar sesión"
              >
                <FiUser size={26} />
              </button>
            )}
            <button className="hover:text-gray-200">
              <Link to="/cart" className="inline-flex items-center">
                <FiShoppingCart size={26} />
              </Link>
            </button>
          </div>
        </div>
        <LoginForm isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      </div>
    </header>
  );
};

export default Header;