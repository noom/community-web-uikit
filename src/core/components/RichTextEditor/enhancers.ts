import { Editor } from 'slate';

export function withInlines(editor: Editor) {
  const { isInline } = editor;

  editor.isInline = (element) => ['link'].includes(element.type) || isInline(element);

  return editor;
}
