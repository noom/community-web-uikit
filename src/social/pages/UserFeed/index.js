import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { PostTargetType } from '@amityco/js-sdk';

import withSDK from '~/core/hocs/withSDK';
import * as utils from '~/helpers/utils';
import MediaGallery from '~/social/components/MediaGallery';
import { useConfig } from '~/social/providers/ConfigProvider';

import UserInfo from '~/social/components/UserInfo';
import FeedHeaderTabs from '~/social/components/FeedHeaderTabs';

import Feed from '~/social/components/Feed';
import Followers from '~/social/pages/UserFeed/Followers';

import { tabs, UserFeedTabs } from './constants';
import { FollowersTabs } from '~/social/pages/UserFeed/Followers/constants';
import useFollow from '~/core/hooks/useFollow';
import { Wrapper } from './styles';

const CAN_POST_ON_PRIVATE_TIMELINE = false;

const UserFeed = ({
  userId,
  currentUserId,
  networkSettings,
  handleCopyPostPath,
  handleCopyCommentPath,
}) => {
  const { showUserProfileMetadata } = useConfig();
  const isPrivateNetwork = utils.isPrivateNetwork(networkSettings);

  const [activeTab, setActiveTab] = useState(UserFeedTabs.TIMELINE);
  const [followActiveTab, setFollowActiveTab] = useState(FollowersTabs.FOLLOWINGS);

  const isMe = userId === currentUserId;

  const { isFollowAccepted } = useFollow(currentUserId, userId);
  const isHiddenProfile = isPrivateNetwork && !isFollowAccepted && !isMe;

  const filteredTabs = isHiddenProfile
    ? tabs.filter(({ value }) => value === UserFeedTabs.TIMELINE)
    : tabs;

  return (
    // key prop is necessary here, without it this part will never re-render !!!
    <Wrapper>
      <UserInfo
        key={userId}
        userId={userId}
        setActiveTab={setActiveTab}
        setFollowActiveTab={setFollowActiveTab}
        isPrivateNetwork={isPrivateNetwork}
        showUserProfileMetadata={showUserProfileMetadata}
      />

      <FeedHeaderTabs
        data-qa-anchor="user-feed-header"
        tabs={filteredTabs}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {activeTab === UserFeedTabs.TIMELINE && (
        <Feed
          targetType={isMe ? PostTargetType.MyFeed : PostTargetType.UserFeed}
          targetId={userId}
          showPostCreator={CAN_POST_ON_PRIVATE_TIMELINE}
          isHiddenProfile={isHiddenProfile}
          handleCopyPostPath={handleCopyPostPath}
          handleCopyCommentPath={handleCopyCommentPath}
        />
      )}

      {activeTab === UserFeedTabs.GALLERY && (
        <MediaGallery targetType={PostTargetType.UserFeed} targetId={userId} />
      )}

      {activeTab === UserFeedTabs.FOLLOWERS && !isHiddenProfile && (
        <Followers
          userId={userId}
          activeTab={followActiveTab}
          setActiveTab={setFollowActiveTab}
          setUserFeedTab={setActiveTab}
        />
      )}
    </Wrapper>
  );
};

UserFeed.propTypes = {
  userId: PropTypes.string.isRequired,
  currentUserId: PropTypes.string.isRequired,
  networkSettings: PropTypes.object.isRequired,
  handleCopyPostPath: PropTypes.func,
  handleCopyCommentPath: PropTypes.func,
};

export default withSDK(UserFeed);
