import { Routes, Route } from 'react-router-dom' 
import Home from '../pages/home'
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Bienvenida from '../pages/principal'
import Navbar from '../components/Navbar'
import './App.css'
import './index.css'

function About() {
  return (
    <div className="text-center p-20">
      <h1 className='text-blue-700'>Sobre de nosotros</h1>
      <p>Esta es la página acerca de nosotros.</p>
    </div>
  )
}

function Tienda() {
  return (
    <div className="text-center p-20">
      <h1 className='text-green-700'>Tienda</h1>
      <p>Esta es la página de la tienda.</p>
    </div>
  )
}

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/tienda" element={<Tienda />} />          
        </Routes>
      </main>
    </div>
  )
}

export default App