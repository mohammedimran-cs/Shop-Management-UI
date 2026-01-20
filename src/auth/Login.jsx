import { useState,useContext} from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  TextField,
  Button,
  Box,
  Paper,
  Typography,
  CircularProgress
} from "@mui/material";
import api from "../api/api";

export default function Login() {
  const [form, setForm] = useState({email: "",password: ""});
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { login, showToast } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
    setErrors({...errors, [e.target.name]: ""});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/login", form);

      let user = {email: res.data.email,role: res.data.role};

      login(res.data.token, user);
      navigate("/");

    } 
    catch (err) {
        if (err.response?.data?.status == 'error') {
            showToast(err.response.data.message, "error");
            setErrors({});
        }
        else if (err.response?.data?.message) {
            setErrors(err.response.data.message);
        }
        else {
            showToast("Login failed", "error");
        }
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
    >
      <Paper elevation={4} sx={{ padding: 4, width: 350 }}>
        <Typography variant="h5" align="center" mb={2} fontWeight={550} >
          SHOP MANAGEMENT
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            name="email"
            color="primary"
            error={!!errors.email}
            helperText={errors.email}
            onChange={handleChange}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Password"
            name="password"
            type="password"
            error={!!errors.password}
            helperText={errors.password}
            onChange={handleChange}
          /> 

          <Typography variant="body2" mt={1}>
            <Button
              variant="text"
              sx={{ textTransform: 'none', padding: 0, minWidth: 0 }}
              onClick={() => navigate('/forgot-password')}
            >
              Forgot Password?
            </Button>
          </Typography>

          <Button
            fullWidth
            variant="contained"
            type="submit"
            disabled={loading}
            sx={{ mt: 2 }}
          >
            {loading ? <CircularProgress  />
             : "Sign In"
            }
          </Button>
        </Box>
        <Box mt={2} display="flex" justifyContent="center">
          <Typography variant="body2">
            Don't have an account? <Box component="span" ml={0.5} 
            sx={{ color: 'blue', cursor: 'pointer' }} 
            onClick={() => navigate('/register')}>Register</Box>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}
