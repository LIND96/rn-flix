import { useCallback, useState } from 'react';
import type { SnackbarData } from './Snackbar';

export type OptionsType = Omit<SnackbarData, 'message' | 'id' | 'hide'>;

/**
 * @file InternalUseSnackbar.ts
 * This is a React hook used for managing and displaying snackbars.
 */
const InternalUseSnackbar = () => {
  const [snackbarData, setSnackbarData] = useState<SnackbarData | null>(null);

  const hide = useCallback(() => {
    setSnackbarData(null);
  }, []);

  const show = useCallback(
    (message: string, options?: OptionsType) => {
      const id = Date.now().toString(36);
      requestAnimationFrame(() => {
        setSnackbarData({
          message,
          id,
          hide,
          ...options,
        } as SnackbarData);
      });
    },
    [hide]
  );

  return {
    snackbarData,
    /**
     * A function to display a snackbar.
     *
     * @param message - The message to be displayed.
     * @param options - Additional options for the snackbar.
     */
    show,
    /**
     * A function to hide a snackbar.
     */
    hide,
  };
};

export default InternalUseSnackbar;
