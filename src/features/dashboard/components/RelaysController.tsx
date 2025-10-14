import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
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
  Slider,
} from '@mui/material';
import TuneIcon from '@mui/icons-material/Tune';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { rpcV2, saveDeviceAttributes } from '@/features/dashboard/services/deviceService';

interface RelaysControllerProps {
  attributes: {
    [key: string]: [number, unknown][];
  } | undefined;
  deviceId: string | undefined;
  entityType: string | undefined;
}

interface Timer {
  h: number;
  i: number;
  s: number;
  d: number;
}

interface Relay {
  pin: number;
  mode: number;
  wattage: number;
  lastActive: number;
  dutyCycle: number;
  dutyRange: number;
  autoOff: number;
  state: boolean;
  label: string;
  overrunInSec: number;
  timers: Timer[];
  datetime: number;
  duration: number;
}

const RelaysController: React.FC<RelaysControllerProps> = React.memo(({ attributes, deviceId, entityType }) => {
  const { t } = useTranslation();
  const attrs = attributes;

  const defaultRelays = attrs?.relays?.[0]?.[1] || '[]';

  const parseRelays = (input: string | Relay[] | {}): Relay[] => {
    try {
        const parsed = typeof input === 'string' ? JSON.parse(input) : input;
        if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
        }
    } catch {
        // ignore error
    }
    return [{
        pin: 0, mode: 0, wattage: 0, lastActive: 0, dutyCycle: 0, dutyRange: 0,
        autoOff: 0, state: false, label: 'No label', overrunInSec: 0,
        timers: Array(10).fill({ h: 0, i: 0, s: 0, d: 0 }),
        datetime: 0, duration: 0
    }];
  };

  const [relays, setRelays] = useState<Relay[]>(() => parseRelays(defaultRelays));
  const [availableRelayMode] = useState<string[]>(['Manual', 'Auto', 'Timer', 'Schedule']);
  const [selectedRelayIndex, setSelectedRelayIndex] = useState<number>(0);
  const [isRelayAdjustModalVisible, setIsRelayAdjustModalVisible] = useState<boolean>(false);
  const [disableSubmitButton, setDisableSubmitButton] = useState<boolean>(true);
  const [adjustForm, setAdjustForm] = useState<Partial<Relay>>({});

  useEffect(() => {
    const parsed = parseRelays(defaultRelays);
    setRelays(parsed);
  }, [defaultRelays]);


  useEffect(() => {
    if (isRelayAdjustModalVisible) {
      setAdjustForm({ ...relays[selectedRelayIndex] });
    }
  }, [isRelayAdjustModalVisible, selectedRelayIndex, relays]);

  const handleToggleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newState = event.target.checked;
    const selectedRelay = relays[selectedRelayIndex];

    const updatedRelays = [...relays];
    updatedRelays[selectedRelayIndex].state = newState;
    setRelays(updatedRelays);

    if (deviceId) {
      const params = {
        pin: selectedRelay.pin,
        state: newState,
      };
      rpcV2(deviceId, 'setRelayState', params);
    }
  };

  const handleRelayAdjustFormChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = event.target;
    let processedValue: string | number = value;

    if (type === 'number') {
      processedValue = parseInt(value, 10);
      if (isNaN(processedValue)) {
        processedValue = 0;
      }
    } else if (name === 'datetime') {
      processedValue = new Date(value).getTime() / 1000;
    }

    setAdjustForm(prev => ({...prev, [name]: processedValue}));
    setDisableSubmitButton(false);
  };

  const handleTimerChange = (index: number, event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target as HTMLInputElement;
    const updatedTimers = [...(adjustForm.timers || [])];
    updatedTimers[index] = {
      ...updatedTimers[index],
      [name]: parseInt(value)
    };

    setAdjustForm(prev => ({...prev, timers: updatedTimers}));
    setDisableSubmitButton(false);
  };



  const handleRelayAdjustFormSubmit = async () => {
    if (!deviceId || !entityType) return;

    const updatedRelays = [...relays];
    updatedRelays[selectedRelayIndex] = { ...updatedRelays[selectedRelayIndex], ...adjustForm };
    setRelays(updatedRelays);
    setDisableSubmitButton(true);

    toast.promise(
      saveDeviceAttributes(entityType, deviceId, 'CLIENT_SCOPE', { relays: updatedRelays }),
      {
        pending: t('device.genericConfig.saving'),
        success: t('device.genericConfig.saveSuccess'),
        error: t('device.genericConfig.saveError'),
      },
    );
    setIsRelayAdjustModalVisible(false);
  };


  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {t('relays_controller')}
        </Typography>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            {relays.map((relay, index) => (
                <Box key={index} sx={{ flex: '1 1 100px', minWidth: '100px' }}>
                    <Card sx={{
                        textAlign: 'center',
                        borderColor: relay.state ? 'success.main' : 'error.main',
                        borderWidth: 1,
                        borderStyle: 'solid',
                        bgcolor: relay.state ? 'success.light' : 'error.light'
                    }}>
                        <CardContent>
                            <Typography variant="h6">{`${index + 1}`}</Typography>
                            <Typography variant="caption"><strong>{t(relay.state ? 'relay_state_on' : 'relay_state_off')}</strong></Typography>
                        </CardContent>
                    </Card>
                    <Typography variant="body2" sx={{ textAlign: 'center' }}>{relay.mode === 0 ? t('relay_mode_manual') : t('relay_mode_auto')}</Typography>
                </Box>
            ))}
        </Box>

        <Divider sx={{ my: 2 }} />

        <Stack direction="row" spacing={1} alignItems="center">
            <FormControl fullWidth variant="outlined" size="small">
                <InputLabel id="relay-select-label">{t('select_relay_to_control')}</InputLabel>
                <Select
                  labelId="relay-select-label"
                  value={selectedRelayIndex}
                  label={t('select_relay_to_control') as string}
                  onChange={(e) => setSelectedRelayIndex(Number(e.target.value))}
                >
                  {relays.map((relay, index) => (
                    <MenuItem key={relay.pin} value={index}>
                      {`Relay ${relay.pin + 1} - ${relay.label === 'No label' ? t('relay_label_no_label') : relay.label}`}
                    </MenuItem>
                  ))}
                </Select>
            </FormControl>
            <Button startIcon={<TuneIcon />} variant="outlined" size="small" onClick={() => setIsRelayAdjustModalVisible(true)}>
                {t('relay_adjust_button')}
            </Button>
        </Stack>

        <Divider sx={{ my: 2 }} />

        <Box>
            <FormControlLabel
              control={
                <Switch
                  checked={relays[selectedRelayIndex]?.state || false}
                  onChange={handleToggleSwitchChange}
                  disabled={relays[selectedRelayIndex]?.mode !== 0}
                />
              }
              label={t('relay_status', { status: relays[selectedRelayIndex]?.state ? t('relay_state_on') : t('relay_state_off') })}
            />
            <Box>
              <Typography variant="body2" dangerouslySetInnerHTML={{ __html: t('relay_operated_by', { mode: availableRelayMode[relays[selectedRelayIndex]?.mode] || availableRelayMode[0] }) }} />
                {relays[selectedRelayIndex]?.mode === 0 && relays[selectedRelayIndex]?.autoOff > 0 && (
                    <Typography variant="body2" dangerouslySetInnerHTML={{ __html: t('relay_auto_off', { seconds: relays[selectedRelayIndex].autoOff }) }} />
                )}
                {relays[selectedRelayIndex]?.mode === 1 && (
                    <Typography variant="body2" dangerouslySetInnerHTML={{ __html: t('relay_duty_cycle', { dutyCycle: relays[selectedRelayIndex].dutyCycle, seconds: relays[selectedRelayIndex].dutyRange }) }} />
                )}
                {relays[selectedRelayIndex]?.mode === 2 && (
                    relays[selectedRelayIndex].timers.map((timer, index) => (
                    timer.d > 0 && (
                        <Typography key={index} variant="body2" dangerouslySetInnerHTML={{ __html: t('relay_timer_operation', { index: index + 1, h: timer.h, i: timer.i, s: timer.s, d: timer.d }) }} />
                    )
                    ))
                )}
                {relays[selectedRelayIndex]?.mode === 3 && (
                    <Typography variant="body2" dangerouslySetInnerHTML={{ __html: t('relay_specific_datetime', { datetime: relays[selectedRelayIndex].datetime ? new Date(relays[selectedRelayIndex].datetime * 1000).toISOString().slice(0, 16) : '', duration: relays[selectedRelayIndex].duration }) }} />
                )}
            </Box>
        </Box>

        <Dialog open={isRelayAdjustModalVisible} onClose={() => setIsRelayAdjustModalVisible(false)} fullWidth maxWidth="sm">
          <DialogTitle>{t('adjust_relay_title', { index: selectedRelayIndex + 1, label: relays[selectedRelayIndex]?.label })}</DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
                <TextField
                  label={t('relay_label_label')}
                  name="label"
                  value={adjustForm.label || ''}
                  onChange={handleRelayAdjustFormChange}
                  fullWidth
                  size="small"
                  helperText={t('relay_label_helper', { index: selectedRelayIndex + 1 })}
                />
                <TextField
                  label={t('overrun_threshold_label')}
                  name="overrunInSec"
                  type="number"
                  value={adjustForm.overrunInSec || ''}
                  onChange={handleRelayAdjustFormChange}
                  fullWidth
                  size="small"
                  helperText={t('overrun_threshold_helper')}
                />
                <TextField
                  label={t('wattage_label')}
                  name="wattage"
                  type="number"
                  value={adjustForm.wattage || ''}
                  onChange={handleRelayAdjustFormChange}
                  fullWidth
                  size="small"
                  helperText={t('wattage_helper')}
                />
                <FormControl fullWidth size="small">
                    <InputLabel>{t('select_relay_mode')}</InputLabel>
                    <Select
                        name="mode"
                        value={adjustForm.mode ?? 0}
                        onChange={(e) => {
                            setAdjustForm(prev => ({...prev, mode: Number(e.target.value)}));
                            setDisableSubmitButton(false);
                        }}
                        label={t('select_relay_mode')}
                    >
                        {availableRelayMode.map((mode, index) => (
                            <MenuItem key={index} value={index}>{mode}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {adjustForm.mode === 0 && (
                    <TextField
                      label={t('auto_off_label')}
                      name="autoOff"
                      type="number"
                      value={adjustForm.autoOff || ''}
                      onChange={handleRelayAdjustFormChange}
                      fullWidth
                      size="small"
                      helperText={t('auto_off_helper')}
                    />
                )}

                {adjustForm.mode === 1 && (
                    <Stack spacing={2}>
                        <Typography gutterBottom>{t('duty_cycle_label', { dutyCycle: adjustForm.dutyCycle })}</Typography>
                        <Slider
                            name="dutyCycle"
                            value={adjustForm.dutyCycle || 0}
                            onChange={(_event, value) => {
                                setAdjustForm(prev => ({...prev, dutyCycle: value as number}));
                                setDisableSubmitButton(false);
                            }}
                            valueLabelDisplay="auto"
                            step={1}
                            marks
                            min={0}
                            max={100}
                        />
                        <TextField
                          label={t('duty_range_label')}
                          name="dutyRange"
                          type="number"
                          value={adjustForm.dutyRange || ''}
                          onChange={handleRelayAdjustFormChange}
                          fullWidth
                          size="small"
                          helperText={t('duty_range_helper')}
                        />
                    </Stack>
                )}

                {adjustForm.mode === 2 && (
                    <Stack spacing={2}>
                        <Typography>{t('timer_configuration_label')}</Typography>
                        <Typography variant="caption">{t('timer_configuration_helper')}</Typography>
                        {(adjustForm.timers || []).map((timer, index) => (
                            <Stack direction="row" spacing={1} key={index}>
                                <TextField name="h" type="number" value={timer.h} placeholder={t('hour_placeholder')} onChange={(e) => handleTimerChange(index, e)} size="small"/>
                                <TextField name="i" type="number" value={timer.i} placeholder={t('minute_placeholder')} onChange={(e) => handleTimerChange(index, e)} size="small"/>
                                <TextField name="s" type="number" value={timer.s} placeholder={t('second_placeholder')} onChange={(e) => handleTimerChange(index, e)} size="small"/>
                                <TextField name="d" type="number" value={timer.d} placeholder={t('duration_placeholder')} onChange={(e) => handleTimerChange(index, e)} size="small"/>
                            </Stack>
                        ))}
                    </Stack>
                )}

                {adjustForm.mode === 3 && (
                    <Stack spacing={2}>
                        <TextField
                            type="datetime-local"
                            name="datetime"
                            value={adjustForm.datetime ? new Date(adjustForm.datetime * 1000).toISOString().slice(0, 16) : ''}
                            onChange={handleRelayAdjustFormChange}
                            fullWidth
                            size="small"
                            helperText={t('datetime_helper')}
                        />
                        <TextField
                          label={t('duration_label')}
                          name="duration"
                          type="number"
                          value={adjustForm.duration || ''}
                          onChange={handleRelayAdjustFormChange}
                          fullWidth
                          size="small"
                          helperText={t('duration_helper')}
                        />
                    </Stack>
                )}
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsRelayAdjustModalVisible(false)}>{t('cancel')}</Button>
            <Button onClick={handleRelayAdjustFormSubmit} variant="contained" disabled={disableSubmitButton}>
              {t('save_button')}
            </Button>
          </DialogActions>
        </Dialog>

      </CardContent>
    </Card>
  );
});

export default RelaysController;