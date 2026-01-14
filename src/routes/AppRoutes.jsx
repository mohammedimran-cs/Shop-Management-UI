import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../auth/Login";
import Register from "../auth/Register";
import Home from "../pages/Home";
import Products from "../pages/Products";
import Layout from "../pages/Layout";
import Verify from "../auth/Verify";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function AppRoutes() {
  const { user } = useContext(AuthContext);
  return (
    <BrowserRouter>
      <Routes>

        {/* Public */}
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
        <Route path="/verify" element={user ? <Navigate to="/" /> : <Verify />} />

        {/* Protected */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}
