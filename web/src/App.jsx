import { Routes, Route, Link } from 'react-router-dom' // ← Solo Routes, Route, Link
import Home from '../pages/home'
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Bienvenida from '../pages/principal'
import './App.css'
import './index.css'

// Componente para la página About
function About() {
  return (
    <div className="text-center p-20">
      <h1 className='text-blue-700'>Acerca de nosotros</h1>
      <p>Esta es la página acerca de nosotros.</p>
    </div>
  )
}

// Componente para la página Contacto
function Contact() {
  return (
    <div className="text-center p-20">
      <h1 className='text-green-700'>Contacto</h1>
      <p>Esta es la página de contacto.</p>
    </div>
  )
}

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <nav>
        <Link to="/">Inicio</Link> |{' '}
        <Link to="/about">Acerca</Link> |{' '}
        <Link to="/contact">Contacto</Link> |{' '}
        <Link to="/bienvenida">Bienvenida</Link>
      </nav>
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/bienvenida" element={<Bienvenida />} />
      </Routes>
    </div>
  )
}

export default App