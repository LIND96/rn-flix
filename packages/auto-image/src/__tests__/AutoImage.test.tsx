import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { Text } from 'react-native';
import AutoImage from '../index';
import * as utilsModule from '../utils';

describe('AutoImage', () => {
  beforeEach(() => {
    jest
      .spyOn(utilsModule, 'CalculateImageSize')
      .mockResolvedValue({ width: 500, height: 500 });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders correctly without width and height', async () => {
    render(<AutoImage source="https://example.com/image.png" />);
    // it will be loading initially, then resolve size
    await waitFor(() => {
      expect(utilsModule.CalculateImageSize).toHaveBeenCalledWith(
        'https://example.com/image.png',
        expect.anything()
      );
    });
  });

  it('renders with specific width prop', async () => {
    render(<AutoImage source="https://example.com/image.png" width={100} />);
    await waitFor(() => {
      expect(utilsModule.CalculateImageSize).toHaveBeenCalled();
    });
  });

  it('renders with specific height prop and updates dynamically', async () => {
    const { rerender } = render(
      <AutoImage source="https://example.com/image.png" height={150} />
    );
    await waitFor(() => {
      expect(utilsModule.CalculateImageSize).toHaveBeenCalled();
    });

    // Hit the props.height update branch
    rerender(<AutoImage source="https://example.com/image.png" height={300} />);
    await waitFor(() => {
      expect(utilsModule.CalculateImageSize).toHaveBeenCalledTimes(2);
    });
  });

  it('throws error when both width and height are provided', () => {
    // React suppresses error output, but we need to assert that Error is tossed
    const originalConsoleError = console.error;
    console.error = jest.fn();

    expect(() => {
      render(
        <AutoImage
          source="https://example.com/image.png"
          width={100}
          height={100}
        />
      );
    }).toThrow(
      'Cannot set width and height, you can only use one of them, and put the rest inside style props'
    );

    console.error = originalConsoleError;
  });

  it('renders with children (ImageBackground mode)', async () => {
    const { getByText } = render(
      <AutoImage source="https://example.com/image.png">
        <Text>Inner content</Text>
      </AutoImage>
    );

    await waitFor(() => {
      expect(getByText('Inner content')).toBeTruthy();
    });
  });

  it('handles image loading error gracefully', async () => {
    jest
      .spyOn(utilsModule, 'CalculateImageSize')
      .mockRejectedValue(new Error('Fail to load image'));
    const originalConsoleError = console.error;
    console.error = jest.fn();

    render(<AutoImage source="https://example.com/image.png" />);
    await waitFor(() => {
      // It sets isError to true, and changes source to defaultErrorImage
      expect(console.error).toHaveBeenCalledWith(
        'AutoImage Error: ',
        expect.any(Error)
      );
    });

    console.error = originalConsoleError;
  });

  it('tests static setErrorImage method', () => {
    expect(typeof AutoImage.setErrorImage).toBe('function');
    AutoImage.setErrorImage(require('../errorImage.png'));
  });
});
