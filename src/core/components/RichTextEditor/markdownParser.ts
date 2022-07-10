import { unified } from 'unified';
import markdown from 'remark-parse';
import remarkGfm from 'remark-gfm';
import slate, { serialize, defaultNodeTypes } from 'remark-slate';
import { ELEMENT_BLOCKQUOTE, ELEMENT_MENTION, isElement, ELEMENT_PARAGRAPH } from '@udecode/plate';

import { MentionSymbol } from './plugins/mentionPlugin';

import { EMPTY_VALUE } from './constants';
import {
  EditorValue,
  Descendant,
  Element,
  BlockquoteElement,
  ParagraphElement,
  MentionElement,
} from './models';

const DEFAULT_HEADINGS = {
  1: 'h1',
  2: 'h2',
  3: 'h3',
  4: 'h4',
  5: 'h5',
  6: 'h6',
};

const SERIALIZE_OPTS = {
  nodeTypes: {
    ...defaultNodeTypes,
    paragraph: 'p',
    heading: { ...DEFAULT_HEADINGS },
    link: 'a',
    block_quote: 'blockquote',
    ul_list: 'ul',
    ol_list: 'ol',
    listItem: 'li',
    emphasis_mark: 'italic',
    strong_mark: 'bold',
    delete_mark: 'strikeThrough',
    inline_code_mark: 'code',
  },
};

function transformNodes(
  slateNode: Descendant,
  transformations: typeof serializeTransformElement,
): Descendant {
  const node =
    isElement(slateNode) && typeof transformations[slateNode.type] === 'function'
      ? transformations[slateNode.type]?.(slateNode)
      : slateNode;

  if (isElement(node) && node.children) {
    return {
      ...node,
      children: node.children.map((child) => transformNodes(child, transformations)),
    } as Descendant;
  }

  return node as Descendant;
}

const deserializeTransformElement: Partial<Record<Element['type'], (el: Element) => Descendant>> = {
  [ELEMENT_BLOCKQUOTE]: (el: BlockquoteElement) =>
    ({
      type: ELEMENT_BLOCKQUOTE,
      children:
        el.children?.[0].type === ELEMENT_PARAGRAPH
          ? (el.children?.[0] as unknown as ParagraphElement).children
          : el.children,
    } as BlockquoteElement),
};

export function markdownToSlate(markdownText: string): EditorValue {
  if (markdownText === '') {
    return [EMPTY_VALUE];
  }

  const slateState = unified()
    .use(markdown)
    .use(remarkGfm)
    .use(slate, SERIALIZE_OPTS)
    .processSync(markdownText).result as EditorValue;

  const processedState = slateState.map((node) =>
    transformNodes(node, deserializeTransformElement),
  );

  return processedState as EditorValue;
}

const serializeTransformElement: Partial<Record<Element['type'], (el: Element) => Descendant>> = {
  [ELEMENT_MENTION]: (el: MentionElement) => ({ text: `${MentionSymbol[el.type]}${el.value}` }),
};

export function slateToMarkdown(slateState: EditorValue) {
  return slateState
    .map((v) => transformNodes(v, serializeTransformElement))
    .map((v) => serialize(v as any, SERIALIZE_OPTS as any))
    .join('')
    .replaceAll('<br>', '')
    .trim();
}
