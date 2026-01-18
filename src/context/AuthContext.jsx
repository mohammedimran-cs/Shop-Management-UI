import { createContext, useState, useEffect } from "react";
import { Box, CircularProgress , Snackbar, Alert } from "@mui/material";
import api from "../api/api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ open: false, message: "", severity: "success", time: 3000 });

  const login = (token, userData) => {
    localStorage.setItem("token", token);
    setUser(userData);
    setToast({ open: true, message: "You have logged in successfully", severity: "success" });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  useEffect(() => {
    const loadUser = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
        setLoading(false);
        return;
        }

        try {
        const res = await api.get("/auth/me");
        setUser(res.data);   // { email, role }
        } catch (err) {
        localStorage.removeItem("token");
        setUser(null);
        } finally {
        setLoading(false);
        }
    };

      loadUser();
  }, []);

  const showToast = (message, severity = "success", time = 3000) => {
   setToast({ open: true, message, severity, time });
  };



  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }


  return (
    <AuthContext.Provider value={{ user, login, logout, showToast }}>
      {children}
      <Snackbar
        open={toast.open}
        autoHideDuration={toast.time}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={toast.severity} sx={{ width: "100%" }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </AuthContext.Provider>
  );
}
