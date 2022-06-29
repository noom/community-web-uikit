/* eslint-disable no-param-reassign */
import { ReactEditor } from 'slate-react';

import { insertLink, isUrl } from './utils.ts';

export function withInlines(editor: ReactEditor) {
  const { insertData, insertText, isInline, isVoid } = editor;

  editor.isInline = (element) => ['link', 'mention'].includes(element.type) || isInline(element);

  editor.isVoid = (element) => {
    return element.type === 'mention' ? true : isVoid(element);
  };

  editor.insertText = (text) => {
    if (text && isUrl(text)) {
      insertLink(editor, text);
    } else {
      insertText(text);
    }
  };

  editor.insertData = (data) => {
    const text = data.getData('text/plain');

    if (text && isUrl(text)) {
      insertLink(editor, text);
    } else {
      insertData(data);
    }
  };

  return editor;
}
