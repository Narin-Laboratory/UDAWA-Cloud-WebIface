import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Menu, MenuItem } from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';

const LanguageSwitcher: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleLanguageMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLanguageMenuClose = () => {
    setAnchorEl(null);
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    handleLanguageMenuClose();
  };

  return (
    <div>
      <Button
        color="inherit"
        startIcon={<LanguageIcon />}
        onClick={handleLanguageMenuOpen}
      >
        {i18n.language.toUpperCase()}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleLanguageMenuClose}
      >
        <MenuItem onClick={() => changeLanguage('en')}>{t('header.english')}</MenuItem>
        <MenuItem onClick={() => changeLanguage('id')}>{t('header.indonesia')}</MenuItem>
      </Menu>
    </div>
  );
};

export default LanguageSwitcher;