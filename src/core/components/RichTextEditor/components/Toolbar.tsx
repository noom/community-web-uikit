import React, { ReactNode, ReactElement, Children, memo, cloneElement } from 'react';
import { ButtonGroup, IconButton, ButtonProps } from '@noom/wax-component-library';
import { useSlate, ReactEditor } from 'slate-react';

import { isMarkActive, toggleMark, isBlockActive, toggleBlock } from '../utils';

export type ToolbarProps = {
  isVisible?: boolean;
  children: ReactNode;
  isDisabled?: boolean;
  size?: ButtonProps['size'];
  colorScheme?: ButtonProps['colorScheme'];
};

export const Toolbar = memo(
  ({ children, isDisabled, size = 'sm', colorScheme, isVisible }: ToolbarProps) => {
    return (
      <ButtonGroup
        size={size}
        colorScheme={colorScheme}
        spacing={1}
        paddingY={1}
        // CSS hide only to not break the link modal
        display={isVisible ? 'flex' : 'none'}
      >
        {Children.toArray(children).map((child: ReactElement) =>
          cloneElement(child, { isDisabled }),
        )}
      </ButtonGroup>
    );
  },
);

export function BlockButton({ format, icon, ...rest }) {
  const editor = useSlate() as ReactEditor;

  const isActive = isBlockActive(editor, format, 'type');

  return (
    <IconButton
      {...rest}
      title={format}
      border="none"
      colorScheme={isActive ? 'primary' : 'gray'}
      onMouseDown={(event) => {
        event.preventDefault();
        toggleBlock(editor, format);
      }}
    >
      {icon}
    </IconButton>
  );
}

export function MarkButton({ format, icon, ...rest }) {
  const editor = useSlate() as ReactEditor;
  const isActive = isMarkActive(editor, format);
  return (
    <IconButton
      {...rest}
      title={format}
      border="none"
      colorScheme={isActive ? 'primary' : 'gray'}
      onMouseDown={(event) => {
        event.preventDefault();
        toggleMark(editor, format);
      }}
    >
      {icon}
    </IconButton>
  );
}
