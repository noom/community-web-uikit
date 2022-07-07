import React, { ReactNode, ReactElement, Children, memo, cloneElement } from 'react';
import { Box, StyleProps, ButtonGroup, IconButton, ButtonProps } from '@noom/wax-component-library';
import { useSlate, ReactEditor } from 'slate-react';

import {
  withPlateEventProvider,
  getPluginType,
  MARK_BOLD,
  MARK_CODE,
  MARK_ITALIC,
  MARK_STRIKETHROUGH,
  MarkToolbarButton,
  usePlateEditorRef,
  ELEMENT_OL,
  ELEMENT_UL,
  ELEMENT_BLOCKQUOTE,
  ListToolbarButton,
  BlockToolbarButton,
  LinkToolbarButton,
} from '@udecode/plate';
import {
  MdFormatBold,
  MdFormatItalic,
  MdFormatListBulleted,
  MdFormatListNumbered,
  MdFormatQuote,
  MdFormatStrikethrough,
  MdCode,
  MdAddLink,
  MdLinkOff,
} from 'react-icons/md';
import { isMarkActive, toggleMark, isBlockActive, toggleBlock } from '../utils';

import { Editor, EditorValue } from '../models';

export type ToolbarProps = {
  isVisible?: boolean;
  isDisabled?: boolean;
  size?: ButtonProps['size'];
  colorScheme?: ButtonProps['colorScheme'];
};

// export const Toolbar = memo(
//   ({ children, isDisabled, size = 'sm', colorScheme, isVisible }: ToolbarProps) => {
//     return (
//       <ButtonGroup
//         size={size}
//         colorScheme={colorScheme}
//         spacing={1}
//         paddingY={1}
//         // CSS hide only to not break the link modal
//         display={isVisible ? 'flex' : 'none'}
//       >
//         {Children.toArray(children).map((child: ReactElement) =>
//           cloneElement(child, { isDisabled }),
//         )}
//       </ButtonGroup>
//     );
//   },
// );

// export function BlockButton({ format, icon, ...rest }) {
//   const editor = useSlate() as ReactEditor;

//   const isActive = isBlockActive(editor, format, 'type');

//   return (
//     <IconButton
//       {...rest}
//       title={format}
//       border="none"
//       colorScheme={isActive ? 'primary' : 'gray'}
//       onMouseDown={(event) => {
//         event.preventDefault();
//         toggleBlock(editor, format);
//       }}
//     >
//       {icon}
//     </IconButton>
//   );
// }

// export function MarkButton({ format, icon, ...rest }) {
//   const editor = useSlate() as ReactEditor;
//   const isActive = isMarkActive(editor, format);
//   return (
//     <IconButton
//       {...rest}
//       title={format}
//       border="none"
//       colorScheme={isActive ? 'primary' : 'gray'}
//       onMouseDown={(event) => {
//         event.preventDefault();
//         toggleMark(editor, format);
//       }}
//     >
//       {icon}
//     </IconButton>
//   );
// }

export const ToolbarWrap = withPlateEventProvider((props: StyleProps) => (
  <Box display="flex" mb={1} {...props} />
));

export const ToolbarButtons = () => {
  const editor = usePlateEditorRef<EditorValue, Editor>();

  if (!editor) {
    return null;
  }

  return (
    <>
      <MarkToolbarButton type={getPluginType(editor, MARK_BOLD)} icon={<MdFormatBold />} />
      <MarkToolbarButton type={getPluginType(editor, MARK_ITALIC)} icon={<MdFormatItalic />} />
      <MarkToolbarButton
        type={getPluginType(editor, MARK_STRIKETHROUGH)}
        icon={<MdFormatStrikethrough />}
      />
      <MarkToolbarButton type={getPluginType(editor, MARK_CODE)} icon={<MdCode />} />

      <BlockToolbarButton
        type={getPluginType(editor, ELEMENT_BLOCKQUOTE)}
        icon={<MdFormatQuote />}
      />
      <ListToolbarButton type={getPluginType(editor, ELEMENT_UL)} icon={<MdFormatListBulleted />} />
      <ListToolbarButton type={getPluginType(editor, ELEMENT_OL)} icon={<MdFormatListNumbered />} />
      <LinkToolbarButton icon={<MdAddLink />} />
    </>
  );
};

export const Toolbar = (props: ToolbarProps) => {
  return (
    <ToolbarWrap>
      <ToolbarButtons />
    </ToolbarWrap>
  );
};
