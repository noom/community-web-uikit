import { unified } from 'unified';
import markdown from 'remark-parse';
import remarkGfm from 'remark-gfm';
import slate, { serialize, defaultNodeTypes } from 'remark-slate';
import {
  ELEMENT_BLOCKQUOTE,
  ELEMENT_MENTION,
  isElement,
  ELEMENT_PARAGRAPH,
  isText,
  ELEMENT_LI,
} from '@udecode/plate';

import { MentionSymbol } from './plugins/mentionPlugin/constants';
import { MentionOutput } from './plugins/mentionPlugin/models';

import { EMPTY_VALUE } from './constants';
import {
  EditorValue,
  Descendant,
  Element,
  BlockquoteElement,
  ParagraphElement,
  MentionElement,
  ListItemElement,
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

export function markdownToSlate(markdownText: string, mentions?: MentionOutput[]): EditorValue {
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
  // Render mentions as text
  [ELEMENT_MENTION]: (el: MentionElement) => ({
    text: `${MentionSymbol[el.mentionType]}${el.value}`,
  }),

  // Add space to list items
  [ELEMENT_LI]: (el: ListItemElement) =>
    ({
      type: ELEMENT_LI,
      children: el.children?.map((ch) =>
        isElement(ch) && ch.type === ELEMENT_PARAGRAPH
          ? { ...ch, children: [...(ch as ParagraphElement).children, { text: ' ' }] }
          : ch,
      ),
    } as ListItemElement),
};

function exportMentions(slateState: EditorValue, text: string): MentionOutput[] {
  const mentions = [] as MentionOutput[];
  const lastIndexRef = { current: 0 };
  const plainTextIndexRef = { current: 0 };

  function processDescendants(decendants: Descendant[]) {
    decendants.forEach((decendant) => {
      if (isElement(decendant)) {
        if (decendant.type === ELEMENT_MENTION) {
          const display = `${MentionSymbol[decendant.mentionType]}${decendant.value}`;
          const index =
            text.substring(lastIndexRef.current).indexOf(display) + lastIndexRef.current;

          mentions.push({
            id: decendant.id,
            display,
            index,
            plainTextIndex: index,
            childIndex: 0,
          });

          lastIndexRef.current = index + display.length;
        }

        if (decendant.children) {
          processDescendants(decendant.children);
        }
      } else if (isText(decendant)) {
        plainTextIndexRef.current += decendant.text?.length ?? 0;
      }
    });
  }

  processDescendants(slateState);

  return mentions;
}

export function slateToMarkdown(slateState: EditorValue) {
  const text = slateState
    .map((v) => transformNodes(v, serializeTransformElement))
    .map((v) => serialize(v as any, SERIALIZE_OPTS as any))
    .join('')
    .replaceAll('<br>', '')
    .trim();

  const mentions: MentionOutput[] = exportMentions(slateState, text);

  return { text, mentions };
}
