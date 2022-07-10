import React, { useRef, useLayoutEffect, forwardRef } from 'react';
import { Link, Portal, Box } from '@noom/wax-component-library';

import SocialMentionItem from '~/core/components/SocialMentionItem';

import { MentionTarget } from '../models';
import { MentionSymbol } from '../constants';

export type MentionProps = {
  children?: React.ReactNode;
  character?: string;
  target: MentionTarget;
  attributes?: any;
};

export const Mention = (props: MentionProps) => {
  const { attributes, target = 'user', children, element } = props;

  console.log(props);

  const { value } = element;

  return (
    <Link {...attributes} contentEditable={false} data-cy={`mention-${value?.replace(' ', '-')}`}>
      {children}
      {MentionSymbol[target]}
      {value}
    </Link>
  );
};

export type MentionDropdownItemProps<TData = any> = {
  data: TData;
  index: number;
  onClick?: (index: number) => void;
  onMouseOver?: (index: number) => void;
  isSelected?: boolean;
};

const isVisible = (element: HTMLElement) => {
  const { bottom, top } = element.getBoundingClientRect();
  const containerRect = element.parentElement?.parentElement?.getBoundingClientRect();

  if (!containerRect || bottom <= containerRect.top || top >= containerRect.bottom) {
    return false;
  }

  return true;
};

export const MentionDropdownItem = forwardRef(
  ({ data, onClick, index, isSelected, onMouseOver }: MentionDropdownItemProps<string>) => {
    const ref = useRef<HTMLDivElement>(null);

    // Scroll selection into view
    useLayoutEffect(() => {
      if (isSelected && ref.current && !isVisible(ref.current)) {
        ref.current.scrollIntoView(false);
      }
    }, [isSelected]);

    return (
      <Box
        ref={ref}
        key={data}
        p={2}
        cursor="pointer"
        bg={isSelected ? 'primary.500' : undefined}
        color={isSelected ? 'white' : undefined}
        onClick={() => onClick?.(index)}
        onMouseOver={() => onMouseOver?.(index)}
      >
        {data}
      </Box>
    );
  },
);

export const renderMentionItem = (
  id: string,
  isFocused: boolean,
  isLastItem: boolean,
  loadMore: () => void,
  rootEl: React.MutableRefObject<HTMLElement | undefined>,
) => (
  <SocialMentionItem
    focused={isFocused}
    id={id}
    isLastItem={isLastItem}
    rootEl={rootEl}
    loadMore={loadMore}
  />
);

export type MentionDropdownProps<TData = any> = {
  isOpen?: boolean;
  onSelect: (index: number) => void;
  data: TData[];
  position: {
    top?: number | string;
    left?: number | string;
  };
  renderItem: typeof renderMentionItem;
  selectedIndex: number;
  setIndex: (index: number) => void;
  loadMore?: () => void;
};

export const MentionDropdown = ({
  isOpen,
  onSelect,
  data,
  renderItem,
  position,
  selectedIndex,
  setIndex,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  loadMore = () => {},
}: MentionDropdownProps) => {
  const parentRef = useRef<HTMLDivElement>();

  if (!isOpen) {
    return null;
  }

  return (
    <Portal>
      <Box
        ref={parentRef}
        top={position.top}
        left={position.left}
        position="absolute"
        zIndex={1}
        padding={1}
        bg="white"
        shadow="md"
        data-cy="mentions-portal"
        overflow="auto"
        maxH={200}
      >
        {data.map(({ id, isLastItem }, index) => {
          return (
            <Box key={id} onClick={() => onSelect(index)} onMouseOver={() => setIndex(index)}>
              {renderItem(id, index === selectedIndex, isLastItem, loadMore, parentRef)}
            </Box>
          );
        })}
      </Box>
    </Portal>
  );
};
