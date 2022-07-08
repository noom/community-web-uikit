/* eslint-disable no-param-reassign */
import {
  createPluginFactory,
  setMarks,
  removeMark,
  isSelectionExpanded,
  withProps,
  setSelection,
} from '@udecode/plate';

import { Text } from '@noom/wax-component-library';

import { Editor, EditorValue } from '../models';

const FOCUS_SAVER_MARK = 'focus-saver';

export const createFocusSaverPlugin = createPluginFactory<EditorValue, any>({
  key: FOCUS_SAVER_MARK,
  isLeaf: true,
  handlers: {
    onBlur: (editor: Editor) => (event) => {
      event.preventDefault();
      const currentSelection = editor.selection;
      const hasSelection = !!currentSelection && isSelectionExpanded(editor);

      if (hasSelection) {
        setMarks(editor, { [FOCUS_SAVER_MARK]: true });
        editor.prevSelection = editor.selection || undefined;
      }
    },
    onFocus: (editor: Editor) => (event) => {
      event.preventDefault();
      const { prevSelection } = editor;
      if (prevSelection) {
        // setSelection(editor, prevSelection);

        removeMark(editor, {
          key: FOCUS_SAVER_MARK,
          shouldChange: false,
          mode: 'all',
        });

        editor.prevSelection = undefined;
      }
    },
  },
  component: withProps(Text, { bg: 'primary.300', color: 'white' }),
});
