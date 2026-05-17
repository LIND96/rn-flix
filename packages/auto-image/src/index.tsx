import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  ImageBackground,
  ImageRequireSource,
  ImageSourcePropType,
  ImageStyle,
  useWindowDimensions,
  ViewStyle,
} from 'react-native';
import RenderWithLoading from './RenderWithLoading';
import { CalculateImageSize, ImageSize } from './utils';

const ErrorImage = require('./errorImage.png');

const window = Dimensions.get('window');

let defaultErrorImage: ImageRequireSource = ErrorImage;

export interface AutoImageProps {
  /** source of the Image */
  source: string | ImageSourcePropType;
  /** set `Width` of image */
  width?: number;
  /** set `Height` of image */
  height?: number;
  /** container style */
  style?: ViewStyle;
  /** image style */
  imageStyle?: ImageStyle;
  /** set width of loading component */
  loadingWidth?: number;
  /** set height of loading component */
  loadingHeight?: number;
  /** Custom loading component */
  renderLoading?: React.ReactNode;
  /** Component to render inside (only for ImageBackground mode) */
  children?: React.ReactNode;
}

/**
 * @author [Flix](https://github.com/zxccvvv)
 *
 * @param props - Component props
 * @returns {JSX.Element} The AutoImage component.
 */
const AutoImage: React.FC<AutoImageProps> & {
  setErrorImage: (image: ImageRequireSource) => void;
} = (props) => {
  const windowWidth = useWindowDimensions().width;
  const [width, setWidth] = useState(windowWidth);
  const [height, setHeight] = useState(props.height || 0);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [source, setSource] = useState(props.source);

  const SetSize = (size: ImageSize) => {
    if (props.width && !props.height) {
      setHeight(size.height * (props.width / size.width));
    } else if (!props.width && props.height) {
      setWidth(size.width * (props.height / size.height));
    } else {
      setHeight(size.height * (window.width / size.width));
    }
    setIsLoading(false);
  };

  const InitImage = async () => {
    try {
      const res = await CalculateImageSize(
        source as string | ImageRequireSource,
        defaultErrorImage
      );
      SetSize(res);
    } catch (error) {
      console.error('AutoImage Error: ', error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (props.width && props.height) {
      throw new Error(
        'Cannot set width and height, you can only use one of them, and put the rest inside style props'
      );
    } else if (props.width && width !== props.width) {
      setWidth(props.width);
      InitImage();
    } else if (props.height && height !== props.height) {
      setHeight(props.height);
      InitImage();
    } else {
      InitImage();
    }
  }, []);

  useEffect(() => {
    if (isError) {
      setSource(defaultErrorImage);
    }
  }, [isError]);

  const sourceProp = typeof source === 'string' ? { uri: source } : source;

  return (
    <RenderWithLoading
      isLoading={isLoading}
      width={props.loadingWidth || width}
      height={props.loadingHeight || height}
      renderLoading={props.renderLoading}
      style={props.style}
    >
      {props.children ? (
        <ImageBackground
          source={sourceProp as ImageSourcePropType}
          style={[{ width, height }, props.style] as any}
          imageStyle={[{ width, height }, props.imageStyle]}
        >
          {props.children}
        </ImageBackground>
      ) : (
        <Image
          source={sourceProp as ImageSourcePropType}
          style={[{ width, height }, props.style] as any}
        />
      )}
    </RenderWithLoading>
  );
};

AutoImage.setErrorImage = (image: ImageRequireSource) => {
  defaultErrorImage = image;
};

export default AutoImage;
