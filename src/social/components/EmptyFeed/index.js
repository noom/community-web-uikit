import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { Button } from '@noom/wax-component-library';
import { FeedType, PostTargetType } from '@amityco/js-sdk';

import styled from 'styled-components';

import customizableComponent from '~/core/hocs/customization';
import EmptyState from '~/core/components/EmptyState';
import LegacyButton from '~/core/components/Button';
import { NewspaperLight, Search } from '~/icons';

const FeedIcon = styled(NewspaperLight).attrs({ width: 48, height: 48 })`
  margin: 10px;
`;

const ExploreLink = styled(LegacyButton)`
  font-size: 14px;
  margin-top: 8px;
`;

const SearchIcon = styled(Search).attrs({ width: 16, height: 16 })`
  margin-right: 6px;
`;

const FeedTypesEmptyText = {
  [PostTargetType.GlobalFeed]: () => 'feed.emptyFeed',
  [PostTargetType.CommunityFeed]: (canPost, communityFeedType) => {
    if (communityFeedType === FeedType.Reviewing) {
      return 'feed.emptyCommunityReviewingFeed';
    }

    return canPost ? 'feed.emptyJoinedCommunityPublicFeed' : 'feed.emptyCommunityPublicFeed';
  },
  [PostTargetType.UserFeed]: () => 'feed.emptyUserFeed',
  [PostTargetType.MyFeed]: () => 'feed.emptyMyFeed',
};

const EmptyFeed = ({
  targetType = PostTargetType.MyFeed,
  canPost = false,
  className = null,
  feedType = null,
  goToExplore,
  onReload,
}) => (
  <EmptyState
    className={className}
    title={
      <FormattedMessage
        id={FeedTypesEmptyText[targetType]?.(canPost, feedType) || 'feed.emptyFeed'}
      />
    }
    icon={<FeedIcon />}
  >
    {onReload && (
      <Button leftIcon="repeat" variant="outline" mt={2} onClick={onReload}>
        <FormattedMessage id="feed.reload" />
      </Button>
    )}

    {goToExplore && (
      <ExploreLink onClick={goToExplore}>
        <SearchIcon />
        <FormattedMessage id="community.exploreCommunities" />
      </ExploreLink>
    )}
  </EmptyState>
);

EmptyFeed.propTypes = {
  targetType: PropTypes.oneOf(Object.values(PostTargetType)),
  canPost: PropTypes.bool,
  className: PropTypes.string,
  goToExplore: PropTypes.func,
  feedType: PropTypes.oneOf(Object.values(FeedType)),
};

export default customizableComponent('EmptyFeed', EmptyFeed);
