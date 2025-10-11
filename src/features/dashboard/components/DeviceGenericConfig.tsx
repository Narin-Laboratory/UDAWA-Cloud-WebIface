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
import type { DeviceInfo } from '@/features/dashboard/services/deviceService';
import { rpcV2, saveDeviceAttributes } from '@/features/dashboard/services/deviceService';

interface DeviceGenericConfigProps {
  device: DeviceInfo | null;
}

const DeviceGenericConfig: React.FC<DeviceGenericConfigProps> = ({ device }: DeviceGenericConfigProps) => {
  const { t } = useTranslation();
  const [wssid, setWssid] = useState('');
  const [wpass, setWpass] = useState('');
  const [showWpass, setShowWpass] = useState(false);
  const [provDK, setProvDK] = useState('');
  const [provDS, setProvDS] = useState('');
  const [showProvDS, setShowProvDS] = useState(false);
  const [hname, setHname] = useState('');
  const attrs: any = device?.attributesClientScope;

  const defaultWssid = attrs?.wssid?.[0]?.[1] || '';
  const defaultWpass = attrs?.wpass?.[0]?.[1] || '';
  const defaultProvDK = attrs?.provDK?.[0]?.[1] || '';
  const defaultProvDS = attrs?.provDS?.[0]?.[1] || '';
  const defaultHname = attrs?.hname?.[0]?.[1] || '';

  const handleSave = async () => {
    if (!device) return;

    const attributes: { [key: string]: string } = {};
    if (wssid && wssid !== defaultWssid) {
      attributes.wssid = wssid;
    }
    if (wpass && wpass !== defaultWpass) {
      attributes.wpass = wpass;
    }
    if (provDK && provDK !== defaultProvDK) {
      attributes.provDK = provDK;
    }
    if (provDS && provDS !== defaultProvDS) {
      attributes.provDS = provDS;
    }
    if (hname && hname !== defaultHname) {
      attributes.hname = hname;
    }

    if (Object.keys(attributes).length === 0) {
      toast.info(t('device.genericConfig.noChanges'));
      return;
    }

    try {
      await toast.promise(
        saveDeviceAttributes(
          device.id.entityType,
          device.id.id,
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
        rpcV2(device.id.id, "stateSave", {}),
        {
          pending: `${t('rpcv2.process')}: saveConfig`,
          success: `${t('rpcv2.success')}: saveConfig`,
          error: `${t('rpcv2.error')}: saveConfig`,
        },
      );

      await toast.promise(
        rpcV2(device.id.id, "syncAttribute", {}),
        {
          pending: `${t('rpcv2.process')}: syncAttribute`,
          success: `${t('rpcv2.success')}: syncAttribute`,
          error: `${t('rpcv2.error')}: syncAttribute`,
        },
      );

    } catch (error) {
      // Error is already handled by toast.promise
    }
  };

  const handleReset = () => {
    setWssid('');
    setWpass('');
    setProvDK('');
    setProvDS('');
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
          placeholder={defaultWssid}
          onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setWssid(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label={t('device.genericConfig.wifiPassword')}
          value={wpass}
          placeholder={defaultWpass}
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
          placeholder={defaultProvDK}
          onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setProvDK(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label={t('device.genericConfig.provDS')}
          type={showProvDS ? 'text' : 'password'}
          value={provDS}
          placeholder={defaultProvDS}
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
          label={t('device.genericConfig.hostName')}
          value={hname}
          placeholder={defaultHname}
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
};

export default DeviceGenericConfig;