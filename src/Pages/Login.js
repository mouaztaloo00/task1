import React, { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Avatar,
  CssBaseline,
  Box,
  Grid,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useNavigate } from "react-router-dom";
import HttpsRoundedIcon from "@mui/icons-material/HttpsRounded";
import AlternateEmailRoundedIcon from "@mui/icons-material/AlternateEmailRounded";
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";
import axios from "axios";

const Login = () => {
  const url = `${process.env.REACT_APP_API_BASE_URL}/users/login`;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    setOpenSnackbar(false);

    if (!email || !password) {
      setError("Email and Password are required");
      setOpenSnackbar(true);
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(url, { email, password });

      if (response.data.message === "Login Successful") {
        localStorage.setItem('authToken', response.data.token || ''); 
        setSuccess("Login successful!");
        setOpenSnackbar(true);
        setTimeout(() => navigate("/home"), 2000); 
      } else {
        setError(response.data.message || "Invalid Email or Password");
        setOpenSnackbar(true);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Error occurred while logging in";
      setError(errorMessage);
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
    setError(""); 
    setSuccess("");
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1.4, bgcolor: "secondary.main", width: 56, height: 56 }}>
          <LockOutlinedIcon sx={{ fontSize: 32 }} />
        </Avatar>
        <Typography component="h1" variant="h5">
          Login
        </Typography>
        <form onSubmit={handleSubmit} style={{ width: "100%", marginTop: 1 }}>
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
              autoFocus
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
            <HttpsRoundedIcon sx={{ color: 'action.active', mr: 1, fontSize: 40, m: 1, my: 2 }} />
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
          <Button
            type="submit"
            endIcon={<LoginRoundedIcon />}
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Login
          </Button>
          <Grid container>
            <Grid item>
              <Button
                onClick={() => navigate("/sign-up")}
                variant="text"
                color="primary"
              >
                Don't have an account? Sign Up
              </Button>
            </Grid>
          </Grid>
        </form>

        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={success ? "success" : error ? "error" : "info"}
            sx={{ width: '100%' , borderRadius :'20px'}}
          >
            {success || error}
          </Alert>
        </Snackbar>
        {loading && (
          <CircularProgress sx={{ mt: 2 }} />
        )}
      </Box>
    </Container>
  );
};

export default Login;
