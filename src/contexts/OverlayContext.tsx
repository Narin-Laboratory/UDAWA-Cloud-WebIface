import React, { createContext, useState, useMemo } from 'react';
import type { ReactNode } from 'react';
import ProgressOverlay from '../components/ProgressOverlay';

interface OverlayContextProps {
  showOverlay: (message: string, showProgress?: boolean) => void;
  hideOverlay: () => void;
}

export const OverlayContext = createContext<OverlayContextProps | undefined>(
  undefined
);

export const OverlayProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [overlayState, setOverlayState] = useState({
    open: false,
    message: '',
    showProgress: false,
    showError: false,
  });

  const showOverlay = (message: string, showProgress = true) => {
    setOverlayState({ open: true, message, showProgress, showError: false });
  };

  const hideOverlay = () => {
    setOverlayState({ open: false, message: '', showProgress: false, showError: false });
  };

  const contextValue = useMemo(
    () => ({
      showOverlay,
      hideOverlay,
    }),
    []
  );

  const closeOverlay = () => {
    setOverlayState({ ...overlayState, open: false });
  };

  return (
    <OverlayContext.Provider value={contextValue}>
      <ProgressOverlay
        open={overlayState.open}
        message={overlayState.message}
        showProgress={overlayState.showProgress}
        showError={overlayState.showError}
        onClose={closeOverlay}
      />
      {children}
    </OverlayContext.Provider>
  );
};