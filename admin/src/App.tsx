import { Routes, Route } from "react-router-dom"
import "./App.css"
import RootLayout from "./pages/layout"
import { Toaster } from 'react-hot-toast';
import { Toaster as ToasterS } from "@/components/ui/sonner"
import Login from "./pages/login";
import { ProtectedAdminRoute } from "./components/ProtectedAdminRoute";
import UnauthorizedPage from "./pages/unauthorized";

export default function App() {
  return (
    <>
      <Toaster position="top-center" />
      <ToasterS position="top-center" />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={<ProtectedAdminRoute><RootLayout /></ProtectedAdminRoute>} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
      </Routes>
    </>
  );
}
