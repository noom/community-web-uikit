/* eslint-disable no-param-reassign */
import { Transforms, Descendant } from 'slate';
import { ReactEditor } from 'slate-react';
import isEqual from 'lodash.isequal';

import {
  TElement,
  wrapNodes,
  insertNodes,
  isCollapsed,
  unwrapNodes,
  isEditor,
  isElement,
  ELEMENT_LINK,
  getPluginType,
  someNode,
  collapseSelection,
  getEditorString,
  insertText as insertEditorText,
} from '@udecode/plate';
import { Block, Editor, MentionElement, MentionTarget } from './models';

import { EMPTY_VALUE, Nodes } from './constants';

export function isBlock(item: unknown): item is Block {
  return isElement(item) && 'type' in item;
}

export function getSelectedText(editor: Editor) {
  if (editor.selection) {
    return getEditorString(editor, editor.selection);
  }

  return '';
}

export function isEmptyValue(value?: Descendant[]) {
  if (!value || value.length === 0) {
    return true;
  }

  return value.length === 1 && isEqual(EMPTY_VALUE, value[0]);
}

export function insertText(editor: Editor, text: string) {
  insertEditorText(editor, text);
}

export function isLinkActive(editor: Editor) {
  const type = getPluginType(editor, ELEMENT_LINK);
  const isLink = !!editor?.selection && someNode(editor, { match: { type } });

  return isLink;
}

export function removeLink(editor: Editor) {
  unwrapNodes(editor, {
    match: (n: Block) => !isEditor(n) && isElement(n) && n.type === ELEMENT_LINK,
  });
}

export function insertLink(editor: Editor, url: string, text?: string) {
  if (!editor.selection) {
    return;
  }

  if (isLinkActive(editor)) {
    removeLink(editor);
  }

  const type = getPluginType(editor, ELEMENT_LINK);

  if (isCollapsed(editor.selection)) {
    insertNodes<TElement>(editor, {
      type,
      url,
      children: [{ text: text || url }],
    });

    return;
  }
  unwrapNodes(editor, { at: editor.selection, match: { type } });

  wrapNodes(
    editor,
    {
      type,
      url,
      children: [],
    },
    { at: editor.selection, split: true },
  );
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

// export function insertFocusSaver(editor: WithFocusSaver<ReactEditor>) {
//   const currentSelection = editor.selection;
//   const hasSelection = !!currentSelection;

//   if (hasSelection) {
//     Editor.addMark(editor, Marks.FocusSaver, true);
//     editor.prevSelection = { ...currentSelection };
//   }
// }

// export function removeFocusSaver(editor: WithFocusSaver<ReactEditor>) {
//   const { prevSelection } = editor;

//   if (prevSelection) {
//     editor.prevSelection = undefined;
//     Editor.removeMark(editor, Marks.FocusSaver);
//   }
// }

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
