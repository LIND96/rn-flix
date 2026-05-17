import {
  Image,
  ImageResolvedAssetSource,
  ImageRequireSource,
} from 'react-native';

export interface ImageSize {
  width: number;
  height: number;
}

/**
 * Calculate the size of the given image source.
 *
 * @param source - The source of the image. Can be a URL or an imported image.
 * @param defaultErrorImage - The default image to use if the source is not a valid image.
 *
 * @returns A promise that resolves with the size of the image.
 */
export const CalculateImageSize = (
  source: string | ImageRequireSource,
  defaultErrorImage?: ImageRequireSource
): Promise<ImageSize> => {
  return new Promise((resolve, reject) => {
    const isSourceURL = typeof source === 'string';
    if (isSourceURL) {
      Image.getSize(
        source as string,
        (width, height) => resolve({ width, height }),
        (error) => reject(error)
      );
    } else {
      const detailSource = Image.resolveAssetSource(
        (source as ImageRequireSource) ||
          (defaultErrorImage as ImageRequireSource)
      ) as ImageResolvedAssetSource;
      resolve({ width: detailSource.width, height: detailSource.height });
    }
  });
};
