import React, {
  useCallback,
  useMemo,
  useState,
  useLayoutEffect,
  ReactNode,
  useEffect,
} from 'react';
import isHotkey from 'is-hotkey';
import { Editable, withReact, Slate, ReactEditor } from 'slate-react';
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
import { Box, Size, ColorScheme } from '@noom/wax-component-library';

import { MentionTarget } from '../models';
import {
  toggleMark,
  insertMention,
  insertFocusSaver,
  removeFocusSaver,
  isEmptyValue,
  calculateRowStyles,
  breakoutBlock,
} from '../utils';
import { MentionSymbol, Marks, Nodes, EMPTY_VALUE } from '../constants';
import { withInlined } from '../enhancers';
import {
  MarkButton,
  BlockButton,
  Element,
  Leaf,
  Toolbar,
  LinkButton,
  MentionDropdown,
  renderMentionItem,
} from '.';

const HOTKEYS = {
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+u': 'underline',
  'mod+`': 'code',
  'mod+shift+x': 'strikeThrough',
};

type RichTextEditorProps = {
  id?: string;
  name?: string;
  value?: Descendant[];
  rows?: number;
  maxRows?: number;
  onClick?: () => void;
  onClear?: () => void;
  onChange: (data: { value: Descendant[]; lastMentionText?: string; mentions: any[] }) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onKeyPress?: (event: React.KeyboardEvent) => void;
  mentionAllowed?: boolean;
  queryMentionees?: () => [];
  loadMoreMentionees?: () => [];
  placeholder?: string;
  isDisabled?: boolean;
  isInvalid?: boolean;
  isToolbarVisible?: boolean;
  prepend?: ReactNode;
  append?: ReactNode;
  size?: Size;
  colorScheme?: ColorScheme;
  autoFocus?: boolean;
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

function useMentions(
  editor: ReactEditor,
  onSubmit: (data: any) => void,
  query?: (search: string, callback: (data: any) => void) => any[],
) {
  const [target, setTarget] = useState<Range | undefined>();
  const [targetType, setTargetType] = useState<MentionTarget | undefined>();
  const [index, setIndex] = useState(0);
  const [search, setSearch] = useState('');
  const [activeQuerySearch, setActiveQuerySearch] = useState<string | undefined>(undefined);
  const [data, setData] = useState([]);

  useEffect(() => {
    if (search && target && search !== activeQuerySearch) {
      setActiveQuerySearch(search);
      query?.(search, setData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, target, activeQuerySearch]);

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
    if (isHotkey('left', event)) {
      event.preventDefault();
      Transforms.collapse(editor, { edge: 'start' });
      Transforms.move(editor, { unit: 'character', reverse: true });
      return;
    }
    if (isHotkey('right', event)) {
      event.preventDefault();
      Transforms.collapse(editor, { edge: 'end' });
      Transforms.move(editor, { unit: 'character' });
    }
    if (isHotkey('Enter', event)) {
      breakoutBlock(editor, () => {
        event.preventDefault();
      });
    }
  }
}

function RichTextEditor({
  id,
  name,
  value = [EMPTY_VALUE],
  rows,
  maxRows,
  onChange,
  onClear,
  onClick,
  onFocus,
  onBlur,
  onKeyPress,
  isDisabled,
  isInvalid,
  placeholder,
  prepend,
  append,
  size,
  colorScheme,
  isToolbarVisible = true,
  autoFocus = false,
  queryMentionees,
  loadMoreMentionees,
}: RichTextEditorProps) {
  const renderElement = useCallback((props) => <Element {...props} />, []);
  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);
  const editor = useMemo(
    () => withInlined(withHistory(withReact(createEditor() as ReactEditor))),
    [],
  );

  const {
    data,
    index,
    search,
    target,
    setIndex,
    onEditorChange,
    onKeyDown: onKeyDownMentions,
    onSelectIndex,
  } = useMentions(
    editor,
    (mentionData) => {
      console.log(mentionData);
    },
    queryMentionees,
    loadMoreMentionees,
  );

  const mentionDropdownPosition = useMentionDropdownPosition(editor, target);

  function handleChange(val: Descendant[]) {
    if (isEmptyValue(val)) {
      onClear?.();
    }
    onEditorChange();
    onChange({ value, lastMentionText: search, mentions: [] });
  }

  const handleFocus = React.useCallback(() => {
    onFocus?.();
    removeFocusSaver(editor);
  }, [editor, onFocus]);

  const handleBlur = React.useCallback(() => {
    onBlur?.();
    insertFocusSaver(editor);
  }, [editor, onBlur]);

  return (
    <Slate editor={editor} value={value} onChange={(val) => handleChange(val)}>
      <Toolbar
        isVisible={isToolbarVisible}
        isDisabled={isDisabled}
        size={size}
        colorScheme={colorScheme}
      >
        <MarkButton format={Marks.Bold} icon={<MdFormatBold />} />
        <MarkButton format={Marks.Italic} icon={<MdFormatItalic />} />
        <MarkButton format={Marks.Strike} icon={<MdFormatStrikethrough />} />
        <MarkButton format={Marks.Code} icon={<MdCode />} />
        <LinkButton format={Nodes.Link} icon={<MdAddLink />} activeIcon={<MdLinkOff />} />
        <BlockButton format={Nodes.HeadingOne} icon={<span>H1</span>} />
        <BlockButton format={Nodes.HeadingTwo} icon={<span>H2</span>} />
        <BlockButton format={Nodes.HeadingThree} icon={<span>H3</span>} />
        <BlockButton format={Nodes.BlockQuote} icon={<MdFormatQuote />} />
        <BlockButton format={Nodes.OrderedList} icon={<MdFormatListNumbered />} />
        <BlockButton format={Nodes.UnorderedList} icon={<MdFormatListBulleted />} />
      </Toolbar>

      <Box
        paddingX={1}
        border="1px solid"
        borderColor={isInvalid ? 'error.500' : 'gray.200'}
        boxSizing="border-box"
        borderRadius="md"
      >
        {prepend}
        <Editable
          id={id}
          name={name}
          onClick={onClick}
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          placeholder={placeholder}
          spellCheck
          autoFocus={autoFocus}
          readOnly={isDisabled}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={(event) => {
            onKeyPress?.(event);
            defaultOnKeyDown(editor, event);
            onKeyDownMentions(event);
          }}
          style={calculateRowStyles(rows, maxRows)}
        />
        {append}
      </Box>
      <MentionDropdown
        selectedIndex={index}
        setIndex={setIndex}
        position={mentionDropdownPosition}
        isOpen={target && data.length > 0}
        data={data}
        renderItem={renderMentionItem}
        onSelect={(i) => onSelectIndex(i)}
        loadMore={loadMoreMentionees}
      />
    </Slate>
  );
}

export default RichTextEditor;
