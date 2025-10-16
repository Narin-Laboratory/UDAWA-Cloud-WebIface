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

interface ErrorData {
  response?: {
    data?: {
      message?: string;
    };
  };
}
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
      <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
        <Button
          onClick={handleLanguageChange}
          data-testid="language-switcher"
          sx={{ color: '#fff' }}
        >
          {i18n.language.startsWith('en') ? 'ID' : 'EN'}
        </Button>
      </Box>
      <Typography component="h1" variant="h5" align="center">
        {t('login.title')}
      </Typography>
      <Typography component="h2" variant="subtitle1" align="center" sx={{ color: '#666' }}>
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
          align="center"
          sx={{ display: 'block' }}
        >
          {t('login.forgotPassword')}
        </Link>
      </Box>
    </>
  );
};

export default LoginPage;