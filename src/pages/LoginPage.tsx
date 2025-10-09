import React, { useState } from 'react';
import {
  Button,
  TextField,
  Container,
  Typography,
  Box,
  Link,
  Alert,
} from '@mui/material';
import { setItem } from '../utils/storage';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [server, setServer] = useState('prita.undiknas.ac.id');
  const [status, setStatus] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('Logging in...');

    try {
      const response = await fetch(`https://${server}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        setItem('token', data.token);
        setItem('refreshToken', data.refreshToken);
        setStatus('Success');
        // Handle successful login, e.g., save token, redirect
      } else {
        const errorData = await response.json();
        setStatus(`Failed: ${errorData.message || 'Unknown error'}`);
      }
    } catch {
      setStatus('Failed: An unexpected error occurred.');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          UDAWA Smart System
        </Typography>
        <Typography component="h2" variant="subtitle1">
          Cloud Web Interface
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="server"
            label="Server"
            id="server"
            value={server}
            onChange={(e) => setServer(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          <Link href="https://prita.undiknas.ac.id/login/resetPasswordRequest" variant="body2">
            Forgot password?
          </Link>
          {status && (
            <Alert
              severity={
                status === 'Success'
                  ? 'success'
                  : status.startsWith('Failed')
                  ? 'error'
                  : 'info'
              }
            >
              {status}
            </Alert>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default LoginPage;