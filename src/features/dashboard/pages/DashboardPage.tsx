import React from 'react';
import { Typography } from '@mui/material';

const DashboardPage: React.FC = () => {
  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Welcome to the Dashboard
      </Typography>
      <Typography paragraph>
        This is a blank dashboard page. Content will be added here later.
      </Typography>
    </div>
  );
};

export default DashboardPage;