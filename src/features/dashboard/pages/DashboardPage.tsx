import React from 'react';
import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

const DashboardPage: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div>
      <Typography variant="h4" gutterBottom>
        {t('dashboard.welcome')}
      </Typography>
      <Typography paragraph>
        {t('dashboard.placeholder')}
      </Typography>
    </div>
  );
};

export default DashboardPage;