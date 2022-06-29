/* eslint-disable no-param-reassign */
import { ReactEditor } from 'slate-react';

import { wrapLink, isUrl } from './utils.ts';

export function withInlines(editor: ReactEditor) {
  const { insertData, insertText, isInline } = editor;

  editor.isInline = (element) => ['link', 'button'].includes(element.type) || isInline(element);

  editor.insertText = (text) => {
    if (text && isUrl(text)) {
      wrapLink(editor, text);
    } else {
      insertText(text);
    }
  };

  editor.insertData = (data) => {
    const text = data.getData('text/plain');

    if (text && isUrl(text)) {
      wrapLink(editor, text);
    } else {
      insertData(data);
    }
  };

  return editor;
}
