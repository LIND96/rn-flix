import React, { createContext, useMemo } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import InternalUseSnackbar, { OptionsType } from './InternalUseSnackbar';
import Snackbar from './Snackbar';

export interface SnackbarContextType {
  /**
   * A function to display a snackbar.
   *
   * @param message - The message to be displayed.
   * @param options - Additional options for the snackbar.
   */
  show: (message: string, options?: OptionsType) => void;
  /**
   * A function to hide a snackbar.
   */
  hide: () => void;
}

export const SnackbarContext = createContext<SnackbarContextType>({
  show: () => null,
  hide: () => null,
});

export interface SnackbarProviderProps {
  /** The children components. */
  children: React.ReactNode;
  /** The style object for the component. */
  style?: ViewStyle;
}

/**
 * @file SnackbarProvider.tsx
 * @brief This component is used as a provider for the SnackbarContext.
 *
 * @param props - The provider props.
 * @returns {JSX.Element} The SnackbarProvider component.
 */
const SnackbarProvider: React.FC<SnackbarProviderProps> = ({
  children,
  style,
}) => {
  const { snackbarData, show, hide } = InternalUseSnackbar();
  const contextValue = useMemo(() => ({ show, hide }), [show, hide]);
  const behavior = useMemo(
    () => (Platform.OS === 'ios' ? 'position' : undefined),
    []
  );

  return (
    <SnackbarContext.Provider value={contextValue}>
      {children}
      <KeyboardAvoidingView
        behavior={behavior}
        style={[styles.containerView, style]}
        pointerEvents="box-none"
      >
        {snackbarData && <Snackbar key={snackbarData.id} {...snackbarData} />}
      </KeyboardAvoidingView>
    </SnackbarContext.Provider>
  );
};

const styles = StyleSheet.create({
  containerView: {
    position: 'absolute',
    bottom: 20,
    zIndex: 999,
    left: 8,
    right: 8,
  },
});

export default SnackbarProvider;
