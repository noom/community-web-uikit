import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';
import { CommentRepository, CommentReferenceType } from '@amityco/js-sdk';

import { LIKE_REACTION_KEY } from '~/constants';
import customizableComponent from '~/core/hocs/customization';
import usePost from '~/social/hooks/usePost';
import UIEngagementBar from './UIEngagementBar';
import { useActionEvents } from '~/core/providers/ActionProvider';

const EngagementBar = ({
  postId,
  readonly,
  handleCopyCommentPath,
  isHighlighted,
  showComments,
  isCommentingEnabled,
}) => {
  const [isComposeBarDisplayed, setComposeBarDisplayed] = useState(false);
  const toggleComposeBar = () => setComposeBarDisplayed((prevValue) => !prevValue);
  const actionEvents = useActionEvents();
  const hideComposeBar = () => setComposeBarDisplayed(false);

  const { post } = usePost(postId);
  const { commentsCount, reactions = {}, targetId, targetType } = post;

  const handleAddComment = async (commentText, mentionees, metadata) => {
    await CommentRepository.createTextComment({
      referenceType: CommentReferenceType.Post,
      referenceId: postId,
      text: commentText,
      mentionees,
      metadata,
    });

    actionEvents.onCommentCreate?.({
      isReply: false,
      isDisabled: !isCommentingEnabled,
    });

    hideComposeBar();
  };

  return (
    <UIEngagementBar
      postId={post.postId}
      targetId={targetId}
      targetType={targetType}
      isHighlighted={isHighlighted}
      isCommentingEnabled={isCommentingEnabled}
      totalLikes={reactions[LIKE_REACTION_KEY]}
      totalComments={commentsCount}
      readonly={readonly}
      showComments={showComments}
      isComposeBarDisplayed={isComposeBarDisplayed}
      handleAddComment={handleAddComment}
      onClickComment={toggleComposeBar}
      handleCopyCommentPath={handleCopyCommentPath}
    />
  );
};

EngagementBar.propTypes = {
  postId: PropTypes.string.isRequired,
  readonly: PropTypes.bool,
  handleCopyCommentPath: PropTypes.func,
  isHighlighted: PropTypes.bool,
  showComments: PropTypes.bool,
  isCommentingEnabled: PropTypes.bool,
};

EngagementBar.defaultProps = {
  readonly: false,
};

export { UIEngagementBar };
export default memo(customizableComponent('EngagementBar', EngagementBar));
