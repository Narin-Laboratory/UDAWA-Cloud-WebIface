import React, { useState } from 'react';
import {
  Card,
  CardContent,
  TextField,
  Typography,
  Button,
  Box,
  IconButton,
  InputAdornment,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { rpcV2, saveDeviceAttributes } from '@/features/dashboard/services/deviceService';
import type { DynamicObject } from '@/features/dashboard/services/deviceService'; // Import the shared type

// --- UPDATED PROPS INTERFACE ---
// The 'attributes' prop now uses the simple DynamicObject type.
interface DeviceGenericConfigProps {
  attributes: DynamicObject | undefined;
  deviceId: string | undefined;
  entityType: string | undefined;
}

const DeviceGenericConfig: React.FC<DeviceGenericConfigProps> = React.memo(({ attributes, deviceId, entityType }) => {
  const { t } = useTranslation();
  const [wssid, setWssid] = useState('');
  const [wpass, setWpass] = useState('');
  const [showWpass, setShowWpass] = useState(false);
  const [provDK, setProvDK] = useState('');
  const [provDS, setProvDS] = useState('');
  const [showProvDS, setShowProvDS] = useState(false);
  const [tbAddr, setTbAddr] = useState('');
  const [tbPort, setTbPort] = useState('');
  const [hname, setHname] = useState('');

  // --- SIMPLIFIED DATA ACCESS ---
  // We now access properties directly. The `|| ''` handles cases where the attribute might be null or undefined.
  const defaultWssid = attributes?.wssid || '';
  const defaultWpass = attributes?.wpass || '';
  const defaultProvDK = attributes?.provDK || '';
  const defaultProvDS = attributes?.provDS || '';
  const defaultTbAddr = attributes?.tbAddr || '';
  const defaultTbPort = attributes?.tbPort || '';
  const defaultHname = attributes?.hname || '';

  const handleSave = async () => {
    if (!deviceId || !entityType) return;

    const attributesToSave: { [key: string]: string } = {};
    if (wssid && wssid !== defaultWssid) {
      attributesToSave.wssid = wssid;
    }
    if (wpass && wpass !== defaultWpass) {
      attributesToSave.wpass = wpass;
    }
    if (provDK && provDK !== defaultProvDK) {
      attributesToSave.provDK = provDK;
    }
    if (provDS && provDS !== defaultProvDS) {
      attributesToSave.provDS = provDS;
    }
    if (tbAddr && tbAddr !== defaultTbAddr) {
      attributesToSave.tbAddr = tbAddr;
    }
    if (tbPort && tbPort !== defaultTbPort) {
      attributesToSave.tbPort = tbPort;
    }
    if (hname && hname !== defaultHname) {
      attributesToSave.hname = hname;
    }

    if (Object.keys(attributesToSave).length === 0) {
      toast.info(t('device.genericConfig.noChanges'));
      return;
    }

    try {
      await toast.promise(
        saveDeviceAttributes(
          entityType,
          deviceId,
          'SHARED_SCOPE',
          attributesToSave,
        ),
        {
          pending: t('device.genericConfig.saving'),
          success: t('device.genericConfig.saveSuccess'),
          error: t('device.genericConfig.saveError'),
        },
      );

      await toast.promise(
        rpcV2(deviceId, "stateSave", {}),
        {
          pending: `${t('rpcv2.process')}: saveConfig`,
          success: `${t('rpcv2.success')}: saveConfig`,
          error: `${t('rpcv2.error')}: saveConfig`,
        },
      );

      await toast.promise(
        rpcV2(deviceId, "syncAttribute", {}),
        {
          pending: `${t('rpcv2.process')}: syncAttribute`,
          success: `${t('rpcv2.success')}: syncAttribute`,
          error: `${t('rpcv2.error')}: syncAttribute`,
        },
      );

    } catch {
      // Error is already handled by toast.promise
    }
  };

  const handleReset = () => {
    setWssid('');
    setWpass('');
    setProvDK('');
    setProvDS('');
    setTbAddr('');
    setTbPort('');
    setHname('');
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {t('device.genericConfig.title')}
        </Typography>
        <TextField
          label={t('device.genericConfig.wifiSSID')}
          value={wssid}
          placeholder={String(defaultWssid)}
          onChange={(e) => setWssid(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label={t('device.genericConfig.wifiPassword')}
          value={wpass}
          placeholder={String(defaultWpass)}
          type={showWpass ? 'text' : 'password'}
          onChange={(e) => setWpass(e.target.value)}
          fullWidth
          margin="normal"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label={showWpass ? 'Hide password' : 'Show password'}
                  onClick={() => setShowWpass(!showWpass)}
                  edge="end"
                >
                  {showWpass ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <TextField
          label={t('device.genericConfig.provDK')}
          value={provDK}
          placeholder={String(defaultProvDK)}
          onChange={(e) => setProvDK(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label={t('device.genericConfig.provDS')}
          type={showProvDS ? 'text' : 'password'}
          value={provDS}
          placeholder={String(defaultProvDS)}
          onChange={(e) => setProvDS(e.target.value)}
          fullWidth
          margin="normal"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label={showProvDS ? 'Hide provisioning secret' : 'Show provisioning secret'}
                  onClick={() => setShowProvDS(!showProvDS)}
                  edge="end"
                >
                  {showProvDS ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <TextField
          label={t('device.genericConfig.tbAddr')}
          value={tbAddr}
          placeholder={String(defaultTbAddr)}
          onChange={(e) => setTbAddr(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label={t('device.genericConfig.tbPort')}
          value={tbPort}
          placeholder={String(defaultTbPort)}
          onChange={(e) => setTbPort(e.target.value)}
          fullWidth
          margin="normal"
          type="number"
        />
        <TextField
          label={t('device.genericConfig.hostName')}
          value={hname}
          placeholder={String(defaultHname)}
          onChange={(e) => setHname(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button onClick={handleReset} sx={{ mr: 1 }}>
            {t('device.genericConfig.reset')}
          </Button>
          <Button onClick={handleSave} variant="contained">
            {t('device.genericConfig.save')}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
});

export default DeviceGenericConfig;