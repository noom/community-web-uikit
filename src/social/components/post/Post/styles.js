import cx from 'classnames';
import React from 'react';
import styled from 'styled-components';
import UIOptionMenu from '~/core/components/OptionMenu';
import Skeleton from '~/core/components/Skeleton';

export const OptionMenu = UIOptionMenu;

export const PostContainer = styled(({ className, isHighlighted, ...props }) => (
  <div className={cx('post', className)} {...props} />
))`
  padding: 1rem;
  padding-bottom: 0;
  background: ${({ theme }) => theme.palette.system.background};
  border: 1px solid #edeef2;
  border-radius: 0;
  position: relative;

  ${({ isHighlighted, theme }) =>
    isHighlighted &&
    `padding-top: 3rem
  `}
`;

export const PostHighlight = styled.div`
  color: white;
  text-transform: uppercase;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  ${({ theme }) => theme.typography.label}

  ${({ theme }) =>
    `background-color: ${theme.palette.primary.main};
  `}
  padding: 0.25rem 0.5rem;
`;

export const PostHeadContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

export const ReviewButtonsContainer = styled.div`
  border-top: 1px solid ${({ theme }) => theme.palette.base.shade4};
  margin-top: 6px;
  padding-top: 12px;
  display: flex;

  > * {
    flex: 1 1 0;

    &:not(:first-child) {
      margin-left: 12px;
    }
  }
`;

export const ContentSkeleton = () => {
  return (
    <>
      <div>
        <Skeleton style={{ fontSize: 8, maxWidth: 374 }} />
      </div>
      <div>
        <Skeleton style={{ fontSize: 8, maxWidth: 448 }} />
      </div>
      <div style={{ paddingBottom: 50 }}>
        <Skeleton style={{ fontSize: 8, maxWidth: 279 }} />
      </div>
    </>
  );
};
