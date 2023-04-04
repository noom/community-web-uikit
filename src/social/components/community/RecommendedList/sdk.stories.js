import React from 'react';
import UiKitRecommendedCommunitiesList from '.';
import useOneCategory from '~/mock/useOneCategory';

export default {
  title: 'SDK Connected/Social/Community',
};

export const SDKRecommendedList = (props) => {
  const category = useOneCategory();

  return <UiKitRecommendedCommunitiesList category={category} {...props} />;
};

SDKRecommendedList.storyName = 'Recommended list';
