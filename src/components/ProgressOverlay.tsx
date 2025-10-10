import React from 'react';
import {
  Modal,
  Backdrop,
  Fade,
  Box,
  Typography,
  CircularProgress,
  Button,
} from '@mui/material';

interface ProgressOverlayProps {
  open: boolean;
  message: string;
  showProgress?: boolean;
  showError?: boolean;
  onClose?: () => void;
}

const ProgressOverlay: React.FC<ProgressOverlayProps> = ({
  open,
  message,
  showProgress = false,
  showError = false,
  onClose,
}) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
            {message}
          </Typography>
          {showProgress && <CircularProgress sx={{ mb: 2 }} />}
          {showError && (
            <Button variant="contained" onClick={onClose}>
              OK
            </Button>
          )}
        </Box>
      </Fade>
    </Modal>
  );
};

export default ProgressOverlay;