import React, { useState } from 'react';
import {
  Button,
  TextField,
  Container,
  Typography,
  Box,
  Link,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { setItem } from '../../../utils/storage';
import NeuralNetwork from '../../../components/NeuralNetwork';

interface ErrorData {
  response?: {
    data?: {
      message?: string;
    };
  };
}

const LoginPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [server, setServer] = useState('prita.undiknas.ac.id');

  const handleLanguageChange = () => {
    const newLang = i18n.language.startsWith('en') ? 'id' : 'en';
    i18n.changeLanguage(newLang);
    localStorage.setItem('i18nextLng', newLang);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const loginPromise = async () => {
      // 1. Authenticate and get tokens
      const loginResponse = await axios.post(
        `https://${server}/api/auth/login`,
        { username, password }
      );
      const { token, refreshToken } = loginResponse.data;
      setItem('token', token);
      setItem('refreshToken', refreshToken);

      // 2. Fetch user info
      const userResponse = await axios.get(`https://${server}/api/auth/user`, {
        headers: {
          'X-Authorization': `Bearer ${token}`,
        },
      });
      setItem('user', userResponse.data);
      setItem('server', server);
    };

    toast.promise(
      loginPromise(),
      {
        pending: t('login.loggingIn'),
        success: t('login.loginSuccess'),
        error: {
          render({ data }: { data: ErrorData }) {
            const errorMessage =
              data.response?.data?.message || t('login.unexpectedError');
            return `${t('login.failed')}: ${errorMessage}`;
          },
        },
      },
      {
        onClose: () => navigate('/'),
      }
    );
  };

  return (
    <>
      <NeuralNetwork />
      <Container
        component="main"
        maxWidth={false}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          width: '100vw',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            zIndex: 1,
          }}
        >
          <Button
            onClick={handleLanguageChange}
            data-testid="language-switcher"
            sx={{ color: 'text.primary' }}
          >
            {i18n.language.startsWith('en') ? 'ID' : 'EN'}
          </Button>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            p: 4,
            borderRadius: 2,
            bgcolor: (theme) =>
              theme.palette.mode === 'dark'
                ? 'rgba(0, 0, 0, 0.6)'
                : 'rgba(255, 255, 255, 0.6)',
            backdropFilter: 'blur(10px)',
            maxWidth: '400px',
            width: '100%',
          }}
        >
          <Typography component="h1" variant="h5">
            {t('login.title')}
          </Typography>
          <Typography component="h2" variant="subtitle1" sx={{ mb: 2 }}>
            {t('login.subtitle')}
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ width: '100%' }}
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
              data-testid="server-input"
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
              sx={{ color: 'text.primary' }}
            >
              {t('login.forgotPassword')}
            </Link>
          </Box>
        </Box>
      </Container>
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          backgroundColor: 'transparent',
          position: 'absolute',
          bottom: 0,
          width: '100%',
        }}
      >
        <Container maxWidth="sm">
          <Typography variant="body2" color="text.secondary" align="center">
            {t('footer.copyright', { year: 2025 })}
          </Typography>
        </Container>
      </Box>
    </>
  );
};

export default LoginPage;