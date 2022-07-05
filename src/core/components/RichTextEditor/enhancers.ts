/* eslint-disable no-param-reassign */
import { ReactEditor } from 'slate-react';

import { insertLink, isUrl } from './utils';
import { GenericElement } from './models';

export function withInlines(editor: ReactEditor) {
  const { insertData, insertText, isInline, isVoid } = editor;

  editor.isInline = (element: GenericElement) =>
    ['link', 'mention'].includes(element.type) || isInline(element);

  editor.isVoid = (element: GenericElement) => {
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
