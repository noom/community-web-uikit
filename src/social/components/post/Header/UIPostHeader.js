import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import cx from 'classnames';
import TruncateMarkup from 'react-truncate-markup';
import Skeleton from '~/core/components/Skeleton';
import customizableComponent from '~/core/hocs/customization';
import Time from '~/core/components/Time';
import Avatar from '~/core/components/Avatar';
import BanIcon from '~/icons/Ban';
import { backgroundImage as UserImage } from '~/icons/User';
import {
  Name,
  PostInfo,
  ShieldIcon,
  ModeratorBadge,
  AdditionalInfo,
  PostTarget,
  PostHeaderContainer,
  PostNamesContainer,
  MessageContainer,
} from './styles';

const UIPostHeader = ({
  userType,
  avatarFileUrl,
  postAuthorName,
  postTargetName,
  timeAgo,
  isModerator,
  isModeratorTagVisible = false,
  isEdited,
  onClickCommunity,
  onClickUser,
  hidePostTarget,
  loading,
  isBanned,
}) => {
  const { formatMessage } = useIntl();

  const renderPostNames = () => {
    return (
      <PostNamesContainer data-qa-anchor="post-header-post-names">
        <TruncateMarkup lines={3}>
          <Name
            data-qa-anchor="post-header-post-name"
            className={cx({ clickable: !!onClickUser })}
            onClick={onClickUser}
            isHighlighted={!!userType}
          >
            {postAuthorName}
          </Name>
        </TruncateMarkup>

        {isBanned && <BanIcon height={14} width={14} />}
      </PostNamesContainer>
    );
  };

  const renderAdditionalInfo = () => {
    return (
      <AdditionalInfo showTime={!!timeAgo} data-qa-anchor="post-header-additional-info">
        {postTargetName && !hidePostTarget && (
          <PostTarget
            data-qa-anchor="post-header-post-target-name"
            className={cx({ clickable: !!onClickCommunity })}
            onClick={onClickCommunity}
          >
            {postTargetName}
          </PostTarget>
        )}

        {isModerator && isModeratorTagVisible && (
          <ModeratorBadge data-qa-anchor="post-header-additional-info-moderator-badge">
            <ShieldIcon width={14} height={14} /> <FormattedMessage id="moderator" />
          </ModeratorBadge>
        )}

        {timeAgo && <Time date={timeAgo} />}

        {isEdited && (
          <MessageContainer data-qa-anchor="post-header-additional-info-edited-label">
            <FormattedMessage id="post.edited" />
          </MessageContainer>
        )}
      </AdditionalInfo>
    );
  };
  return (
    <PostHeaderContainer data-qa-anchor="post-header">
      <Avatar
        displayName={typeof postAuthorName === 'string' ? postAuthorName : undefined}
        data-qa-anchor="post-header-avatar"
        avatar={avatarFileUrl}
        backgroundImage={UserImage}
        loading={loading}
        onClick={onClickUser}
      />
      <PostInfo data-qa-anchor="post-header-post-info">
        {loading ? (
          <>
            <div>
              <Skeleton width={96} style={{ fontSize: 8 }} />
            </div>
            <Skeleton width={189} style={{ fontSize: 8 }} />
          </>
        ) : (
          <>
            {renderPostNames()}
            {renderAdditionalInfo()}
          </>
        )}
      </PostInfo>
    </PostHeaderContainer>
  );
};

UIPostHeader.propTypes = {
  userType: PropTypes.string,
  avatarFileUrl: PropTypes.string,
  postAuthorName: PropTypes.node,
  postTargetName: PropTypes.string,
  timeAgo: PropTypes.instanceOf(Date),
  isModerator: PropTypes.bool,
  isModeratorTagVisible: PropTypes.bool,
  isEdited: PropTypes.bool,
  hidePostTarget: PropTypes.bool,
  loading: PropTypes.bool,
  isBanned: PropTypes.bool,
  onClickCommunity: PropTypes.func,
  onClickUser: PropTypes.func,
};

UIPostHeader.defaultProps = {
  avatarFileUrl: '',
  postAuthorName: '',
  postTargetName: '',
  timeAgo: null,
  isModerator: false,
  isEdited: false,
  hidePostTarget: false,
  loading: false,
  isBanned: false,
  onClickCommunity: null,
  onClickUser: null,
};

export default customizableComponent('UIPostHeader', UIPostHeader);
