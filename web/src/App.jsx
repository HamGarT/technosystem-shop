import { Routes, Route } from 'react-router-dom' 
import Home from '../pages/home'
import Shop from '../pages/Shop'
import About from '../pages/About'
import Header from '../components/Header'
import './App.css'
import './index.css'


function App() {
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<Home />}/>   
        <Route path="/about" element={<About />}/>   
        <Route path="/shop" element={<Shop />}/>     
      </Routes>
    </div>
  )
  
  
}

export default App