import { BaseRange } from 'slate';

import {
  EDescendant,
  EElement,
  EElementEntry,
  EElementOrText,
  EMarks,
  ENode,
  ENodeEntry,
  EText,
  ETextEntry,
  PlateEditor,
  PlatePlugin,
  PluginOptions,
  TElement,
  TImageElement,
  TLinkElement,
  TMentionElement,
  TMentionInputElement,
  TNodeEntry,
  TReactEditor,
  TText,
  TTodoListItemElement,
  ELEMENT_BLOCKQUOTE,
  ELEMENT_CODE_LINE,
  ELEMENT_H1,
  ELEMENT_H2,
  ELEMENT_H3,
  ELEMENT_LI,
  ELEMENT_LIC,
  ELEMENT_LINK,
  ELEMENT_MENTION,
  ELEMENT_MENTION_INPUT,
  ELEMENT_OL,
  ELEMENT_PARAGRAPH,
  ELEMENT_TODO_LI,
  ELEMENT_UL,
  ELEMENT_IMAGE,
} from '@udecode/plate';

export const MARK_STRIKETHROUGH = 'strikeThrough';

/**
 * Text
 */

export type EmptyText = {
  text: '';
};

export type PlainText = {
  text: string;
};

export interface RichText extends TText {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  code?: boolean;
  kbd?: boolean;
}

/**
 * Inline Elements
 */

export interface LinkElement extends TLinkElement {
  type: typeof ELEMENT_LINK;
  children: RichText[];
}

export interface MentionInputElement extends TMentionInputElement {
  type: typeof ELEMENT_MENTION_INPUT;
  children: [PlainText];
}

export interface MentionElement extends TMentionElement {
  type: typeof ELEMENT_MENTION;
  children: [EmptyText];
}

export type InlineElement = LinkElement | MentionElement | MentionInputElement;
export type InlineDescendant = InlineElement | RichText;
export type InlineChildren = InlineDescendant[];

/**
 * Block props
 */

export interface BlockElement extends TElement {
  id?: string;
}

/**
 * Blocks
 */

export interface ParagraphElement extends BlockElement {
  type: typeof ELEMENT_PARAGRAPH;
  children: InlineChildren;
}

export interface H1Element extends BlockElement {
  type: typeof ELEMENT_H1;
  children: InlineChildren;
}

export interface H2Element extends BlockElement {
  type: typeof ELEMENT_H2;
  children: InlineChildren;
}

export interface H3Element extends BlockElement {
  type: typeof ELEMENT_H3;
  children: InlineChildren;
}

export interface BlockquoteElement extends BlockElement {
  type: typeof ELEMENT_BLOCKQUOTE;
  children: InlineChildren;
}

export interface CodeLineElement extends TElement {
  type: typeof ELEMENT_CODE_LINE;
  children: PlainText[];
}

export interface BulletedListElement extends TElement, BlockElement {
  type: typeof ELEMENT_UL;
  children: ListItemElement[];
}

export interface NumberedListElement extends TElement, BlockElement {
  type: typeof ELEMENT_OL;
  children: ListItemElement[];
}

export interface ListItemElement extends TElement, BlockElement {
  type: typeof ELEMENT_LI;
  children: InlineChildren;
}

export interface ListItemContentElement extends TElement, BlockElement {
  type: typeof ELEMENT_LIC;
  children: InlineChildren;
}

export interface TodoListElement extends TTodoListItemElement, BlockElement {
  type: typeof ELEMENT_TODO_LI;
  children: InlineChildren;
}

export interface ImageElement extends TImageElement, BlockElement {
  type: typeof ELEMENT_IMAGE;
  children: [EmptyText];
}

export type MentionTarget = 'user' | 'tag';

export type MentionData = {
  avatar: string;
  display: string;
  id: string;
  isLastItem: boolean;
};

// export type MentionElement = {
//   type: 'mention';
//   target: MentionTarget;
//   character: string;
//   children: Text[];
// };

export type NestableBlock = ParagraphElement;

export type Block = Exclude<Element, InlineElement> | ListItemContentElement;
export type BlockEntry = TNodeEntry<Block>;

export type RootBlock =
  | ParagraphElement
  | H1Element
  | H2Element
  | H3Element
  | BlockquoteElement
  | BulletedListElement
  | NumberedListElement
  | TodoListElement
  | ImageElement;

export type EditorValue = RootBlock[];

/**
 * Editor types
 */

export type Editor = PlateEditor<EditorValue> & {
  isDragging?: boolean;
  prevSelection?: Partial<BaseRange>;
};
export type ReactEditor = TReactEditor<EditorValue>;
export type Node = ENode<EditorValue>;
export type NodeEntry = ENodeEntry<EditorValue>;
export type Element = EElement<EditorValue> | ListItemContentElement;
export type ElementEntry = EElementEntry<EditorValue>;
export type Text = EText<EditorValue>;
export type TextEntry = ETextEntry<EditorValue>;
export type ElementOrText = EElementOrText<EditorValue>;
export type Descendant = EDescendant<EditorValue>;
export type Marks = EMarks<EditorValue>;
export type Mark = keyof Marks;

/**
 * Plate types
 */

export type EditorPlugin<P = PluginOptions> = PlatePlugin<P, EditorValue, Editor>;
