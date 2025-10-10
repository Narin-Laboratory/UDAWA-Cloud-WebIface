import React, { useState } from 'react';
import {
  Button,
  TextField,
  Container,
  Typography,
  Box,
  Link,
  Grid,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { setItem } from '../../../utils/storage';
import ProgressOverlay from '../../../components/ProgressOverlay';

const LoginPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [server, setServer] = useState('prita.undiknas.ac.id');
  const [overlayState, setOverlayState] = useState({
    open: false,
    message: '',
    showProgress: false,
    showError: false,
  });

  const handleLanguageChange = () => {
    const newLang = i18n.language.startsWith('en') ? 'id' : 'en';
    i18n.changeLanguage(newLang);
    localStorage.setItem('i18nextLng', newLang);
  };

  const closeOverlay = () => {
    setOverlayState({ ...overlayState, open: false });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setOverlayState({
      open: true,
      message: t('login.loggingIn'),
      showProgress: true,
      showError: false,
    });

    try {
      // 1. Authenticate and get tokens
      const loginResponse = await axios.post(
        `https://${server}/api/auth/login`,
        { username, password }
      );

      const { token, refreshToken } = loginResponse.data;
      setItem('token', token);
      setItem('refreshToken', refreshToken);

      // 2. Fetch user info
      setOverlayState({
        open: true,
        message: t('login.fetchingUser'),
        showProgress: true,
        showError: false,
      });

      const userResponse = await axios.get(`https://${server}/api/auth/user`, {
        headers: {
          'X-Authorization': `Bearer ${token}`,
        },
      });

      setItem('user', userResponse.data);

      // 3. Success and redirect
      setOverlayState({
        open: false,
        message: '',
        showProgress: false,
        showError: false,
      });

      navigate('/');

    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || t('login.unexpectedError');
      setOverlayState({
        open: true,
        message: `${t('login.failed')}: ${errorMessage}`,
        showProgress: false,
        showError: true,
      });
    }
  };

  return (
    <>
      <ProgressOverlay
        open={overlayState.open}
        message={overlayState.message}
        showProgress={overlayState.showProgress}
        showError={overlayState.showError}
        onClose={closeOverlay}
      />
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
              {i18n.language.startsWith('en') ? 'ID' : 'EN'}
            </Button>
          </Box>
          <Typography component="h1" variant="h5">
            {t('login.title')}
          </Typography>
          <Typography component="h2" variant="subtitle1">
            {t('login.subtitle')}
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
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
            <Link
              href="https://prita.undiknas.ac.id/login/resetPasswordRequest"
              variant="body2"
            >
              {t('login.forgotPassword')}
            </Link>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default LoginPage;