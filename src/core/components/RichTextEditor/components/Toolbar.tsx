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
  ELEMENT_H1,
  ELEMENT_H2,
  ELEMENT_H3,
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

import { LinkToolbarButton, UnLinkToolbarButton } from './LinkButton';

import { Editor, EditorValue } from '../models';

export type ToolbarProps = {
  isVisible?: boolean;
  isDisabled?: boolean;
  size?: ButtonProps['size'];
  colorScheme?: ButtonProps['colorScheme'];
};

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
      <UnLinkToolbarButton icon={<MdLinkOff />} />
      <BlockToolbarButton type={getPluginType(editor, ELEMENT_H1)} icon="H1" />
      <BlockToolbarButton type={getPluginType(editor, ELEMENT_H2)} icon="H2" />
      <BlockToolbarButton type={getPluginType(editor, ELEMENT_H3)} icon="H3" />
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
