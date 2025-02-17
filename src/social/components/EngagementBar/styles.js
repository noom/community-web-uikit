import styled from 'styled-components';
import { Comment } from '~/icons';

export const EngagementBarContainer = styled.div`
  color: ${({ theme }) => theme.palette.neutral.shade1};
  ${({ theme }) => theme.typography.body}
`;

export const Counters = styled.div`
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #e3e4e8;
  padding: 8px 0;

  ${({ isHighlighted, theme }) =>
    isHighlighted &&
    `
    border-color: ${theme.palette.primary.main};
    margin: 0 -1rem;
    padding: 8px 1rem;
  `}
`;

export const InteractionBar = styled.div`
  display: flex;
  padding: 2px 0;
`;

export const CommentIcon = styled(Comment).attrs({ width: 16, height: 16 })`
  position: relative;
  margin-right: 5px;
`;

export const NoInteractionMessage = styled.div`
  color: ${({ theme }) => theme.palette.base.shade2};
  margin-top: 0.5rem;
  text-align: center;

  ${({ noMargin }) =>
    noMargin &&
    `
    margin: 0;
  `}
`;
