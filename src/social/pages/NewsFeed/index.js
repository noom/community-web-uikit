import React from 'react';
import PropTypes from 'prop-types';
import { PostTargetType } from '@amityco/js-sdk';

import { PageTypes } from '~/social/constants';
import Feed from '~/social/components/Feed';

import { useNavigation } from '~/social/providers/NavigationProvider';

import { Wrapper } from './styles';

const NewsFeed = ({ handleCopyPostPath, handleCopyCommentPath }) => {
  const { onChangePage } = useNavigation();

  return (
    <Wrapper data-qa-anchor="news-feed">
      <Feed
        targetType={PostTargetType.GlobalFeed}
        goToExplore={() => onChangePage(PageTypes.Explore)}
        showPostCreator
        handleCopyPostPath={handleCopyPostPath}
        handleCopyCommentPath={handleCopyCommentPath}
      />
    </Wrapper>
  );
};

NewsFeed.propTypes = {
  handleCopyPostPath: PropTypes.func,
  handleCopyCommentPath: PropTypes.func,
};

export default NewsFeed;
