import { CalculateImageSize } from '../utils';
import { Image } from 'react-native';

describe('CalculateImageSize', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calculates size for URL source', async () => {
    jest.spyOn(Image, 'getSize').mockImplementation((_uri, success) => {
      success(100, 200);
    });
    const result = await CalculateImageSize('https://example.com/image.png');
    expect(result).toEqual({ width: 100, height: 200 });
  });

  it('rejects for URL source error', async () => {
    jest.spyOn(Image, 'getSize').mockImplementation((_uri, _success, error) => {
      if (error) error(new Error('image error'));
    });
    await expect(
      CalculateImageSize('https://example.com/image.png')
    ).rejects.toThrow('image error');
  });

  it('calculates size for require source with fallback', async () => {
    jest.spyOn(Image, 'resolveAssetSource').mockReturnValue({
      width: 300,
      height: 400,
      uri: 'local',
      scale: 1,
    });
    const result = await CalculateImageSize(12345 as any);
    expect(result).toEqual({ width: 300, height: 400 });

    const fallbackResult = await CalculateImageSize(null as any, 9999 as any);
    expect(fallbackResult).toEqual({ width: 300, height: 400 });
  });
});
