import React from 'react';
import { ActivityIndicator, View, ViewStyle } from 'react-native';

export interface RenderWithLoadingProps {
  /** The children components. */
  children: React.ReactNode;
  /** Whether to show the loading indicator or not. */
  isLoading: boolean;
  /** The width of the loading indicator or placeholder component. */
  width?: number;
  /** The height of the loading indicator or placeholder component. */
  height?: number;
  /** The loading indicator component to render. */
  renderLoading?: React.ReactNode;
  /** The style object for the component. */
  style?: ViewStyle;
}

/**
 * @file RenderWithLoading.tsx
 * @brief This component renders a loading indicator or a placeholder component when the `isLoading` prop is true,
 * and the `children` when it's false.
 *
 * @param props - The component props.
 * @returns {JSX.Element} The rendered component.
 */
const RenderWithLoading: React.FC<RenderWithLoadingProps> = ({
  children,
  isLoading,
  width,
  height,
  renderLoading,
  style,
}) => {
  if (isLoading) {
    return (
      <View
        style={[
          {
            width,
            height,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#ccc',
          },
          style,
        ]}
      >
        <LoadingIndicator renderLoading={renderLoading} />
      </View>
    );
  } else {
    return <>{children}</>;
  }
};

interface LoadingIndicatorProps {
  renderLoading?: React.ReactNode;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  renderLoading,
}) => {
  if (renderLoading) {
    return <>{renderLoading}</>;
  } else {
    return <ActivityIndicator size={'large'} color="orangered" />;
  }
};

export default RenderWithLoading;
