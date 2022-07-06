/* eslint-disable no-param-reassign */
import { Transforms, Node } from 'slate';
import { ReactEditor } from 'slate-react';

import { insertLink, isUrl, isBlock } from './utils';
import { Block } from './models';
import { Nodes } from './constants';

export function withInlined(editor: ReactEditor) {
  const { insertData, insertText, isInline, isVoid, normalizeNode } = editor;

  editor.isInline = (element: Block) =>
    ['link', 'mention'].includes(element.type) || isInline(element);

  editor.isVoid = (element: Block) => {
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

  editor.normalizeNode = (entry) => {
    const [node, path] = entry;

    // If the element is a paragraph, ensure its children are valid.
    if (isBlock(node) && node.type === Nodes.Paragraph) {
      Array.of(Node.children(editor, path)).forEach(([child, childPath]) => {
        if (isBlock(child) && !editor.isInline(child)) {
          Transforms.unwrapNodes(editor, { at: childPath[1] });
        }
      });
    }

    // Fall back to the original `normalizeNode` to enforce other constraints.
    normalizeNode(entry);
  };

  return editor;
}
