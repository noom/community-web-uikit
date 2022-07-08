import {
  createBoldPlugin,
  createCodePlugin,
  createItalicPlugin,
  createStrikethroughPlugin,
  createPlugins,
  MARK_BOLD,
  MARK_CODE,
  MARK_ITALIC,
  MARK_STRIKETHROUGH,
  withProps,
} from '@udecode/plate';
import { Text } from '@noom/wax-component-library';

import { createFocusSaverPlugin } from './focusSaverPlugin';

import { EditorValue, Editor } from '../models';

export const defaultMarksPlugins = createPlugins<EditorValue, Editor>(
  [
    createBoldPlugin(),
    createCodePlugin(),
    createItalicPlugin(),
    createStrikethroughPlugin(),
    createFocusSaverPlugin(),
  ],
  {
    components: {
      [MARK_BOLD]: withProps(Text, { as: 'strong' }),
      [MARK_CODE]: withProps(Text, { as: 'code' }),
      [MARK_ITALIC]: withProps(Text, { as: 'em' }),
      [MARK_STRIKETHROUGH]: withProps(Text, { as: 's' }),
    },
  },
);
