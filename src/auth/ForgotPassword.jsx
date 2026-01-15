import {useState} from 'react'
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Box, Paper,Typography,TextField,Button, CircularProgress } from "@mui/material";
import api from '../api/api';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const {showToast} = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handlClick = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post("/auth/forgot-password", { email: email });
            showToast(res.data.message, "success");
            setLoading(false);
        } 
        catch (err) {
            if(err.response?.data?.status === 'input error'){
                showToast(err.response.data.message.email, "error");
                setErrors(err.response.data.message);
            }
            else{
            showToast(err.response?.data?.message || "Failed to send reset link. Please try again.", "error");
            }
        }
        finally {
            setLoading(false);
        }
    };

    if(loading){
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress size={30} sx={{ color: "blue"}} />
            </Box>
        )
    }

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Paper elevation={3} sx={{ padding: 3, maxWidth: 420, width: "100%", textAlign: "center" }}>
            <Typography variant="body1">
                Enter your email, we'll send you a link to get back into your account.
            </Typography>
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              margin="normal"
              error={!!errors.email}
              helperText={errors.email}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button onClick={handlClick}
              variant="contained"
              sx={{ mt: 2 }}
              type="submit"
            >
              Send reset link
            </Button>            
        </Paper>
    </Box>
  )
}

export default ForgotPassword