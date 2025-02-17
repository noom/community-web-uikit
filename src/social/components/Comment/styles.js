import styled from 'styled-components';
import UIOptionMenu from '~/core/components/OptionMenu';
import Time from '~/core/components/Time';
import InputText from '~/core/components/InputText';
import UICommentComposeBar from '~/social/components/CommentComposeBar';
import { SecondaryButton } from '~/core/components/Button';
import { MinusCircle, Reply } from '~/icons';

import UIAvatar from '~/core/components/Avatar';

export const Avatar = styled(UIAvatar)`
  margin-right: 8px;
`;

export const OptionMenu = styled(UIOptionMenu)`
  color: ${({ theme }) => theme.palette.neutral.main};
`;

export const CommentBlock = styled.div`
  &:not(:last-of-type) {
    border-bottom: 1px solid #e3e4e8;
  }
`;

const encodeHexColor = (hex) => hex.replace('#', '%23');

export const CommentContainer = styled.div`
  display: flex;
  color: black;
  padding-top: 16px;
`;

export const ReplyContainer = styled.div`
  display: flex;
  color: black;
  padding-top: 16px;
  padding-left: 40px;
`;

export const CommentComposeBar = styled(UICommentComposeBar)`
  border: none;
  padding: 8px 0 16px;
  background-repeat: no-repeat;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="40">
    <path d="M20 0 L 20 40" stroke="${({ theme }) => encodeHexColor(theme.palette.base.shade4)}"/>
  </svg>');
`;

export const Content = styled.div`
  width: 100%;
`;

export const CommentHeader = styled.div`
  word-break: break-all;
  margin-bottom: 5px;
`;

export const CommentContent = styled.div`
  overflow-wrap: anywhere !important;
  word-break: break-word;
  color: ${({ theme }) => theme.palette.neutral.main};
  border-radius: 0 12px 12px 12px;
  display: inline-block;
  white-space: pre-wrap;
  ${({ theme }) => theme.typography.body}
  ${({ isOldStyle, theme }) =>
    isOldStyle &&
    `
  background-color: ${theme.palette.background.main};
  padding: 12px;
  `}
`;

export const CommentInfo = styled.div`
  margin-left: 8px;
`;

export const AuthorName = styled.div`
  cursor: pointer;
  ${({ theme }) => theme.typography.body}
  font-weight: 500;
  ${({ isHighlighted, theme }) =>
    isHighlighted &&
    `
    color: ${theme.palette.primary.main}
  `}
`;

export const NameBlock = styled.div`
  display: flex;
`;

export const AccessCode = styled.div`
  ${({ theme }) => theme.typography.caption}

  color: #c3c4c3;
`;

export const CommentDate = styled(Time)`
  display: inline;

  color: ${({ theme }) => theme.palette.base.shade1};

  ${({ theme }) => theme.typography.caption}

  ${({ showSeparator }) =>
    showSeparator &&
    `
    &::before {
    content: '• ';
  }
  margin-left: 0.25rem;
  `}
`;

export const EditedMark = styled.span`
  margin-left: 0.25rem;
  color: ${({ theme }) => theme.palette.neutral.shade1};
  &::before {
    content: '• ';
  }
  ${({ theme }) => theme.typography.caption}
`;

export const ReadMoreButton = styled(SecondaryButton)`
  color: ${({ theme }) => theme.palette.primary.main};
  padding: 0 0 0 4px;

  &:hover {
    background: none;
    text-decoration: underline;
  }
`;

export const InteractionBar = styled.div`
  display: flex;
  align-items: center;
  padding: 2px 0;
  margin-left: -10px;
`;

export const DeletedCommentContainer = styled.div`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.palette.base.shade3};
  padding: 16px 0;

  &.reply {
    display: inline-flex;
    margin-left: 40px;
    background: ${({ theme }) => theme.palette.base.shade4};
    color: ${({ theme }) => theme.palette.base.shade2};
    border-radius: 4px;
    margin: 14px 0px;
    padding: 4px 8px 2px 0px;
  }
`;

export const DeletedReplyContainer = styled.div`
  display: inline-flex;
  align-items: center;
  margin: 7px 0px 7px 40px;
  color: ${({ theme }) => theme.palette.base.shade2};
  border-radius: 4px;
  padding: 4px 8px 2px 0px;
`;

export const DeletedIcon = styled(MinusCircle).attrs({ width: 18, height: 18 })``;

export const IconContainer = styled.div`
  display: flex;
  padding-right: 10px;

  &.reply {
    padding: 4px 10px 4px 4px;
  }
`;

export const MessageContainer = styled.div`
  display: flex;
  align-items: center;
`;

export const Text = styled.span`
  font-size: 14px;
`;

export const ReplyIcon = styled(Reply).attrs({ width: 16, height: 16 })`
  margin-right: 5px;
`;

export const ReplyButton = styled(SecondaryButton)``;

export const CommentEditContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 0.5rem;
  flex-wrap: wrap;
  gap: 0.5rem;

  @media (max-width: 960px) {
    > button {
      flex: 1;
      margin-left: 0;
    }
  }
`;

export const CommentEditTextarea = styled(InputText).attrs({ rows: 1, maxRows: 15 })`
  outline: none;
  border-radius: 4px;
  resize: none;
  ${({ theme }) => theme.typography.global}
`;
