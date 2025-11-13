import { Routes, Route, Navigate } from "react-router-dom"
import "./App.css"
import RootLayout from "./pages/layout"
import { Toaster } from 'react-hot-toast';
import { Toaster as ToasterS } from "@/components/ui/sonner"
import { useAuth } from "./context/AuthContext";
import Login from "./pages/login";

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { token, loading } = useAuth();
  if (loading) {
    return <div>Cargando...</div>;
  }
  if (!token) {
    console
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default function App() {
  return (
    <>
      <Toaster position="top-center" />
      <ToasterS position="top-center" />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={<PrivateRoute><RootLayout /></PrivateRoute>} />
      </Routes>
    </>
  );
}
