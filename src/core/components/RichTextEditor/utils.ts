/* eslint-disable no-param-reassign */
import {
  Editor,
  Transforms,
  Element as SlateElement,
  Range,
  Descendant,
  Node,
  BaseText,
} from 'slate';
import { ReactEditor } from 'slate-react';
import isEqual from 'lodash.isequal';

import {
  GenericElement,
  LinkElement,
  MentionElement,
  MentionTarget,
  WithFocusSaver,
} from './models';
import { LIST_TYPES, EMPTY_VALUE, Nodes, Marks, HEADING_TYPES } from './constants';

export function isElement(item: unknown): item is GenericElement {
  return SlateElement.isElement(item);
}

export function getSelectedText(editor: ReactEditor) {
  if (editor.selection) {
    return Editor.string(editor, editor.selection);
  }

  return '';
}

export function isEmptyValue(value?: Descendant[]) {
  if (!value || value.length === 0) {
    return true;
  }

  return value.length === 1 && isEqual(EMPTY_VALUE, value[0]);
}

export function isUrl(url: string) {
  return /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$/.test(
    url,
  );
}

export function insertText(editor: ReactEditor, text: string) {
  Transforms.insertText(editor, text);
}

export function isMarkActive(editor: ReactEditor, format: string) {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
}

export function toggleMark(editor: ReactEditor, format: string) {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
}

export function isBlockActive(editor: ReactEditor, format: string, blockType = 'type') {
  const { selection } = editor;
  if (!selection) return false;

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (n) => !Editor.isEditor(n) && isElement(n) && n[blockType] === format,
    }),
  );

  return !!match;
}

export function toggleBlock(editor: ReactEditor, format: string) {
  const isActive = isBlockActive(editor, format, 'type');
  const isList = (LIST_TYPES as string[]).includes(format);

  Transforms.unwrapNodes(editor, {
    match: (n: GenericElement) =>
      !Editor.isEditor(n) && isElement(n) && (LIST_TYPES as string[]).includes(n.type),
    split: true,
  });
  const newProperties = {
    // eslint-disable-next-line no-nested-ternary
    type: isActive ? Nodes.Paragraph : isList ? Nodes.ListItem : format,
  } as any;

  Transforms.setNodes(editor, newProperties);

  if (!isActive && isList) {
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }
}

export function isLinkActive(editor: ReactEditor) {
  const [link] = Editor.nodes(editor, {
    match: (n: GenericElement) => !Editor.isEditor(n) && isElement(n) && n.type === Nodes.Link,
  });
  return !!link;
}

export function removeLink(editor: ReactEditor) {
  Transforms.unwrapNodes(editor, {
    match: (n: GenericElement) => !Editor.isEditor(n) && isElement(n) && n.type === Nodes.Link,
  });
}

export function insertLink(editor: ReactEditor, url: string, text?: string) {
  if (isLinkActive(editor)) {
    removeLink(editor);
  }

  const { selection } = editor;
  const isCollapsed = selection && Range.isCollapsed(selection);

  const link: LinkElement = {
    type: Nodes.Link,
    link: url,
    children: isCollapsed ? [{ text: text || url }] : [],
  };

  if (isCollapsed) {
    Transforms.insertNodes(editor, [link, { text: '' }]);
    Transforms.move(editor);
  } else {
    Transforms.wrapNodes(editor, link, { split: true });
  }
}

export function insertMention(
  editor: ReactEditor,
  character: string,
  target: MentionTarget = 'user',
) {
  const mention: MentionElement = {
    type: Nodes.Mention,
    character,
    target,
    children: [{ text: '' }],
  };
  Transforms.insertNodes(editor, mention);
  Transforms.move(editor);
}

export function insertFocusSaver(editor: WithFocusSaver<ReactEditor>) {
  const currentSelection = editor.selection;
  const hasSelection = !!currentSelection;

  if (hasSelection) {
    Editor.addMark(editor, Marks.FocusSaver, true);
    editor.prevSelection = { ...currentSelection };
  }
}

export function removeFocusSaver(editor: WithFocusSaver<ReactEditor>) {
  const { prevSelection } = editor;

  if (prevSelection) {
    editor.prevSelection = undefined;
    Editor.removeMark(editor, Marks.FocusSaver);
  }
}

export function resetSelection(editor: ReactEditor) {
  const point = { path: [0, 0], offset: 0 };
  Transforms.select(editor, { anchor: point, focus: point });
}

export function calculateRowStyles(rows?: number, maxRows?: number) {
  if (!rows || !maxRows) {
    return {};
  }

  const adjustedRows = rows && maxRows && rows > maxRows ? maxRows : rows;

  return {
    overflow: 'auto',
    minHeight: adjustedRows ? `${adjustedRows * 3}em` : undefined,
    maxHeight: maxRows ? `${maxRows * 3}em` : undefined,
  };
}

// Break out of headings, links and empty lists on enter
export function breakoutBlock(editor: ReactEditor, onBreakout?: () => void) {
  const { selection } = editor;

  if (!selection) {
    return;
  }

  const selectedElement = Node.descendant(
    editor,
    selection.anchor.path.slice(0, -1),
  ) as GenericElement;

  const selectedLeaf = Node.descendant(editor, selection.anchor.path) as BaseText;

  if (([...HEADING_TYPES] as string[]).includes(selectedElement.type)) {
    if (selectedLeaf.text.length === selection.anchor.offset) {
      onBreakout?.();
      Transforms.insertNodes(editor, EMPTY_VALUE);
    }
  } else if (selectedElement.type === Nodes.ListItem) {
    if (selectedLeaf.text.length === 0 && selectedElement.children.length === 1) {
      const parentNode = Node.parent(editor, selection.anchor.path.slice(0, -1)) as GenericElement;
      onBreakout?.();
      toggleBlock(editor, parentNode.type);
    }
  }
}
