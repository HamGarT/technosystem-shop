import { Routes, Route } from 'react-router-dom'

import Home from "@/pages/home";
import Shop from "@/pages/Shop";
import About from "@/pages/About";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductView from './components/ProductView';
import './App.css'
import './index.css'
import Cart from './pages/Cart';




function App() {
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:id" element={<ProductView />} />
        <Route path='/cart' element={<Cart />} />
      </Routes>
      <Footer />
    </div>

  )

}

export default App