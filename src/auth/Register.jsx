import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Box,
  Paper,
  Typography
} from "@mui/material";
import api from "../api/api";

export default function Register() {
  const [form, setForm] = useState({userName: "",email: "",password: ""});
  const [errors, setErrors] = useState({});
  const {showToast} = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/register", form);
      showToast(res.data.message, "info", 10000);
      navigate("/login");
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
        alert("Registration failed");
        }
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
    >
      <Paper elevation={4} sx={{ padding: 4, width: 400 }}>
        <Typography variant="h5" align="center" mb={2}>
          Create Account
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Username"
            name="userName"
            margin="normal"
            errors={!!errors.userName}
            helperText={errors.userName}
            onChange={handleChange}
          />

          <TextField
            fullWidth
            label="Email"
            name="email"
            margin="normal"
            error={!!errors.email}
            helperText={errors.email}
            onChange={handleChange}
          />

          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            margin="normal"
            error={!!errors.password}
            helperText={errors.password}
            onChange={handleChange}
          />

          <Button
            fullWidth
            variant="contained"
            type="submit"
            sx={{ mt: 2 }}
          >
            Register
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
