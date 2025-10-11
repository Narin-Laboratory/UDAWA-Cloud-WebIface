import React from 'react';
import { Typography, Container } from '@mui/material';
import { useTranslation } from 'react-i18next';

const UserProfilePage: React.FC = () => {
  const { t } = useTranslation();
  return (
    <Container>
      <Typography variant="h4" sx={{ mt: 4, mb: 2 }}>
        {t('userProfile.title')}
      </Typography>
      <Typography>
        {t('userProfile.placeholder')}
      </Typography>
    </Container>
  );
};

export default UserProfilePage;