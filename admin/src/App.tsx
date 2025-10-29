import { Routes, Route } from "react-router-dom"
import "./App.css"
import RootLayout from "./pages/layout"
import { Toaster } from 'react-hot-toast';
import { Toaster as ToasterS } from "@/components/ui/sonner"

export default function App() {
  return (
    <>
      <Toaster position="top-center" />
      <ToasterS position="top-center"/>
      <Routes>
        <Route path="/*" element={<RootLayout />} />
      </Routes>
    </>
  );
}
