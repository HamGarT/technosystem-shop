import { FaFacebookF, FaYoutube, FaInstagram, FaTiktok, FaWhatsapp } from 'react-icons/fa';
import { FiArrowUp, FiPlus } from 'react-icons/fi';
import Visa from "@/assets/images/visa.png";
import Card from "@/assets/images/card.png";
import Yape from "@/assets/images/Yape.png";
import Diners from "@/assets/images/diners-club.png";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 pt-12 text-[18px]">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="font-bold text-blue-800 tracking-wider">ACERCA DE NOSOTROS</h3>
            <ul className="space-y-3 text-gray-600">
              <li><a href="#" className="hover:text-blue-600 transition-colors">Nuestra Empresa</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Nuestros Locales</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Modalidades de Pago</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Delivery Lima</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Envíos a Provincia</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Serv. Mant. y Reparación</a></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="font-bold text-blue-800 tracking-wider">GARANTÍAS</h3>
            <ul className="space-y-3 text-gray-600">
              <li><a href="#" className="hover:text-blue-600 transition-colors">T & C Garantía</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Términos y Condiciones</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Política de privacidad</a></li>
            </ul>
            <div className="flex space-x-3 pt-2">
              <a href="#" className="text-blue-800 hover:text-blue-600"><FaFacebookF size={30} /></a>
              <a href="#" className="text-red-600 hover:text-red-400"><FaYoutube size={30} /></a>
              <a href="#" className="text-pink-600 hover:text-pink-400"><FaInstagram size={30} /></a>
              <a href="#" className="text-black hover:text-gray-600"><FaTiktok size={30} /></a>
            </div>
          </div>
          <div className="space-y-4 text-gray-600">
            <h3 className="font-bold text-blue-800 tracking-wider">UBÍCANOS</h3>
            <p>Tienda - C.C. Centro Lima: Av. Bolivia 148 Int 553, Centro (01) 425 - 191</p>
          </div>
          <div className="space-y-4 text-gray-600">
            <h3 className="font-bold text-blue-800 tracking-wider">CONTACTOS</h3>
            <p>
              <a href="mailto:ventasweb@impacto.com.pe" className="hover:text-blue-600">ventasweb@impacto.com.pe</a><br />
              <a href="mailto:online@impacto.com.pe" className="hover:text-blue-600">online@impacto.com.pe</a><br />
              Central (01) 425 - 191
            </p>
            <p className="pt-4">Esta página permite pagos online con:</p>
            <div className="flex items-center space-x-2 justify-evenly">
                <img src={Visa} alt="Visa" className="h-10" />
                <img src={Card} alt="Mastercard" className="h-10" />
                <img src={Yape} alt="Yape" className="h-10" />
                <img src={Diners} alt="Diners Club" className="h-10" />
            </div>
          </div>
      
        </div>
      </div>
      <div className="mt-12 border-t border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500 text-sm">
          <p>Copyright 2025 © Importaciones Impacto. Todos los derechos reservados</p>
        </div>
      </div>
      <div className="fixed bottom-4 right-4 flex flex-col items-center space-y-2 z-50">
        <button className="bg-green-500 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 transition-transform hover:scale-110">
          <FaWhatsapp size={24} />
        </button>
        <button className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 transition-transform hover:scale-110">
          <FiArrowUp size={24} />
        </button>
        <button className="bg-blue-800 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-900 transition-transform hover:scale-110">
          <FiPlus size={24} />
        </button>
      </div>
    </footer>
  );
};

export default Footer;