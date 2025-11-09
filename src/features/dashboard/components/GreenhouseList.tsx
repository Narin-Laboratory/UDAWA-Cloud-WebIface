import React, {
  useState,
  useEffect,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from 'react';
import {
  List,
  ListItem,
  ListItemText,
  Collapse,
  Typography,
  ListItemButton,
  IconButton,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { getGreenhouses } from '../services/deviceService';
import type { Asset } from '../services/deviceService';
import DeviceList from './DeviceList';

export interface GreenhouseListHandle {
  reload: () => void;
}

const GreenhouseList = forwardRef<GreenhouseListHandle, {}>((_props, ref) => {
  const [greenhouses, setGreenhouses] = useState<Asset[]>([]);
  const [openGreenhouse, setOpenGreenhouse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchGreenhouses = useCallback(async (force = false) => {
    try {
      setError(null);
      const greenhouseList = await getGreenhouses(force);
      setGreenhouses(greenhouseList);
      toast.success('Greenhouse list loaded successfully');
    } catch (e) {
      setError('Failed to fetch greenhouses');
    }
  }, []);

  useEffect(() => {
    fetchGreenhouses();
  }, [fetchGreenhouses]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  useImperativeHandle(ref, () => ({
    reload: () => {
      fetchGreenhouses(true);
    },
  }));

  const handleClick = (greenhouseId: string) => {
    if (openGreenhouse === greenhouseId) {
      setOpenGreenhouse(null);
    } else {
      setOpenGreenhouse(greenhouseId);
    }
  };

  if (error) {
    return (
      <ListItem>
        <Typography color="error">{error}</Typography>
      </ListItem>
    );
  }

  return (
    <List>
      {greenhouses.map(greenhouse => (
        <React.Fragment key={greenhouse.id.id}>
          <ListItem
            secondaryAction={
              <IconButton
                edge="end"
                onClick={() => handleClick(greenhouse.id.id)}
              >
                {openGreenhouse === greenhouse.id.id ? (
                  <ExpandLess />
                ) : (
                  <ExpandMore />
                )}
              </IconButton>
            }
            disablePadding
          >
            <ListItemButton
              component={RouterLink}
              to={`/dashboard/greenhouse/${greenhouse.id.id}`}
            >
              <ListItemText primary={greenhouse.label} />
            </ListItemButton>
          </ListItem>
          <Collapse
            in={openGreenhouse === greenhouse.id.id}
            timeout="auto"
            unmountOnExit
          >
            <List component="div" disablePadding>
              <DeviceList assetId={greenhouse.id.id} />
            </List>
          </Collapse>
        </React.Fragment>
      ))}
    </List>
  );
});

export default GreenhouseList;
