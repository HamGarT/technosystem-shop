import { Routes, Route } from "react-router-dom"
import "./App.css"
import RootLayout from "./pages/layout"

export default function App() {
  return (
    
        <Routes>
          <Route path="/*" element={<RootLayout/>}/>
        </Routes>
     
  )
}
