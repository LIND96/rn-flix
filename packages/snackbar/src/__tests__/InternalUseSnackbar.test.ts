import { renderHook, act } from '@testing-library/react-native';
import InternalUseSnackbar from '../InternalUseSnackbar';

describe('InternalUseSnackbar hook', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest
      .spyOn(global, 'requestAnimationFrame')
      .mockImplementation((cb: any) => setTimeout(cb, 16) as any);
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('initial state is null', () => {
    const { result } = renderHook(() => InternalUseSnackbar());
    expect(result.current.snackbarData).toBeNull();
  });

  it('shows snackbar data with correct message and options', () => {
    const { result } = renderHook(() => InternalUseSnackbar());

    act(() => {
      result.current.show('Hello World', { duration: 1000 });
      jest.advanceTimersByTime(20);
    });

    expect(result.current.snackbarData).toEqual(
      expect.objectContaining({
        message: 'Hello World',
        duration: 1000,
        id: expect.any(String),
        hide: expect.any(Function),
      })
    );
  });

  it('hides snackbar data', () => {
    const { result } = renderHook(() => InternalUseSnackbar());

    act(() => {
      result.current.show('Hello World', { duration: 1000 });
      jest.advanceTimersByTime(20);
    });

    expect(result.current.snackbarData).not.toBeNull();

    act(() => {
      result.current.hide();
    });

    expect(result.current.snackbarData).toBeNull();
  });
});
