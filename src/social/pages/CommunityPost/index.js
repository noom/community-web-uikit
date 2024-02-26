import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

import { PrimaryButton } from '~/core/components/Button';
import useUser from '~/core/hooks/useUser';
import { isCoach } from '~/helpers/permissions';
import withSDK from '~/core/hocs/withSDK';
import CommunityInfo from '~/social/components/CommunityInfo';
import Post from '~/social/components/post/Post';
import { useConfig } from '~/social/providers/ConfigProvider';

import { Wrapper, NavButtonGroup } from './styles';

const CommunityPost = ({
  currentUserId,
  postId,
  commentId,
  communityId,
  readonly,
  handleCopyPostPath,
  handleCopyCommentPath,
}) => {
  const { fetchNextPostInCommunity } = useConfig();
  const { user: currentUser } = useUser(currentUserId, [currentUserId]);
  const [olderButtonDisabled, setOlderButtonDisabled] = useState(false);
  const [newerButtonDisabled, setNewerButtonDisabled] = useState(false);
  const navigate = useNavigate();

  const onOlderPost = async (communityId, postId) => {
    const nextPostPath = await fetchNextPostInCommunity(communityId, postId, "AFTER");
    if (nextPostPath) {
      navigate(nextPostPath);
      setNewerButtonDisabled(false);
    } else {
      setOlderButtonDisabled(true);
    }
  };
  const onNewerPost = async () => {
    const nextPostPath = await fetchNextPostInCommunity(communityId, postId, "BEFORE");
    if (nextPostPath) {
      navigate(nextPostPath);
      setOlderButtonDisabled(false);
    } else {
      setNewerButtonDisabled(true);
    }
  };

  return (
    <Wrapper>
      <CommunityInfo communityId={communityId} />

      {
      isCoach(currentUser) &&
        <NavButtonGroup isFullWidth>
          <PrimaryButton
            disabled={olderButtonDisabled}
            onClick={() => onOlderPost(communityId, postId)}
          >
            &lt; Older
          </PrimaryButton>
          <PrimaryButton
            disabled={newerButtonDisabled}
            onClick={() => onNewerPost(communityId, postId)}
          >
            Newer &gt;
          </PrimaryButton>
        </NavButtonGroup>
      }

      <Post
        key={postId}
        postId={postId}
        hidePostTarget={false}
        readonly={readonly}
        handleCopyPostPath={handleCopyPostPath}
        handleCopyCommentPath={handleCopyCommentPath}
      />
    </Wrapper>
  );
};

CommunityPost.propTypes = {
  commentId: PropTypes.string,
  postId: PropTypes.string.isRequired,
  communityId: PropTypes.string.isRequired,
  currentUserId: PropTypes.string.isRequired,
  readonly: PropTypes.bool,
  handleCopyPostPath: PropTypes.func,
  handleCopyCommentPath: PropTypes.func,
};

export default withSDK(CommunityPost);
