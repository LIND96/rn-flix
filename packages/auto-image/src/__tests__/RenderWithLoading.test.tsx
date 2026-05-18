import React from 'react';
import { render } from '@testing-library/react-native';
import { Text } from 'react-native';
import RenderWithLoading from '../RenderWithLoading';

describe('RenderWithLoading', () => {
  it('renders default loading indicator when isLoading is true', () => {
    const { queryByText } = render(
      <RenderWithLoading isLoading={true}>
        <Text>Children Content</Text>
      </RenderWithLoading>
    );

    expect(queryByText('Children Content')).toBeNull();
  });

  it('renders custom loading indicator', () => {
    const { getByText } = render(
      <RenderWithLoading
        isLoading={true}
        renderLoading={<Text>Custom Loading</Text>}
      >
        <Text>Children Content</Text>
      </RenderWithLoading>
    );
    expect(getByText('Custom Loading')).toBeTruthy();
  });

  it('renders children when isLoading is false', () => {
    const { getByText } = render(
      <RenderWithLoading isLoading={false}>
        <Text>Children Content</Text>
      </RenderWithLoading>
    );
    expect(getByText('Children Content')).toBeTruthy();
  });
});
