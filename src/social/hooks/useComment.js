import { CommentRepository } from '@amityco/js-sdk';

import { useActionEvents } from '~/core/providers/ActionProvider';
import useLiveObject from '~/core/hooks/useLiveObject';
import useMemoAsync from '~/core/hooks/useMemoAsync';
import useUser from '~/core/hooks/useUser';

const useComment = ({ commentId }) => {
  const comment = useLiveObject(() => CommentRepository.commentForId(commentId), [commentId]);
  const isCommentReady = !!comment.commentId;
  const { userId, referenceId, referenceType } = comment;
  const actionEvents = useActionEvents();
  const { user: commentAuthor, file: commentAuthorAvatar } = useUser(userId);

  const isFlaggedByMe = useMemoAsync(
    async () => (comment?.commentId ? CommentRepository.isFlaggedByMe(comment.commentId) : false),
    [comment],
  );

  const handleReportComment = async () => {
    return isFlaggedByMe ? CommentRepository.unflag(commentId) : CommentRepository.flag(commentId);
  };

  const handleReplyToComment = (replyCommentText, mentionees, metadata, isDisabled) => {
    CommentRepository.createTextComment({
      referenceType,
      referenceId,
      text: replyCommentText,
      parentId: commentId,
      metadata,
      mentionees,
    });
    actionEvents.onCommentCreate?.({
      isReply: true,
      isDisabled,
    });
  };

  const handleEditComment = (text, mentionees, metadata) =>
    CommentRepository.editTextComment({
      commentId,
      text,
      metadata,
      mentionees,
    });

  const handleDeleteComment = () => {
    CommentRepository.deleteComment(commentId);
  };

  return {
    isCommentReady,
    comment,
    commentAuthor,
    commentAuthorAvatar,
    handleReportComment,
    handleReplyToComment,
    handleEditComment,
    handleDeleteComment,
    isFlaggedByMe,
  };
};

export default useComment;
