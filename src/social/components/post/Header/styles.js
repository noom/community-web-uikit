import styled, { css } from 'styled-components';
import { ArrowRight, Shield } from '~/icons';

export const PostHeaderContainer = styled.div`
  display: flex;
  align-items: center;
`;

export const PostInfo = styled.div`
  margin-left: 8px;
`;

export const Name = styled.div`
  ${({ theme }) => theme.typography.title}

  word-break: break-all;

  &.clickable {
    &:hover {
      cursor: pointer;
    }
  }

  ${({ isHighlighted, theme }) =>
    isHighlighted &&
    `
    color: ${theme.palette.primary.main}
  `}
`;

export const AccessCode = styled.div`
  ${({ theme }) => theme.typography.body}

  word-break: break-all;

  color: #c3c4c3;
`;

export const ArrowSeparator = styled(ArrowRight).attrs({
  height: '8px',
  width: '8px',
})`
  color: ${({ theme }) => theme.palette.base.shade1};
`;

export const ShieldIcon = styled(Shield).attrs({
  height: '14px',
  width: '14px',
})`
  margin-right: 4px;
`;

export const ModeratorBadge = styled.div`
  display: flex;
  align-items: center;
  margin-right: 4px;
  color: ${({ theme }) => theme.palette.base.shade1};
  ${({ theme }) => theme.typography.captionBold};
`;

export const MessageContainer = styled.div`
  color: ${({ theme }) => theme.palette.base.shade1};
  ${({ theme }) => theme.typography.caption}

  &::before {
    content: '• ';
    margin-left: 4px;
  }
`;

export const PostTarget = styled.div`
  color: ${({ theme }) => theme.palette.base.main};
  font-weight: 500;

  &::after {
    content: '•';
    margin-left: 4px;
    margin-right: 4px;
  }
`;

export const AdditionalInfo = styled.div`
  display: flex;
  align-items: center;

  ${({ showTime }) =>
    showTime &&
    css`
      & > ${ModeratorBadge} {
        &::after {
          content: '•';
          margin-left: 4px;
        }
      }
    `};
`;

export const PostNamesContainer = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;

  > :not(:first-child) {
    margin-left: 0.25rem;
  }
`;
