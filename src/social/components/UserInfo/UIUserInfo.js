import React, { useState, useEffect } from 'react';
import Truncate from 'react-truncate-markup';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import { FollowRequestStatus } from '@amityco/js-sdk';

import ConditionalRender from '~/core/components/ConditionalRender';
import Button from '~/core/components/Button';
import customizableComponent from '~/core/hocs/customization';
import { backgroundImage as UserImage } from '~/icons/User';
import { canPerformUserLookups } from '~/helpers/permissions';
import { getUserType } from '~/helpers/userTypes';

import { useConfig } from '~/social/providers/ConfigProvider';
import { PENDING_TAB } from '~/social/pages/UserFeed/Followers/constants';
import BanIcon from '~/icons/Ban';

import { UserMetadata } from './UserMetadata';

import {
  Avatar,
  BigBee,
  Container,
  ProfileName,
  Header,
  Description,
  PencilIcon,
  OptionMenu,
  PendingNotification,
  NotificationTitle,
  NotificationBody,
  TitleEllipse,
  ActionButtonContainer,
  ProfileNameWrapper,
} from './styles';

import { UserFeedTabs } from '~/social/pages/UserFeed/constants';
import { confirm } from '~/core/components/Confirm';
import useUser from '~/core/hooks/useUser';
import useReport from '~/social/hooks/useReport';
import { useAsyncCallback } from '~/core/hooks/useAsyncCallback';
import { notification } from '~/core/components/Notification';
import useFollowersList from '~/core/hooks/useFollowersList';
import { useSDK } from '~/core/hooks/useSDK';

const UIUserInfo = ({
  userId,
  currentUserId,
  fileUrl,
  displayName,
  description,
  isMyProfile,
  onEditUser,
  onFollowDecline,
  isFollowAccepted,
  setActiveTab,
  setFollowActiveTab,
  isPrivateNetwork,
  showUserProfileMetadata,
}) => {
  const { user: currentUser } = useUser(currentUserId);
  const { user } = useUser(userId);
  const { isFlaggedByMe, handleReport } = useReport(user);
  const { formatMessage } = useIntl();
  const { connected } = useSDK();

  const [onReportClick] = useAsyncCallback(async () => {
    await handleReport();
    notification.success({
      content: (
        <FormattedMessage id={isFlaggedByMe ? 'report.unreportSent' : 'report.reportSent'} />
      ),
    });
  }, [handleReport]);

  const title = user.displayName
    ? formatMessage({ id: 'user.unfollow.confirm.title' }, { displayName: user.displayName })
    : formatMessage({ id: 'user.unfollow.confirm.title.thisUser' });

  const content = user.displayName
    ? formatMessage({ id: 'user.unfollow.confirm.body' }, { displayName: user.displayName })
    : formatMessage({ id: 'user.unfollow.confirm.body.thisUser' });
  
  const currentUserType = getUserType(currentUser);
  const profileUserType = getUserType(user);

  const [userInStingDash, setUserInStingDash] = useState(false);
  const { isUserCurrentlyInStingDashCallback, manateeUrl, dashboardUrl } = useConfig();
  useEffect(() => {
    (async () => {
      const inStingDash = await isUserCurrentlyInStingDashCallback(userId);
      setUserInStingDash(inStingDash);
    })();
  }, [userId]);

  const onLookupUser = () => {
    window.open(`${manateeUrl}/user/${userId}`, '_blank');
  };

  const onOpenUserDashboard = () => {
    window.open(`${dashboardUrl}/inbox/${currentUserId}/coachee/${userId}`, '_blank');
  };

  const allOptions = [
    isFollowAccepted &&
      !isMyProfile && {
        name: 'user.unfollow',
        action: () =>
          confirm({
            title,
            content,
            cancelText: formatMessage({ id: 'buttonText.cancel' }),
            okText: formatMessage({ id: 'buttonText.unfollow' }),
            onOk: async () => {
              await onFollowDecline();
              setActiveTab(UserFeedTabs.TIMELINE);
            },
          }),
      },
    !isMyProfile && {
      name: isFlaggedByMe ? 'report.unreportUser' : 'report.reportUser',
      action: onReportClick,
    },
    canPerformUserLookups({
      actingUserType: currentUserType,
      targetUserType: profileUserType,
    }) &&  {
      name: 'post.manatee',
      action: onLookupUser,
    },
    canPerformUserLookups({
      actingUserType: currentUserType,
      targetUserType: profileUserType,
    }) &&  {
      name: 'post.dashboard',
      action: onOpenUserDashboard,
    },
  ].filter(Boolean);

  const [pendingUsers] = useFollowersList(currentUserId, FollowRequestStatus.Pending);

  return (
    <>
      <Container data-qa-anchor="user-info">
        <Header>
          <Avatar
            size="big"
            displayName={user.displayName}
            data-qa-anchor="user-info-profile-image"
            avatar={fileUrl}
            backgroundImage={UserImage}
          />
          {userInStingDash && <BigBee>🐝</BigBee>}
          <ActionButtonContainer>
            <ConditionalRender condition={isMyProfile}>
              <Button
                data-qa-anchor="user-info-edit-profile-button"
                disabled={!connected}
                onClick={() => onEditUser(userId)}
              >
                <PencilIcon /> <FormattedMessage id="user.editProfile" />
              </Button>
            </ConditionalRender>
          </ActionButtonContainer>
          <OptionMenu options={allOptions} pullRight={false} />
        </Header>
        <ProfileNameWrapper>
          <Truncate lines={3}>
            <ProfileName data-qa-anchor="user-info-profile-name">{displayName}</ProfileName>
          </Truncate>
          {user.isGlobalBan && (
            <BanIcon width={14} height={14} css="margin-left: 0.265rem; margin-top: 1px;" />
          )}
        </ProfileNameWrapper>
        <Description data-qa-anchor="user-info-description">{description}</Description>

        {isMyProfile && pendingUsers.length > 0 && isPrivateNetwork && (
          <PendingNotification
            onClick={() => {
              setActiveTab(UserFeedTabs.FOLLOWERS);
              setTimeout(() => setFollowActiveTab(PENDING_TAB), 250);
            }}
          >
            <NotificationTitle>
              <TitleEllipse />
              <FormattedMessage id="follow.pendingNotification.title" />
            </NotificationTitle>
            <NotificationBody>
              <FormattedMessage id="follow.pendingNotification.body" />
            </NotificationBody>
          </PendingNotification>
        )}
      </Container>
      {showUserProfileMetadata && user.userId && (
        <Container data-qa-anchor="user-metadata">
          <UserMetadata user={user} />
        </Container>
      )}
    </>
  );
};

UIUserInfo.propTypes = {
  userId: PropTypes.string,
  currentUserId: PropTypes.string,
  fileUrl: PropTypes.string,
  displayName: PropTypes.string,
  description: PropTypes.string,
  isMyProfile: PropTypes.bool,
  isFollowPending: PropTypes.bool,
  isFollowNone: PropTypes.bool,
  isFollowAccepted: PropTypes.bool,
  setActiveTab: PropTypes.func,
  setFollowActiveTab: PropTypes.func,
  followerCount: PropTypes.number,
  followingCount: PropTypes.number,
  isPrivateNetwork: PropTypes.bool,
  onEditUser: PropTypes.func,
  onFollowRequest: PropTypes.func,
  onFollowDecline: PropTypes.func,
};

UIUserInfo.defaultProps = {
  userId: '',
  currentUserId: '',
  fileUrl: '',
  displayName: '',
  description: '',
  isMyProfile: false,
  onEditUser: () => {},
  onFollowRequest: () => null,
  onFollowDecline: () => null,
  isFollowPending: false,
  isFollowNone: false,
  isFollowAccepted: false,
  setActiveTab: () => null,
  setFollowActiveTab: () => null,
  followerCount: 0,
  followingCount: 0,
};

export default customizableComponent('UIUserInfo', UIUserInfo);
