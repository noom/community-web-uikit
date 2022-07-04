import { Editor, Transforms, Element as SlateElement, Range } from 'slate';
import { ReactEditor } from 'slate-react';

import { LinkElement, MentionElement } from './models.ts';
import { LIST_TYPES, TEXT_ALIGN_TYPES } from './constants.ts';
import { MentionTarget } from './models';

export function getSelectedText(editor: ReactEditor) {
  if (editor.selection) {
    return Editor.string(editor, editor.selection);
  }
}

export function isUrl(url: string) {
  return /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$/.test(
    url,
  );
}

export function insertText(editor: ReactEditor, text: string) {
  Transforms.insertText(editor, text);
}

export function isMarkActive(editor: ReactEditor, format) {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
}

export function toggleMark(editor: ReactEditor, format) {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
}

export function isBlockActive(editor: ReactEditor, format, blockType = 'type') {
  const { selection } = editor;
  if (!selection) return false;

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && n[blockType] === format,
    }),
  );

  return !!match;
}

export function toggleBlock(editor: ReactEditor, format) {
  const isActive = isBlockActive(
    editor,
    format,
    TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type',
  );
  const isList = LIST_TYPES.includes(format);

  Transforms.unwrapNodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      LIST_TYPES.includes(n.type) &&
      !TEXT_ALIGN_TYPES.includes(format),
    split: true,
  });
  let newProperties;
  if (TEXT_ALIGN_TYPES.includes(format)) {
    newProperties = {
      align: isActive ? undefined : format,
    };
  } else {
    newProperties = {
      // eslint-disable-next-line no-nested-ternary
      type: isActive ? 'paragraph' : isList ? 'list_item' : format,
    };
  }
  Transforms.setNodes(editor, newProperties);

  if (!isActive && isList) {
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }
}

export function isLinkActive(editor: ReactEditor) {
  const [link] = Editor.nodes(editor, {
    match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === 'link',
  });
  return !!link;
}

export function removeLink(editor: ReactEditor) {
  Transforms.unwrapNodes(editor, {
    match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === 'link',
  });
}

export function insertLink(editor: ReactEditor, url: string, text?: string) {
  if (isLinkActive(editor)) {
    removeLink(editor);
  }

  const { selection } = editor;
  const isCollapsed = selection && Range.isCollapsed(selection);

  const link: LinkElement = {
    type: 'link',
    link: url,
    children: isCollapsed ? [{ text: text || url }] : [],
  };

  if (isCollapsed) {
    Transforms.insertNodes(editor, link);
  } else {
    Transforms.wrapNodes(editor, link, { split: true });
    Transforms.collapse(editor, { edge: 'end' });
  }
  Transforms.move(editor);
}

export function insertMention(
  editor: ReactEditor,
  character: string,
  target: MentionTarget = 'user',
) {
  const mention: MentionElement = {
    type: 'mention',
    character,
    target,
    children: [{ text: '' }],
  };
  Transforms.insertNodes(editor, mention);
  Transforms.move(editor);
}
