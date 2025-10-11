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
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import type { DeviceInfo } from '@/features/dashboard/services/deviceService';
import { rpcV2, saveDeviceAttributes } from '@/features/dashboard/services/deviceService';

interface RelaysControllerProps {
  device: DeviceInfo | null;
}

const RelaysController: React.FC<RelaysControllerProps> = ({ device }: RelaysControllerProps) => {
  const { t } = useTranslation();
  const [relays, setRelays] = useState('');
  const attrs: any = device?.attributesClientScope;

  const defaultRelays = attrs?.relays?.[0]?.[1] || '[]';

  const handleSave = async () => {
    if (!device) return;

    const attributes: { [key: string]: string } = {};
    if (relays && relays !== defaultRelays) {
      attributes.relays = relays;
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
    setRelays('');
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {t('device.genericConfig.title')}
        </Typography>

        <Box sx={{ display: 'flex', gap: 2 }}>
          {/* Left container: 50% */}
          <Box sx={{ flex: '1 1 50%', minWidth: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TextField
                fullWidth
                label="Relays"
                value={relays || defaultRelays}
                onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setRelays(e.target.value)}
                placeholder='[{"pin":1,"name":"R1"}]'
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Button size="small" variant="outlined">Adjust</Button>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          </Box>

          {/* Right container: 50% */}
          <Box sx={{ flex: '1 1 50%', minWidth: 0 }}>
            <Box sx={{ border: '1px dashed', borderColor: 'divider', borderRadius: 1, p: 2, height: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconButton aria-label="tips" size="small" disabled>
                  <LightbulbIcon fontSize="small" />
                </IconButton>
                <Typography variant="subtitle1">{t('device.dashboardTabs.control')}</Typography>
              </Box>

              <Typography variant="body2" sx={{ mt: 1 }}>
                Tips: Try editing the JSON for relay mapping here and press Save to apply.
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
          <Button variant="outlined" onClick={handleReset}>{t('device.genericConfig.reset')}</Button>
          <Button variant="contained" onClick={handleSave}>{t('device.genericConfig.save')}</Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default RelaysController;