import React from 'react';
import { Typography, Container } from '@mui/material';

const UserProfilePage: React.FC = () => {
  return (
    <Container>
      <Typography variant="h4" sx={{ mt: 4, mb: 2 }}>
        User Profile
      </Typography>
      <Typography>
        This is a placeholder page for the user profile.
      </Typography>
    </Container>
  );
};

export default UserProfilePage;