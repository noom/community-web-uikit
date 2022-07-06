import { unified } from 'unified';
import markdown from 'remark-parse';
import remarkGfm from 'remark-gfm';
import slate, { serialize, BlockType, LeafType } from 'remark-slate';

import { EMPTY_VALUE } from './constants';

export function markdownToSlate(markdownText: string): (BlockType | LeafType)[] {
  if (markdownText === '') {
    return [EMPTY_VALUE];
  }

  const slateState = unified().use(markdown).use(remarkGfm).use(slate).processSync(markdownText)
    .result as (BlockType | LeafType)[];

  return slateState;
}

export function slateToMarkdown(slateState: (BlockType | LeafType)[]) {
  return slateState
    .map((v) => serialize(v))
    .join('')
    .replaceAll('<br>', '')
    .trim();
}
