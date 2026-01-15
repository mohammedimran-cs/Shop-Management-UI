import { useEffect, useState, useContext } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../api/api";
import { Box, Typography, CircularProgress, Button, Paper, TextField } from "@mui/material";
import { AuthContext } from "../context/AuthContext";

export default function Verify() {
  const [params] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("Verifying your email...");
  const [error,setError] = useState({});
  const [errorToken, setErrorToken] = useState(false);
  const [email, setEmail] = useState("");
  const { showToast } = useContext(AuthContext);
  const navigate = useNavigate();

useEffect(() => {
  const verifyEmail = async () => {
    const token = params.get("token");
    if(token){
      try {
        const res = await api.get(`/auth/verify?token=${token}`);
        setMessage(res.data.message);
        setErrorToken(true);
      } catch (err) {
        setMessage(err.response?.data?.message || "Email verification failed. Please try again.");
        setErrorToken(false);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
      setMessage("Please Generate a verification link.");
    }
  };
  verifyEmail();
    
}, []);

  const handleClick = async (e) => {
    e.preventDefault();
    setLoading(true);
      try {
        const res = await api.post("/auth/resend", { email: email });
        navigate("/login");
        showToast("We have sent a new verification email. Please check your inbox.", "info");
      } catch (err) {
          if(err.response?.data?.status === 'input error'){
            setError(err.response.data.message);
          }
          else{
            setError({});
            showToast(err.response?.data?.message || "Failed to send verification email. Please try again.", "error");
          }
        }
      finally {
        setLoading(false);
      }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress size={30} />
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
      <Box component="form" onSubmit={handleClick}>
        {errorToken ? <Box m={2}>
          {message}
        </Box> :
        <>
        <Box m={2}>
          {message}
        </Box>
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            error={!!error.email}
            helperText={error.email}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button
            variant="contained"
            sx={{ mt: 2 }}
            type="submit"
          >
            Generate New verification link
          </Button>
        </>
}
      </Box>
      </Paper>
    </Box>

  );
}
