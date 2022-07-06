import { unified } from 'unified';
import markdown from 'remark-parse';
import remarkGfm from 'remark-gfm';
import slate, { serialize } from 'remark-slate';

export function markdownToSlate(markdownText) {
  return unified().use(markdown).use(remarkGfm).use(slate).processSync(markdownText).result;
}

export function slateToMarkdown(slateState) {
  return slateState
    .map((v) => serialize(v))
    .join('')
    .replaceAll('<br>', '')
    .trim();
}
