import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  Container,
  Avatar,
  Snackbar,
  Alert,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import AccountCircle from '@mui/icons-material/AccountCircle';
import AlternateEmailRoundedIcon from '@mui/icons-material/AlternateEmailRounded';
import HttpsRoundedIcon from '@mui/icons-material/HttpsRounded';
import LockResetRoundedIcon from '@mui/icons-material/LockResetRounded';
import VpnKeyRoundedIcon from '@mui/icons-material/VpnKeyRounded';


import axios from "axios";
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
//console.log(process.env.REACT_APP_API_BASE_URL)
const url = `${process.env.REACT_APP_API_BASE_URL}/users/signup`;
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const history = useNavigate();

  const validateForm = () => {
    if (!username || !email || !password || !confirmPassword) {
      return "All fields are required!";
    }
    if (password !== confirmPassword) {
      return "Passwords do not match!";
    }
    return "";
  };

  const handleSubmit = async (e) => {

    e.preventDefault();
    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      setSuccessMessage("");
      setOpenSnackbar(true);
      return;
    }

    const newUser = { username, email, password };

    try {
      const response = await axios.post( url , newUser);
      console.log(response); 
      if (response.status === 200) {
          localStorage.setItem('authToken', response.data.token);
          setSuccessMessage("Registration successful!");
          setError("");
          setOpenSnackbar(true);
          history("/Home");
      } else {
          console.error('Unexpected response:', response);
          setError("Unexpected response from server.");
          setOpenSnackbar(true);
      }
    } catch (err) {
      console.error("Error during signup:", err);
      setError(err.response?.data?.message || "Error in registration. Please try again.");
      setSuccessMessage("");
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
    setError(""); 
    setSuccessMessage("");
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: 4,
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign Up
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
           <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
              <AccountCircle sx={{ color: 'action.active', fontSize: 40 , m: 1, my: 2 }} />
                <TextField
                  margin="normal"
                  autoComplete="off"
                  required
                  fullWidth
                  label="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoFocus
                />
           </Box>
            <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
              <AlternateEmailRoundedIcon sx={{ color: 'action.active', fontSize: 40, m: 1, my: 2 }} />
                <TextField
                    margin="normal"
                    autoComplete="off"
                    required
                    fullWidth
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
              </Box>
                <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                  <HttpsRoundedIcon sx={{ color: 'action.active', mr: 1, fontSize: 40 , m: 1, my: 2 }} />
                    <TextField
                        margin="normal"
                        autoComplete="off"
                        required
                        fullWidth
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                  <LockResetRoundedIcon sx={{ color: 'action.active', mr: 1, fontSize: 40 , m: 1, my: 2 }} />
                    <TextField
                        margin="normal"
                        autoComplete="off"
                        required
                        fullWidth
                        label="Confirm Password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                </Box>
          
          <Button
            type="submit"
            fullWidth
            endIcon={<VpnKeyRoundedIcon />}
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up
          </Button>
          <Button
            onClick={() => history("/")}
            variant="text"
            color="primary"
          >
           i already have an account
          </Button>
        </Box>
      </Box>
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={successMessage ? "success" : error ? "error" : "info"} sx={{ width: '100%' }}>
          {successMessage || error}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default SignUp;