import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../auth/Login";
import Register from "../auth/Register";
import Setting from "../pages/Setting";
import Home from "../pages/Home";
import Products from "../pages/Products";
import Billing from "../pages/Billing";
import Layout from "../pages/Layout";
import Verify from "../auth/Verify";
import ResetPassword from "../auth/ResetPassword";
import ForgotPassword from "../auth/ForgotPassword";
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
        <Route path="/forgot-password" element={user ? <Navigate to="/" /> : <ForgotPassword />} /> 
        <Route path="/reset/:token" element={user ? <Navigate to="/" /> : <ResetPassword />} />

        {/* Protected */}
        <Route element={<Layout />}>
          <Route path="/" element={<Products />} />
          {/* <Route path="/products" element={<Products />} /> */}
          <Route path="/billing" element={<Billing />} />
          <Route path="/setting" element={<Setting />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}
