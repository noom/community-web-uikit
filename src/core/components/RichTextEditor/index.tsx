/* eslint-disable no-param-reassign */
import React, { useCallback, useMemo, useState, useLayoutEffect } from 'react';
import isHotkey, { isKeyHotkey } from 'is-hotkey';
import { Editable, withReact, useSlate, Slate, ReactEditor } from 'slate-react';
import { createEditor, Transforms, Range, Editor, Descendant } from 'slate';
import { withHistory } from 'slate-history';
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

import { Box, IconButton, Link, H1, H2, H3, List, ListItem } from '@noom/wax-component-library';

import { MentionTarget } from './models';
import {
  isMarkActive,
  toggleMark,
  isBlockActive,
  toggleBlock,
  insertMention,
  insertFocusSaver,
  removeFocusSaver,
} from './utils';
import { MentionSymbol, Marks, Nodes } from './constants';
import { withInlines } from './enhancers';
import {
  Toolbar,
  LinkButton,
  Mention,
  MentionDropdownItem,
  MentionDropdown,
  MentionDropdownItemProps,
} from './components/index';

const HOTKEYS = {
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+u': 'underline',
  'mod+`': 'code',
  'mod+shift+x': 'strikeThrough',
};

const CHARACTERS = [
  'Admiral Ozzel',
  'Admiral Raddus',
  'Admiral Terrinald Screed',
  'Admiral Trench',
  'Admiral U.O. Statura',
  'Agen Kolar',
  'Agent Kallus',
  'Aiolin and Morit Astarte',
  'Admiral Terrinald Screed',
  'Admiral Trench',
  'Admiral U.O. Statura',
  'Agen Kolar',
  'Agent Kallus',
  'Aiolin and Morit Astarte',
  'Aks Moe',
  'Bristina Temneanu',
  'Bridget Jones',
  'Tanvir Singh',
  'Tanya Roberts',
];

const HASHTAGS = [
  'KeepOnNoomin',
  'KebabIsGreenFood',
  'SaejuForPresident2024',
  'SaladHate',
  'SandPeople4Justice',
];

function getData(search: string, targetType: MentionTarget) {
  return (targetType === 'user' ? CHARACTERS : HASHTAGS)
    .filter((c) => c.toLowerCase().startsWith(search.toLowerCase()))
    .slice(0, 10);
}

function Element({ attributes, children, element }) {
  const style = { textAlign: element.align };

  switch (element.type) {
    case Nodes.BlockQuote:
      return (
        <blockquote style={style} {...attributes}>
          {children}
        </blockquote>
      );
    case Nodes.UnorderedList:
      return (
        <List style={style} {...attributes}>
          {children}
        </List>
      );
    case Nodes.HeadingOne:
      return (
        <H1 style={{ ...style, fontSize: '2em' }} {...attributes}>
          {children}
        </H1>
      );
    case Nodes.HeadingTwo:
      return (
        <H2 style={{ ...style, fontSize: '1.5em' }} {...attributes}>
          {children}
        </H2>
      );
    case Nodes.HeadingThree:
      return (
        <H3 style={{ ...style, fontSize: '1.5em' }} {...attributes}>
          {children}
        </H3>
      );
    case Nodes.ListItem:
      return (
        <ListItem style={style} {...attributes}>
          {children}
        </ListItem>
      );
    case Nodes.OrderedList:
      return (
        <List isOrdered style={style} {...attributes}>
          {children}
        </List>
      );
    case Nodes.Link:
      return (
        <Link {...attributes} rel="noreferrer" href={element.link}>
          {children}
        </Link>
      );
    case Nodes.Mention:
      return (
        <Mention attributes={attributes} character={element.character} target={element.target}>
          {children}
        </Mention>
      );
    default:
      return (
        <p style={style} {...attributes}>
          {children}
        </p>
      );
  }
}

function Leaf({ attributes, children, leaf }) {
  if (leaf[Marks.Bold]) {
    children = <strong>{children}</strong>;
  }

  if (leaf[Marks.Code]) {
    children = <code>{children}</code>;
  }

  if (leaf[Marks.Italic]) {
    children = <em>{children}</em>;
  }

  if (leaf[Marks.Strike]) {
    children = <s>{children}</s>;
  }

  if (leaf[Marks.FocusSaver]) {
    children = (
      <Box as="span" bg="primary.500">
        {children}
      </Box>
    );
  }

  return <span {...attributes}>{children}</span>;
}

function BlockButton({ format, icon, ...rest }) {
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

function MarkButton({ format, icon, ...rest }) {
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

type RichTextEditorProps = {
  value: any;
  onChange: (value: Descendant[]) => void;
  mentionAllowed?: boolean;
  queryMentionees?: () => [];
  loadMoreMentionees?: () => [];
  placeholder?: string;
  isReadOnly?: boolean;
  isAlignmentEnabled?: boolean;
};

function useMentionDropdownPosition(editor: ReactEditor, target?: Range) {
  const [position, setPosition] = useState({ top: '-9999px', left: '-9999px' });

  // Calculate dropdown position
  useLayoutEffect(() => {
    if (target) {
      const domRange = ReactEditor.toDOMRange(editor, target);
      const rect = domRange.getBoundingClientRect();

      setPosition({
        top: `${rect.top + window.pageYOffset + 24}px`,
        left: `${rect.left + window.pageXOffset}px`,
      });
    }
  }, [editor, target]);

  return position;
}

function useMentions(editor: ReactEditor, onSubmit: (data: any) => void) {
  const [target, setTarget] = useState<Range | undefined>();
  const [targetType, setTargetType] = useState<MentionTarget | undefined>();
  const [index, setIndex] = useState(0);
  const [search, setSearch] = useState('');

  function onEditorChange() {
    const { selection } = editor;

    if (selection && Range.isCollapsed(selection)) {
      const [start] = Range.edges(selection);
      const wordBefore = Editor.before(editor, start, { unit: 'word' });
      const before = wordBefore && Editor.before(editor, wordBefore);
      const beforeRange = before && Editor.range(editor, before, start);
      const beforeText = beforeRange && Editor.string(editor, beforeRange);
      const searchRegex = new RegExp(`([${Object.values(MentionSymbol).join('')}])(\\w+)$`);
      const beforeMatch = beforeText && beforeText.match(searchRegex);
      const after = Editor.after(editor, start);
      const afterRange = Editor.range(editor, start, after);
      const afterText = Editor.string(editor, afterRange);
      const afterMatch = afterText.match(/^(\s|$)/);

      const mentionSymbol = beforeMatch?.[1];
      const mentionTargetType = Object.keys(MentionSymbol).find(
        (key) => MentionSymbol[key] === mentionSymbol,
      );

      if (beforeMatch && afterMatch) {
        setTarget(beforeRange);
        setSearch(beforeMatch[2]);
        setTargetType(mentionTargetType as MentionTarget);
        setIndex(0);
        return;
      }
    }

    setTarget(undefined);
  }

  const data = targetType ? getData(search, targetType) : [];

  function onSelectIndex(selectedIndex: number) {
    if (target) {
      Transforms.select(editor, target);
      insertMention(editor, data[selectedIndex], targetType); // TODO insert real mention
      onSubmit(data[selectedIndex]);
      setTarget(undefined);
    }
  }

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (target) {
        switch (event.key) {
          case 'ArrowDown':
            event.preventDefault();
            // Previous index
            setIndex(Math.min(index + 1, data.length - 1));
            break;
          case 'ArrowUp':
            event.preventDefault();
            // Next index
            setIndex(Math.max(index - 1, 0));
            break;
          case 'Tab':
          case 'Enter':
            event.preventDefault();
            onSelectIndex(index);
            break;
          case 'Escape':
            event.preventDefault();
            setTarget(undefined);
            break;
          default:
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [index, search, target],
  );

  return {
    data,
    target,
    index,
    search,
    targetType,
    onEditorChange,
    onKeyDown,
    setIndex,
    onSelectIndex,
  };
}

function defaultOnKeyDown(editor: ReactEditor, event: React.KeyboardEvent) {
  const { selection } = editor;

  Object.keys(HOTKEYS).forEach((hotkey) => {
    if (isHotkey(hotkey, event)) {
      event.preventDefault();
      const mark = HOTKEYS[hotkey];
      toggleMark(editor, mark);
    }
  });

  if (selection) {
    const { nativeEvent } = event;
    if (isKeyHotkey('left', nativeEvent)) {
      event.preventDefault();
      Transforms.collapse(editor, { edge: 'start' });
      Transforms.move(editor, { unit: 'offset', reverse: true });
      return;
    }
    if (isKeyHotkey('right', nativeEvent)) {
      event.preventDefault();
      Transforms.collapse(editor, { edge: 'end' });
      Transforms.move(editor, { unit: 'character' });
    }
  }
}

function RichTextEditor({ value, onChange, isReadOnly, placeholder }: RichTextEditorProps) {
  const renderElement = useCallback((props) => <Element {...props} />, []);
  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);
  const editor: ReactEditor = useMemo(
    () => withInlines(withHistory(withReact<any>(createEditor()))),
    [],
  );

  const {
    data,
    index,
    target,
    setIndex,
    onEditorChange,
    onKeyDown: onKeyDownMentions,
    onSelectIndex,
  } = useMentions(editor, (mentionData) => {
    console.log(mentionData);
  });

  const mentionDropdownPosition = useMentionDropdownPosition(editor, target);

  function handleChange(val: Descendant[]) {
    onEditorChange();
    onChange(val);
  }

  const onFocus = React.useCallback(() => {
    removeFocusSaver(editor);
  }, [editor]);

  const onBlur = React.useCallback(() => {
    insertFocusSaver(editor);
  }, [editor]);

  return (
    <Slate editor={editor} value={value} onChange={(val) => handleChange(val)}>
      <Toolbar>
        <MarkButton format={Marks.Bold} icon={<MdFormatBold />} isDisabled={isReadOnly} />
        <MarkButton format={Marks.Italic} icon={<MdFormatItalic />} isDisabled={isReadOnly} />
        <MarkButton
          format={Marks.Strike}
          icon={<MdFormatStrikethrough />}
          isDisabled={isReadOnly}
        />
        <MarkButton format={Marks.Code} icon={<MdCode />} isDisabled={isReadOnly} />
        <LinkButton
          format={Nodes.Link}
          icon={<MdAddLink />}
          activeIcon={<MdLinkOff />}
          isDisabled={isReadOnly}
        />
        <BlockButton format={Nodes.HeadingOne} icon={<span>H1</span>} isDisabled={isReadOnly} />
        <BlockButton format={Nodes.HeadingTwo} icon={<span>H2</span>} isDisabled={isReadOnly} />
        <BlockButton format={Nodes.HeadingThree} icon={<span>H3</span>} isDisabled={isReadOnly} />
        <BlockButton format={Nodes.BlockQuote} icon={<MdFormatQuote />} isDisabled={isReadOnly} />
        <BlockButton
          format={Nodes.OrderedList}
          icon={<MdFormatListNumbered />}
          isDisabled={isReadOnly}
        />
        <BlockButton
          format={Nodes.UnorderedList}
          icon={<MdFormatListBulleted />}
          isDisabled={isReadOnly}
        />
      </Toolbar>
      <Editable
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        placeholder={placeholder}
        spellCheck
        autoFocus
        onFocus={onFocus}
        onBlur={onBlur}
        onKeyDown={(event) => {
          defaultOnKeyDown(editor, event);
          onKeyDownMentions(event);
        }}
      />
      <MentionDropdown
        selectedIndex={index}
        setIndex={setIndex}
        position={mentionDropdownPosition}
        isOpen={target && data.length > 0}
        data={data}
        renderItem={(props: MentionDropdownItemProps<string>) => (
          <MentionDropdownItem {...props} key={props.index} />
        )}
        onSelect={(i) => onSelectIndex(i)}
      />
    </Slate>
  );
}

export default RichTextEditor;
