import React from 'react';
import { render, act } from '@testing-library/react-native';
import { Text, Animated, Platform } from 'react-native';
import SnackbarProvider, { SnackbarContext } from '../SnackbarProvider';
import useSnackbar from '../useSnackbar';

const TestComponent = () => {
  const { show } = useSnackbar();
  return (
    <Text
      testID="trigger-show"
      onPress={() => show('Testing Provider', { label: 'UNDO' })}
    >
      Show Snackbar
    </Text>
  );
};

describe('SnackbarProvider', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest
      .spyOn(global, 'requestAnimationFrame')
      .mockImplementation((cb: any) => setTimeout(cb, 16) as any);
    jest.spyOn(Animated, 'timing').mockImplementation(
      () =>
        ({
          start: (cb: any) => {
            cb && cb({ finished: true });
          },
        }) as any
    );
  });

  afterEach(() => {
    act(() => {
      jest.runOnlyPendingTimers();
    });
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('renders children correctly', () => {
    const { getByText } = render(
      <SnackbarProvider>
        <Text>Child Component</Text>
      </SnackbarProvider>
    );

    expect(getByText('Child Component')).toBeTruthy();
  });

  it('evaluates behavior for android platform', () => {
    const originalOS = Platform.OS;
    (Platform as any).OS = 'android';

    const { getByText } = render(
      <SnackbarProvider>
        <Text>Android Child</Text>
      </SnackbarProvider>
    );
    expect(getByText('Android Child')).toBeTruthy();
    (Platform as any).OS = originalOS;
  });

  it('shows Snackbar when context trigger show()', () => {
    const { getByTestId, getByText } = render(
      <SnackbarProvider>
        <TestComponent />
      </SnackbarProvider>
    );

    act(() => {
      getByTestId('trigger-show').props.onPress();
      jest.advanceTimersByTime(20);
    });

    expect(getByText('Testing Provider')).toBeTruthy();
    expect(getByText('UNDO')).toBeTruthy();
  });

  it('default context returns default empty functions', () => {
    let ctx: any;
    render(
      <SnackbarContext.Consumer>
        {(value) => {
          ctx = value;
          return <Text>Consumer</Text>;
        }}
      </SnackbarContext.Consumer>
    );
    expect(ctx.show('x')).toBeNull();
    expect(ctx.hide()).toBeNull();
  });
});
