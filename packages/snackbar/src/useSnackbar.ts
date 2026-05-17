import { useContext } from 'react';
import { SnackbarContext } from './SnackbarProvider';

/**
 * @file useSnackbar.ts
 * @brief This hook is used to access the SnackbarContext and retrieve the show function.
 *
 * @throws {Error} Throws an error if the SnackbarContext is not defined.
 */
const useSnackbar = () => {
  const SnackbarCTX = useContext(SnackbarContext);
  if (!SnackbarCTX) {
    throw new Error('useSnackbar must be used within a SnackbarProvider.');
  }

  return SnackbarCTX;
};

export default useSnackbar;
