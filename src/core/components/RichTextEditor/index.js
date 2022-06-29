/* eslint-disable no-param-reassign */
import React, { useCallback, useMemo } from 'react';
import isHotkey from 'is-hotkey';
import { Editable, withReact, useSlate, Slate } from 'slate-react';
import { createEditor } from 'slate';
import { withHistory } from 'slate-history';
import {
  MdFormatBold,
  MdFormatItalic,
  MdFormatListBulleted,
  MdFormatListNumbered,
  MdFormatQuote,
  MdFormatAlignLeft,
  MdFormatAlignCenter,
  MdFormatAlignRight,
  MdFormatAlignJustify,
  MdFormatStrikethrough,
  MdCode,
  MdAddLink,
  MdLinkOff,
} from 'react-icons/md';

import { IconButton } from '@noom/wax-component-library';

import { isMarkActive, toggleMark, isBlockActive, toggleBlock } from './utils.ts';
import { TEXT_ALIGN_TYPES } from './constants.ts';
import { withInlines } from './enhancers.ts';
import { Toolbar, LinkButton, Mention } from './components/index.ts';

const HOTKEYS = {
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+u': 'underline',
  'mod+`': 'code',
};

const Element = ({ attributes, children, element }) => {
  const style = { textAlign: element.align };

  switch (element.type) {
    case 'block_quote':
      return (
        <blockquote style={style} {...attributes}>
          {children}
        </blockquote>
      );
    case 'ul_list':
      return (
        <ul style={style} {...attributes}>
          {children}
        </ul>
      );
    case 'heading_one':
      return (
        <h1 style={{ ...style, fontSize: '2em' }} {...attributes}>
          {children}
        </h1>
      );
    case 'heading_two':
      return (
        <h2 style={{ ...style, fontSize: '1.5em' }} {...attributes}>
          {children}
        </h2>
      );
    case 'heading_three':
      return (
        <h3 style={{ ...style, fontSize: '1.5em' }} {...attributes}>
          {children}
        </h3>
      );
    case 'list_item':
      return (
        <li style={style} {...attributes}>
          {children}
        </li>
      );
    case 'ol_list':
      return (
        <ol style={style} {...attributes}>
          {children}
        </ol>
      );
    case 'link':
      return (
        <a {...attributes} rel="noreferrer" href={element.link}>
          {children}
        </a>
      );
    case 'mentions':
      return <Mention attributes={attributes}>{children}</Mention>;
    default:
      return (
        <p style={style} {...attributes}>
          {children}
        </p>
      );
  }
};

const Leaf = ({ attributes, children, leaf }) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.code) {
    children = <code>{children}</code>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.strikeThrough) {
    children = <strike>{children}</strike>;
  }

  return <span {...attributes}>{children}</span>;
};

const RichTextEditor = ({ value, onChange, isReadOnly, isAlignmentEnabled = false }) => {
  const renderElement = useCallback((props) => <Element {...props} />, []);
  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);
  const editor = useMemo(() => withInlines(withHistory(withReact(createEditor()))), []);

  return (
    <Slate editor={editor} value={value} isReadOnly={isReadOnly} onChange={onChange}>
      <Toolbar>
        <MarkButton format="bold" icon={<MdFormatBold />} isDisabled={isReadOnly} />
        <MarkButton format="italic" icon={<MdFormatItalic />} isDisabled={isReadOnly} />
        <MarkButton
          format="strikeThrough"
          icon={<MdFormatStrikethrough />}
          isDisabled={isReadOnly}
        />
        <MarkButton format="code" icon={<MdCode />} isDisabled={isReadOnly} />
        <LinkButton
          format="link"
          icon={<MdAddLink />}
          activeIcon={<MdLinkOff />}
          isDisabled={isReadOnly}
        />
        <BlockButton format="heading_one" icon={<span>H1</span>} isDisabled={isReadOnly} />
        <BlockButton format="heading_two" icon={<span>H2</span>} isDisabled={isReadOnly} />
        <BlockButton format="heading_three" icon={<span>H3</span>} isDisabled={isReadOnly} />
        <BlockButton format="block_quote" icon={<MdFormatQuote />} isDisabled={isReadOnly} />
        <BlockButton format="ol_list" icon={<MdFormatListNumbered />} isDisabled={isReadOnly} />
        <BlockButton format="ul_list" icon={<MdFormatListBulleted />} isDisabled={isReadOnly} />
        {isAlignmentEnabled ? (
          <>
            <BlockButton format="left" icon={<MdFormatAlignLeft />} isDisabled={isReadOnly} />
            <BlockButton format="center" icon={<MdFormatAlignCenter />} isDisabled={isReadOnly} />
            <BlockButton format="right" icon={<MdFormatAlignRight />} isDisabled={isReadOnly} />
            <BlockButton format="justify" icon={<MdFormatAlignJustify />} isDisabled={isReadOnly} />
          </>
        ) : null}
      </Toolbar>
      <Editable
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        placeholder="Enter some rich text…"
        spellCheck
        autoFocus
        onKeyDown={(event) => {
          Object.keys(HOTKEYS).forEach((hotkey) => {
            if (isHotkey(hotkey, event)) {
              event.preventDefault();
              const mark = HOTKEYS[hotkey];
              toggleMark(editor, mark);
            }
          });
        }}
      />
    </Slate>
  );
};

const BlockButton = ({ format, icon, ...rest }) => {
  const editor = useSlate();

  const isActive = isBlockActive(
    editor,
    format,
    TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type',
  );

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
};

const MarkButton = ({ format, icon, ...rest }) => {
  const editor = useSlate();
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
};

export default RichTextEditor;
