import { useEffect, useState, useContext } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../api/api";
import { Box, Typography, CircularProgress, Button, Paper } from "@mui/material";
import { AuthContext } from "../context/AuthContext";

export default function Verify() {
  const [params] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("Verifying your email...");
  const navigate = useNavigate();
  const { showToast } = useContext(AuthContext);

useEffect(() => {
  const verifyEmail = async () => {
    const token = params.get("token");
    try {
      const res = await api.get(`/auth/verify?token=${token}`);
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || "Email verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  setTimeout(() => {
     verifyEmail();
  }, [5000]);
    
}, []);


  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      <Paper
        elevation={3}
        sx={{
          padding: 3,
          maxWidth: 420,
          width: "100%",
          textAlign: "center",
        }}
      >
        <Typography variant="h6">
          {message}
        </Typography>
      </Paper>
    </Box>

  );
}
