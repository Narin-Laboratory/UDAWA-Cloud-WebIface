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

type AttributeValue = [number, string | number | boolean];

interface DeviceAttributes {
  [key: string]: AttributeValue[];
}
interface DeviceGenericConfigProps {
  attributes: DeviceAttributes | undefined;
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

  const defaultWssid = attributes?.wssid?.[0]?.[1] || '';
  const defaultWpass = attributes?.wpass?.[0]?.[1] || '';
  const defaultProvDK = attributes?.provDK?.[0]?.[1] || '';
  const defaultProvDS = attributes?.provDS?.[0]?.[1] || '';
  const defaultTbAddr = attributes?.tbAddr?.[0]?.[1] || '';
  const defaultTbPort = attributes?.tbPort?.[0]?.[1] || '';
  const defaultHname = attributes?.hname?.[0]?.[1] || '';

  const handleSave = async () => {
    if (!deviceId || !entityType) return;

    const attributes: { [key: string]: string } = {};
    if (wssid && wssid !== String(defaultWssid)) {
      attributes.wssid = wssid;
    }
    if (wpass && wpass !== String(defaultWpass)) {
      attributes.wpass = wpass;
    }
    if (provDK && provDK !== String(defaultProvDK)) {
      attributes.provDK = provDK;
    }
    if (provDS && provDS !== String(defaultProvDS)) {
      attributes.provDS = provDS;
    }
    if (tbAddr && tbAddr !== String(defaultTbAddr)) {
      attributes.tbAddr = tbAddr;
    }
    if (tbPort && tbPort !== String(defaultTbPort)) {
      attributes.tbPort = tbPort;
    }
    if (hname && hname !== String(defaultHname)) {
      attributes.hname = hname;
    }

    if (Object.keys(attributes).length === 0) {
      toast.info(t('device.genericConfig.noChanges'));
      return;
    }

    try {
      await toast.promise(
        saveDeviceAttributes(
          entityType,
          deviceId,
          'SHARED_SCOPE',
          attributes,
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
          onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setWssid(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label={t('device.genericConfig.wifiPassword')}
          value={wpass}
          placeholder={String(defaultWpass)}
          type={showWpass ? 'text' : 'password'}
          onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setWpass(e.target.value)}
          fullWidth
          margin="normal"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label={showWpass ? 'Hide password' : 'Show password'}
                  onClick={() => setShowWpass((s: boolean) => !s)}
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
          onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setProvDK(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label={t('device.genericConfig.provDS')}
          type={showProvDS ? 'text' : 'password'}
          value={provDS}
          placeholder={String(defaultProvDS)}
          onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setProvDS(e.target.value)}
          fullWidth
          margin="normal"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label={showProvDS ? 'Hide provisioning secret' : 'Show provisioning secret'}
                  onClick={() => setShowProvDS((s: boolean) => !s)}
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
          onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setTbAddr(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label={t('device.genericConfig.tbPort')}
          value={tbPort}
          placeholder={String(defaultTbPort)}
          onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setTbPort(e.target.value)}
          fullWidth
          margin="normal"
          type="number"
        />
        <TextField
          label={t('device.genericConfig.hostName')}
          value={hname}
          placeholder={String(defaultHname)}
          onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setHname(e.target.value)}
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