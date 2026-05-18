import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import { Animated } from 'react-native';
import Snackbar from '../Snackbar';

describe('Snackbar', () => {
  beforeEach(() => {
    jest.useFakeTimers();
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
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('renders the given message correctly', () => {
    const hideMock = jest.fn();
    const { getByText } = render(
      <Snackbar message="Message 123" id="test1" hide={hideMock} />
    );
    expect(getByText('Message 123')).toBeTruthy();
  });

  it('shows label and trigger onPress and hide logic', () => {
    const onPressMock = jest.fn();
    const hideMock = jest.fn();

    const { getByText } = render(
      <Snackbar
        message="Warning"
        label="RETRY"
        onPress={onPressMock}
        id="test2"
        hide={hideMock}
      />
    );

    expect(getByText('RETRY')).toBeTruthy();

    act(() => {
      fireEvent.press(getByText('RETRY'));
    });

    expect(onPressMock).toHaveBeenCalled();
  });

  it('automatically hides after given duration', () => {
    const hideMock = jest.fn();

    const { unmount } = render(
      <Snackbar
        message="Auto disappear"
        id="test3"
        hide={hideMock}
        duration={2000}
      />
    );

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(hideMock).toHaveBeenCalled();
    unmount(); // covers unmount clear timeout
  });

  it('renders icon and covers duration=0', () => {
    const hideMock = jest.fn();
    const { getByText, unmount } = render(
      <Snackbar
        message="No duration"
        id="test4"
        hide={hideMock}
        duration={0}
        icon={<Animated.Text>Icon</Animated.Text>}
      />
    );

    expect(getByText('Icon')).toBeTruthy();
    act(() => {
      jest.advanceTimersByTime(2000);
    });
    // handleTimeout is not set because handleDuration == 0
    expect(hideMock).not.toHaveBeenCalled();
    unmount();
  });

  it('handles manual hide when duration=0 covering branches without timeouts and no callback', () => {
    const hideMock = jest.fn();
    const { getByText } = render(
      // Label provided, but NO onPress provided, to cover the cb?.() undefined branch
      <Snackbar
        message="No timeout"
        id="test5"
        hide={hideMock}
        duration={0}
        label="HIDE ME"
      />
    );
    act(() => {
      fireEvent.press(getByText('HIDE ME'));
    });
    expect(hideMock).toHaveBeenCalled();
  });
});
