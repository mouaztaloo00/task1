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
  Alert,
  CircularProgress
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
  const history = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    // Basic validation
    if (!email || !password) {
      setError("Email and Password are required");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(url, {
        params: { email, password }
      });

      if (response.data.length > 0) {
        localStorage.setItem('authToken', response.data.token);
        setSuccess("Login successful!");
        setTimeout(() => history("/Home"), 2000); // Redirect after 2 seconds
      } else {
        setError("Invalid Email or Password");
      }
    } catch (error) {
      setError("Error occurred while logging in");
    } finally {
      setLoading(false);
    }
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
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
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
                onClick={() => history("/sign-up")}
                variant="text"
                color="primary"
              >
                Don't have an account? Sign Up
              </Button>
              {error && (
          <Alert severity="error" sx={{ width: "100%", mt: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ width: "100%", mt: 2 }}>
            {success}
          </Alert>
        )}
        {loading && (
          <CircularProgress sx={{ mt: 2 }} />
        )}
            </Grid>
          </Grid>
        </form>
      </Box>
    </Container>
  );
};

export default Login;
