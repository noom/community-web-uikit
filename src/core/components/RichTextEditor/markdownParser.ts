import { unified } from 'unified';
import markdown from 'remark-parse';
import remarkGfm from 'remark-gfm';
import slate, { serialize, BlockType, LeafType } from 'remark-slate';

import { EMPTY_VALUE, Nodes, MentionSymbol } from './constants';
import { MentionElement } from './models';
import { isBlock } from './utils';

export function markdownToSlate(markdownText: string): (BlockType | LeafType)[] {
  if (markdownText === '') {
    return [EMPTY_VALUE];
  }

  const slateState = unified().use(markdown).use(remarkGfm).use(slate).processSync(markdownText)
    .result as (BlockType | LeafType)[];

  return slateState;
}

function mentionToText(slateNode: BlockType | LeafType): BlockType | LeafType {
  if (isBlock(slateNode)) {
    if (slateNode.type === Nodes.Mention) {
      return {
        text:
          MentionSymbol[(slateNode as MentionElement).target] +
          (slateNode as MentionElement).character,
      };
    }

    if (slateNode.children) {
      // eslint-disable-next-line no-param-reassign
      return {
        ...slateNode,
        children: slateNode.children.map((child) => mentionToText(child)),
      };
    }
  }

  return slateNode;
}

export function slateToMarkdown(slateState: (BlockType | LeafType)[]) {
  return slateState
    .map((v) => serialize(v))
    .join('')
    .replaceAll('<br>', '')
    .trim();
}
