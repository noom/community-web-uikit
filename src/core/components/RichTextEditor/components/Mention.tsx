import React, { useRef, useLayoutEffect, forwardRef } from 'react';
import { Link, Portal, Box } from '@noom/wax-component-library';

import { MentionTarget } from '../models.ts';
import { MentionSymbol } from '../constants.ts';

export type MentionProps = {
  children?: React.ReactNode;
  character?: string;
  target: MentionTarget;
  attributes?: any;
};

export const Mention = ({ attributes, character, target = 'user', children }) => {
  return (
    <Link
      {...attributes}
      contentEditable={false}
      data-cy={`mention-${character.replace(' ', '-')}`}
    >
      {children}
      {MentionSymbol[target]}
      {character}
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

export type MentionDropdownProps<TData = any> = {
  isOpen?: boolean;
  onSelect: (index: number) => void;
  data: TData[];
  position: {
    top?: number | string;
    left?: number | string;
  };
  renderItem: (props: MentionDropdownItemProps) => React.ReactNode;
  selectedIndex: number;
  setIndex: (index: number) => void;
};

export const MentionDropdown = ({
  isOpen,
  onSelect,
  data,
  renderItem,
  position,
  selectedIndex,
  setIndex,
}: MentionDropdownProps) => {
  if (!isOpen) {
    return null;
  }

  return (
    <Portal>
      <Box
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
        {data.map((dataItem, index) => {
          return (
            <Box key={index} onClick={() => onSelect(index)} onMouseOver={() => setIndex(index)}>
              {renderItem({
                data: dataItem,
                index,
                isSelected: index === selectedIndex,
              })}
            </Box>
          );
        })}
      </Box>
    </Portal>
  );
};
