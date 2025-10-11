import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  IconButton,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Switch,
  FormControl,
  InputLabel,
  FormControlLabel,
  Divider,
  Stack,
} from '@mui/material';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import TuneIcon from '@mui/icons-material/Tune';
import type { SelectChangeEvent } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import type { DeviceInfo } from '@/features/dashboard/services/deviceService';
import { rpcV2, saveDeviceAttributes } from '@/features/dashboard/services/deviceService';

interface RelaysControllerProps {
  device: DeviceInfo | null;
}

const RelaysController: React.FC<RelaysControllerProps> = ({ device }: RelaysControllerProps) => {
  const { t } = useTranslation();
  // old `relays` string is replaced by `relayList` state below
  const attrs: any = device?.attributesClientScope;

  /*
  Example of parsed attrs?.relays?.[0]?.[1] value: 
  [{"pin":0,"mode":0,"wattage":0,"lastActive":118309,"lastChanged":6946,"dutyCycle":0,"dutyRange":2,"autoOff":10,"state":false,"label":"No label","overrunInSec":3600,"duration":0,"datetime":0,"timers":[{"h":0,"i":0,"s":0,"d":0},{"h":0,"i":0,"s":0,"d":0},{"h":0,"i":0,"s":0,"d":0},{"h":0,"i":0,"s":0,"d":0},{"h":0,"i":0,"s":0,"d":0},{"h":0,"i":0,"s":0,"d":0},{"h":0,"i":0,"s":0,"d":0},{"h":0,"i":0,"s":0,"d":0},{"h":0,"i":0,"s":0,"d":0},{"h":0,"i":0,"s":0,"d":0}]},{"pin":1,"mode":0,"wattage":0,"lastActive":0,"lastChanged":6957,"dutyCycle":0,"dutyRange":2,"autoOff":0,"state":false,"label":"No label","overrunInSec":3600,"duration":0,"datetime":0,"timers":[{"h":0,"i":0,"s":0,"d":0},{"h":0,"i":0,"s":0,"d":0},{"h":0,"i":0,"s":0,"d":0},{"h":0,"i":0,"s":0,"d":0},{"h":0,"i":0,"s":0,"d":0},{"h":0,"i":0,"s":0,"d":0},{"h":0,"i":0,"s":0,"d":0},{"h":0,"i":0,"s":0,"d":0},{"h":0,"i":0,"s":0,"d":0},{"h":0,"i":0,"s":0,"d":0}]},{"pin":2,"mode":0,"wattage":0,"lastActive":0,"lastChanged":6979,"dutyCycle":0,"dutyRange":2,"autoOff":0,"state":false,"label":"No label","overrunInSec":3600,"duration":0,"datetime":0,"timers":[{"h":0,"i":0,"s":0,"d":0},{"h":0,"i":0,"s":0,"d":0},{"h":0,"i":0,"s":0,"d":0},{"h":0,"i":0,"s":0,"d":0},{"h":0,"i":0,"s":0,"d":0},{"h":0,"i":0,"s":0,"d":0},{"h":0,"i":0,"s":0,"d":0},{"h":0,"i":0,"s":0,"d":0},{"h":0,"i":0,"s":0,"d":0},{"h":0,"i":0,"s":0,"d":0}]},{"pin":3,"mode":0,"wattage":0,"lastActive":0,"lastChanged":6991,"dutyCycle":0,"dutyRange":2,"autoOff":0,"state":false,"label":"No label","overrunInSec":3600,"duration":0,"datetime":0,"timers":[{"h":0,"i":0,"s":0,"d":0},{"h":0,"i":0,"s":0,"d":0},{"h":0,"i":0,"s":0,"d":0},{"h":0,"i":0,"s":0,"d":0},{"h":0,"i":0,"s":0,"d":0},{"h":0,"i":0,"s":0,"d":0},{"h":0,"i":0,"s":0,"d":0},{"h":0,"i":0,"s":0,"d":0},{"h":0,"i":0,"s":0,"d":0},{"h":0,"i":0,"s":0,"d":0}]}]
  */
  const defaultRelays = attrs?.relays?.[0]?.[1] || '[]';

  // Ported RelaySelector state and helpers
  const sampleRelay = {
    pin: 0,
    mode: 0,
    wattage: 0,
    lastActive: 0,
    dutyCycle: 0,
    dutyRange: 0,
    autoOff: 0,
    state: false,
    label: 'No label',
    overrunInSec: 0,
    timers: [{}],
    datetime: 0,
    duration: 0,
  };

  const parseRelays = (input: any) => {
    try {
      if (typeof input === 'string') return JSON.parse(input);
      return input;
    } catch (e) {
      return [sampleRelay];
    }
  };

  const [relayList, setRelayList] = useState<any[]>(() => parseRelays(defaultRelays) || [sampleRelay]);
  const [availableRelayMode, setAvailableRelayMode] = useState<string[]>(['Manual']);
  const [selectedRelayIndex, setSelectedRelayIndex] = useState<number>(0);
  const [isRelayAdjustModalVisible, setIsRelayAdjustModalVisible] = useState<boolean>(false);
  const [disableSubmitButton, setDisableSubmitButton] = useState<boolean>(true);

  // form state for dialog
  const [adjustForm, setAdjustForm] = useState<any>({});

  useEffect(() => {
    // seed adjust form when selected relay or dialog opens
    if (isRelayAdjustModalVisible) {
      setAdjustForm({ ...relayList[selectedRelayIndex] });
    }
  }, [isRelayAdjustModalVisible, selectedRelayIndex, relayList]);

  useEffect(() => {
    // initialize relay list when device attrs change
    const parsed = parseRelays(defaultRelays);
    if (Array.isArray(parsed)) setRelayList(parsed);
  }, [defaultRelays]);

  const handleSave = async () => {
    if (!device) return;

    const attributes: any = {};
    const parsedDefault = parseRelays(defaultRelays);
    // Only set attribute when there is a difference between current list and default
    if (JSON.stringify(relayList) !== JSON.stringify(parsedDefault)) {
      // Pass the array (fully formatted relays object) as required
      attributes.relays = relayList;
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
        rpcV2(device.id.id, 'stateSave', {}),
        {
          pending: `${t('rpcv2.process')}: saveConfig`,
          success: `${t('rpcv2.success')}: saveConfig`,
          error: `${t('rpcv2.error')}: saveConfig`,
        },
      );

      await toast.promise(
        rpcV2(device.id.id, 'syncAttribute', {}),
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
    setRelayList(parseRelays(defaultRelays));
    setDisableSubmitButton(true);
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
            {/* Relay selector UI ported from Embedded WebIface */}
            <Box>
              <Box className="parent-4c font-small" sx={{ display: 'flex', gap: 1 }}>
                {relayList.map((relay: any, index: number) => (
                  <Box key={index} sx={{ textAlign: 'center' }}>
                    <Box className={relay.state ? 'relay-number text-center relay-on' : 'relay-number text-center relay-off'}>
                      <div>{`${index + 1}`}</div>
                      <div className={"super-small"}><strong>{t(relay.state ? 'relay_state_on' : 'relay_state_off')}</strong></div>
                    </Box>
                    <div className="text-center">{relay.mode === 0 ? t('relay_mode_manual') : t('relay_mode_auto')}</div>
                  </Box>
                ))}
              </Box>

              <Divider sx={{ my: 1 }} />
              <FormControl fullWidth variant="outlined" size="small" sx={{ mb: 1 }}>
                <InputLabel id="relay-select-label">{t('select_relay_to_control')}</InputLabel>
                <Select
                  labelId="relay-select-label"
                  id="relay-select"
                  value={selectedRelayIndex}
                  label={t('select_relay_to_control') as string}
                  onChange={(e: SelectChangeEvent<any>) => setSelectedRelayIndex(Number(e.target.value))}
                >
                  {relayList.map((relay: any, index: number) => (
                    <MenuItem key={relay.pin} value={index}>
                      {`Relay ${relay.pin + 1} - ${relay.label === 'No label' ? t('relay_label_no_label') : relay.label}`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Stack direction="row" spacing={1} alignItems="center">
                <Button startIcon={<TuneIcon />} variant="outlined" size="small" onClick={() => setIsRelayAdjustModalVisible(true)}>
                  {t('relay_adjust_button')}
                </Button>
              </Stack>

              <Box>
                <FormControlLabel
                  control={
                    <Switch
                      checked={relayList[selectedRelayIndex]?.state || false}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
                        const newState = checked;
                        const selectedRelay = relayList[selectedRelayIndex];
                        if (!selectedRelay) return;
                        const updated = [...relayList];
                        updated[selectedRelayIndex] = { ...selectedRelay, state: newState };
                        setRelayList(updated);
                        const payload = { setRelayState: { pin: selectedRelay.pin, state: newState } };
                        if (device) rpcV2(device.id.id, 'setRelayState', payload);
                      }}
                      disabled={relayList[selectedRelayIndex]?.mode !== 0}
                    />
                  }
                  label={t('relay_status', { status: relayList[selectedRelayIndex]?.state ? t('relay_state_on') : t('relay_state_off') })}
                />
                <Box>
                  <Typography variant="body2" dangerouslySetInnerHTML={{ __html: t('relay_operated_by', { mode: availableRelayMode[relayList[selectedRelayIndex]?.mode] || availableRelayMode[0] }) }} />
                </Box>
              </Box>

              <Dialog open={isRelayAdjustModalVisible} onClose={() => setIsRelayAdjustModalVisible(false)} fullWidth maxWidth="sm">
                <DialogTitle>{t('adjust_relay_title', { index: selectedRelayIndex + 1, label: relayList[selectedRelayIndex]?.label })}</DialogTitle>
                <DialogContent>
                  <Stack spacing={2} sx={{ mt: 1 }}>
                    <TextField
                      label={t('relay_label_label') as string}
                      name="label"
                      value={adjustForm?.label || ''}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAdjustForm({ ...adjustForm, label: e.target.value })}
                      fullWidth
                      size="small"
                    />
                    <TextField
                      label={t('overrun_threshold_label') as string}
                      name="overrunInSec"
                      type="number"
                      value={adjustForm?.overrunInSec ?? ''}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAdjustForm({ ...adjustForm, overrunInSec: Number(e.target.value) })}
                      fullWidth
                      size="small"
                    />
                    <TextField
                      label={t('wattage_label') as string}
                      name="wattage"
                      type="number"
                      value={adjustForm?.wattage ?? ''}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAdjustForm({ ...adjustForm, wattage: Number(e.target.value) })}
                      fullWidth
                      size="small"
                    />
                    <TextField
                      label={t('duration_label') as string}
                      name="duration"
                      type="number"
                      value={adjustForm?.duration ?? ''}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAdjustForm({ ...adjustForm, duration: Number(e.target.value) })}
                      fullWidth
                      size="small"
                    />
                  </Stack>
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setIsRelayAdjustModalVisible(false)}>{t('cancel') || 'Cancel'}</Button>
                  <Button onClick={async () => {
                    // apply form values into relayList
                    const updated = [...relayList];
                    updated[selectedRelayIndex] = { ...updated[selectedRelayIndex], ...adjustForm };
                    setRelayList(updated);
                    setDisableSubmitButton(true);
                    // persist immediately per requirement
                    if (device) {
                      try {
                        await toast.promise(
                          saveDeviceAttributes(device.id.entityType, device.id.id, 'SHARED_SCOPE', { relays: updated }),
                          {
                            pending: t('device.genericConfig.saving'),
                            success: t('device.genericConfig.saveSuccess'),
                            error: t('device.genericConfig.saveError'),
                          },
                        );

                        await toast.promise(
                          rpcV2(device.id.id, 'stateSave', {}),
                          {
                            pending: `${t('rpcv2.process')}: saveConfig`,
                            success: `${t('rpcv2.success')}: saveConfig`,
                            error: `${t('rpcv2.error')}: saveConfig`,
                          },
                        );

                        await toast.promise(
                          rpcV2(device.id.id, 'syncAttribute', {}),
                          {
                            pending: `${t('rpcv2.process')}: syncAttribute`,
                            success: `${t('rpcv2.success')}: syncAttribute`,
                            error: `${t('rpcv2.error')}: syncAttribute`,
                          },
                        );
                      } catch (err) {
                        // handled by toast
                      }
                    }
                    setIsRelayAdjustModalVisible(false);
                  }} variant="contained">{t('device.genericConfig.save')}</Button>
                </DialogActions>
              </Dialog>
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