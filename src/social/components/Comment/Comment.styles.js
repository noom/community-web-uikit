/* eslint-disable import/no-cycle */
import React from 'react';
import Truncate from 'react-truncate-markup';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { POSITION_LEFT } from '~/helpers/getCssPosition';
import Button, { PrimaryButton } from '~/core/components/Button';
import CommentLikeButton from '~/social/components/CommentLikeButton';
import ConditionalRender from '~/core/components/ConditionalRender';
import CommentText from './CommentText';

import { backgroundImage as UserImage } from '~/icons/User';
import BanIcon from '~/icons/Ban';

import {
  Avatar,
  Content,
  CommentHeader,
  AuthorName,
  CommentDate,
  InteractionBar,
  ReplyIcon,
  ReplyButton,
  OptionMenu,
  CommentEditContainer,
  CommentEditTextarea,
  ButtonContainer,
  EditedMark,
  AccessCode,
  NameBlock,
} from './styles';
import { useDisclosure } from '@noom/wax-component-library';
import { StingModal } from '../Sting/StingModal';

const StyledComment = ({
  commentId,
  commentPath,
  authorId,
  authorName,
  authorAvatar,
  authorType,
  canDelete = false,
  canEdit = false,
  canLike = true,
  canReply = false,
  canReport = true,
  canLookup = false,
  canSting = false,
  createdAt,
  editedAt,
  text,
  markup,
  onClickReply,
  onClickUser,
  handleReportComment,
  handleEdit,
  startEditing,
  cancelEditing,
  handleDelete,
  handleLookup,
  handleOpenDash,
  isEditing,
  onChange,
  queryMentionees,
  isReported,
  isReplyComment,
  isBanned,
  mentionees,
  metadata,
  handleCopyPath,
  isOldStyle,
  displayAccessCode = false,
}) => {

  const { isOpen: isStingModalOpen, onOpen: onOpenStingModal, onClose: onCloseStingModal } = useDisclosure();

  const options = [
    canEdit && { name: isReplyComment ? 'reply.edit' : 'comment.edit', action: startEditing },
    canReport && {
      name: isReported ? 'report.undoReport' : 'report.doReport',
      action: handleReportComment,
    },
    canDelete && { name: isReplyComment ? 'reply.delete' : 'comment.delete', action: handleDelete },
    !!handleCopyPath && {
      name: 'post.copyPath',
      action: handleCopyPath,
    },
    canLookup && { name: 'post.manatee', action: handleLookup },
    canLookup && { name: 'post.dashboard', action: handleOpenDash },
    canSting && { name: 'post.sting', action: onOpenStingModal },
  ].filter(Boolean);

  const isEmpty = !markup || markup?.trim().length === 0;

  return (
    <>
      <Avatar
        displayName={authorName}
        avatar={authorAvatar}
        backgroundImage={UserImage}
        size={!isOldStyle && isReplyComment ? 'small' : 'regular'}
      />
      <Content>
        <Truncate
          ellipsis={
            <span>
              ...
              <CommentDate date={createdAt} />
              {editedAt - createdAt > 0 && (
                <EditedMark>
                  <FormattedMessage id="comment.edited" />
                </EditedMark>
              )}
            </span>
          }
          lines={2}
        >
          <CommentHeader>
            <NameBlock>
              <AuthorName isHighlighted={!!authorType} onClick={onClickUser}>
                {authorName} 
              </AuthorName>
              {displayAccessCode && <AccessCode>{` (${authorId})`}</AccessCode>}
            </NameBlock>
            <Truncate.Atom>
              {isBanned && <BanIcon css="margin-left: 0.265rem; margin-top: 1px;" />}
              <CommentDate date={createdAt} />
              {editedAt - createdAt > 0 && (
                <EditedMark>
                  <FormattedMessage id="comment.edited" />
                </EditedMark>
              )}
            </Truncate.Atom>
          </CommentHeader>
        </Truncate>

        <ConditionalRender condition={isEditing}>
          <CommentEditContainer>
            <CommentEditTextarea
              multiline
              mentionAllowed
              value={markup}
              mentionees={mentionees}
              queryMentionees={queryMentionees}
              onChange={onChange}
            />
            <ButtonContainer>
              <Button data-qa-anchor="comment-cancel-edit-button" onClick={cancelEditing}>
                <FormattedMessage id="cancel" />
              </Button>
              <PrimaryButton
                disabled={isEmpty}
                onClick={() => handleEdit(text)}
                data-qa-anchor="comment-save-edit-button"
              >
                <FormattedMessage id="save" />
              </PrimaryButton>
            </ButtonContainer>
          </CommentEditContainer>
          <CommentText
            text={text}
            mentionees={mentionees}
            metadata={metadata}
            isOldStyle={isOldStyle}
          />
        </ConditionalRender>

        {!isEditing && (canLike || canReply || options.length > 0) && (
          <InteractionBar>
            {canLike && <CommentLikeButton commentId={commentId} />}

            {canReply && (
              <ReplyButton data-qa-anchor="comment-reply-button" onClick={onClickReply}>
                <ReplyIcon /> <FormattedMessage id="reply" />
              </ReplyButton>
            )}

            <OptionMenu
              data-qa-anchor="comment-options-button"
              options={options}
              pullRight={false}
              align={POSITION_LEFT}
            />
          </InteractionBar>
        )}
      </Content>

      <StingModal
        userAccessCode={authorId}
        pathToContent={commentPath}
        isOpen={isStingModalOpen}
        onClose={onCloseStingModal}
      />
    </>
  );
};

StyledComment.propTypes = {
  commentId: PropTypes.string,
  commentPath: PropTypes.string,
  authorId: PropTypes.string,
  authorName: PropTypes.string,
  authorAvatar: PropTypes.string,
  canDelete: PropTypes.bool,
  canEdit: PropTypes.bool,
  canLike: PropTypes.bool,
  canReply: PropTypes.bool,
  canReport: PropTypes.bool,
  canLookup: PropTypes.bool,
  canSting: PropTypes.bool,
  createdAt: PropTypes.instanceOf(Date),
  editedAt: PropTypes.instanceOf(Date),
  text: PropTypes.string,
  markup: PropTypes.string,
  handleReportComment: PropTypes.func,
  handleEdit: PropTypes.func.isRequired,
  startEditing: PropTypes.func.isRequired,
  cancelEditing: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  handleLookup: PropTypes.func.isRequired,
  handleOpenDash: PropTypes.func.isRequired,
  mentionees: PropTypes.array,
  metadata: PropTypes.object,
  isEditing: PropTypes.bool,
  queryMentionees: PropTypes.func.isRequired,
  isReported: PropTypes.bool,
  isReplyComment: PropTypes.bool,
  isBanned: PropTypes.bool,
  onClickReply: PropTypes.func,
  onChange: PropTypes.func.isRequired,
  handleCopyPath: PropTypes.func,
  authorType: PropTypes.string,
  displayAccessCode: PropTypes.bool,
};

export default StyledComment;
