import { PostRepository } from '@amityco/js-sdk';
import useMemoAsync from '~/core/hooks/useMemoAsync';

import usePostChildren from '~/social/hooks/usePostChildren';
import useLiveObject from '~/core/hooks/useLiveObject';
import useUser from '~/core/hooks/useUser';
import { useActionEvents } from '~/core/providers/ActionProvider';

const usePost = (postId) => {
  const post = useLiveObject(() => PostRepository.postForId(postId), [postId]);
  const isPostReady = !!post.postId;
  const { postedUserId, children } = post;
  const actionEvents = useActionEvents();

  const { user, file } = useUser(postedUserId);

  const handleUpdatePost = (data, props) => PostRepository.updatePost({ postId, data, ...props });

  const handleReportPost = () => PostRepository.flag(postId);
  const handleUnreportPost = () => PostRepository.unflag(postId);
  const handleDeletePost = () => PostRepository.deletePost(postId);
  const handleApprovePost = () => PostRepository.approvePost(postId);
  const handleDeclinePost = () => PostRepository.declinePost(postId);
  const handleCommentingToggle = () => {
    handleUpdatePost(post.data, {
      metadata: {
        ...post.metadata,
        areCommentsHidden: false,
        isCommentingDisabled: !post.metadata.isCommentingDisabled,
      },
    });

    actionEvents.onCommentsToggled?.({
      target: 'post',
      value: post.metadata.isCommentingDisabled ? 'on' : 'off',
    });
  };

  const childrenPosts = usePostChildren(children);

  const isFlaggedByMe = useMemoAsync(
    async () => (isPostReady ? PostRepository.isFlaggedByMe(post.postId) : false),
    [isPostReady, post],
  );

  return {
    isPostReady,
    post,
    user,
    file,
    handleUpdatePost,
    handleReportPost,
    handleUnreportPost,
    handleDeletePost,
    handleApprovePost,
    handleDeclinePost,
    childrenPosts,
    isFlaggedByMe,
    handleCommentingToggle,
  };
};

export default usePost;
