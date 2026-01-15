import {useState} from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Box,TextField,Paper,Button, Typography } from '@mui/material'
import api from '../api/api';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';


const ResetPassword = () => {
    const { token } = useParams();
    const [errors, setErrors] = useState({});
    const [password, setPassword] = useState({newPassword: "", confirmPassword: ""});
    const { showToast } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setPassword({
            ...password,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(password.newPassword !== password.confirmPassword){
            showToast("Passwords do not match", "error");
            return;
        }
        try {
            const res = await api.post("/auth/reset-password", { token: token, newPassword: password.newPassword });
            showToast(res.data.message, "success");
            navigate("/login");
        } 
        catch (err) {
            if(err.response?.data?.status === 'input error'){
                setErrors(err.response.data.message);
            }
            else {
                showToast(err.response?.data?.message || "Failed to reset password. Please try again.", "error");
                setErrors({});
            }
        }
    };


  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
      <Paper elevation={4} sx={{ padding: 4, width: 420 }}>
        <Box component="form" onSubmit={handleSubmit}>
            <Typography variant="h5" align="center" mb={2}>
                Reset Password
            </Typography>
            <TextField
            fullWidth
            label="New Password"
            variant="outlined"
            margin="normal"
            name="newPassword"
            type='password'
            error={!!errors.newPassword}
            helperText={errors.newPassword}
            onChange={handleChange}
            />
            <TextField
            fullWidth
            label="Confirm New Password"
            variant="outlined"
            margin="normal"
            name="confirmPassword"
            type='password'
            error={!!errors.newPassword}
            helperText={errors.newPassword}
            onChange={handleChange}
            />
            <Box textAlign="center" mt={2}>
                <Button type="submit" variant="contained" sx={{ mt: 2 }}>
                    Reset Password
                </Button>
            </Box>
        </Box>
      </Paper>
    </Box>
  )
}

export default ResetPassword