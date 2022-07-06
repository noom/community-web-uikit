import { unified } from 'unified';
import markdown from 'remark-parse';
import remarkGfm from 'remark-gfm';
import slate, { serialize, BlockType, LeafType } from 'remark-slate';

export function markdownToSlate(markdownText: string): (BlockType | LeafType)[] {
  return unified().use(markdown).use(remarkGfm).use(slate).processSync(markdownText).result as (
    | BlockType
    | LeafType
  )[];
}

export function slateToMarkdown(slateState: (BlockType | LeafType)[]) {
  return slateState
    .map((v) => serialize(v))
    .join('')
    .replaceAll('<br>', '')
    .trim();
}
