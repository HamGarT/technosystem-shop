import { Routes, Route } from "react-router-dom"
import "./App.css"
import RootLayout from "./pages/layout"
import { Toaster } from 'react-hot-toast';
export default function App() {
  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/*" element={<RootLayout />} />
      </Routes>
    </>
  );
}
