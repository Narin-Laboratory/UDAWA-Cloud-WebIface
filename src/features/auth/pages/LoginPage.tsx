import React, { useState } from 'react';
import {
  Button,
  TextField,
  Container,
  Typography,
  Box,
  Link,
  Alert,
  Grid,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { setItem } from '../../../utils/storage';

const LoginPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [server, setServer] = useState('prita.undiknas.ac.id');
  const [status, setStatus] = useState('');

  const handleLanguageChange = () => {
    const newLang = i18n.language === 'en' ? 'id' : 'en';
    i18n.changeLanguage(newLang);
  };

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
    <Grid container component="main" sx={{ height: '100vh' }}>
      <Grid item xs={12} sm={8} md={5}>
        <Container component="main" maxWidth="xs">
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
              <Button
                onClick={handleLanguageChange}
                data-testid="language-switcher"
              >
                {i18n.language === 'en' ? 'ID' : 'EN'}
              </Button>
            </Box>
            <Typography component="h1" variant="h5">
              {t('login.title')}
            </Typography>
            <Typography component="h2" variant="subtitle1">
              {t('login.subtitle')}
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label={t('login.email')}
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
                label={t('login.password')}
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
                label={t('login.server')}
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
                {t('login.signIn')}
              </Button>
              <Link href="https://prita.undiknas.ac.id/login/resetPasswordRequest" variant="body2">
                {t('login.forgotPassword')}
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
      </Grid>
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          display: { xs: 'none', sm: 'flex' },
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: (t) =>
            t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
        }}
      >
        <Box
          component="img"
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
          alt="A placeholder image"
          src="/login-placeholder.png"
        />
      </Grid>
    </Grid>
  );
};

export default LoginPage;