import { Descendant, Editor as SlateEditor, BaseSelection } from 'slate';
import { BlockType, LeafType } from 'remark-slate';

import {
  Decorate,
  DecorateEntry,
  DOMHandler,
  EDescendant,
  EElement,
  EElementEntry,
  EElementOrText,
  EMarks,
  ENode,
  ENodeEntry,
  EText,
  ETextEntry,
  InjectComponent,
  InjectProps,
  KeyboardHandler,
  OnChange,
  OverrideByKey,
  PlateEditor,
  PlatePlugin,
  PlatePluginInsertData,
  PlatePluginProps,
  PlateProps,
  PluginOptions,
  SerializeHtml,
  TElement,
  TImageElement,
  TLinkElement,
  TMentionElement,
  TMentionInputElement,
  TNodeEntry,
  TReactEditor,
  TText,
  TTodoListItemElement,
  WithOverride,
  ELEMENT_BLOCKQUOTE,
  ELEMENT_CODE_LINE,
  ELEMENT_H1,
  ELEMENT_H2,
  ELEMENT_H3,
  ELEMENT_LI,
  ELEMENT_LINK,
  ELEMENT_MENTION,
  ELEMENT_MENTION_INPUT,
  ELEMENT_OL,
  ELEMENT_PARAGRAPH,
  ELEMENT_TODO_LI,
  ELEMENT_UL,
  ELEMENT_IMAGE,
} from '@udecode/plate';

export type Block = BlockType;
export type Leaf = LeafType;
export type GenericElement = BlockType | LeafType;

export type BlockQuoteElement = {
  type: 'block_quote';
  align?: string;
  children: Descendant[];
};

export type BulletedListElement = {
  type: 'bulleted_list';
  align?: string;
  children: Descendant[];
};

export type HeadingOneElement = {
  type: 'heading_one';
  align?: string;
  children: Descendant[];
};

export type HeadingTwoElement = {
  type: 'heading_two';
  align?: string;
  children: Descendant[];
};

export type HeadingThreeElement = {
  type: 'heading_three';
  align?: string;
  children: Descendant[];
};

export type LinkElement = { type: 'link'; link: string; children: Descendant[] };

export type ListItemElement = { type: 'list_item'; children: Descendant[] };

export type CustomText = {
  bold?: boolean;
  italic?: boolean;
  code?: boolean;
  text: string;
};

export type MentionTarget = 'user' | 'tag';

export type MentionData = {
  avatar: string;
  display: string;
  id: string;
  isLastItem: boolean;
};

export type MentionElement = {
  type: 'mention';
  target: MentionTarget;
  character: string;
  children: CustomText[];
};

export type WithFocusSaver<TEditor extends SlateEditor> = TEditor & {
  prevSelection?: BaseSelection;
};

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

export interface MyLinkElement extends TLinkElement {
  type: typeof ELEMENT_LINK;
  children: RichText[];
}

export interface MyMentionInputElement extends TMentionInputElement {
  type: typeof ELEMENT_MENTION_INPUT;
  children: [PlainText];
}

export interface MyMentionElement extends TMentionElement {
  type: typeof ELEMENT_MENTION;
  children: [EmptyText];
}

export type MyInlineElement = MyLinkElement | MyMentionElement | MyMentionInputElement;
export type MyInlineDescendant = MyInlineElement | RichText;
export type MyInlineChildren = MyInlineDescendant[];

/**
 * Block props
 */

export interface MyBlockElement extends TElement {
  id?: string;
}

/**
 * Blocks
 */

export interface MyParagraphElement extends MyBlockElement {
  type: typeof ELEMENT_PARAGRAPH;
  children: MyInlineChildren;
}

export interface MyH1Element extends MyBlockElement {
  type: typeof ELEMENT_H1;
  children: MyInlineChildren;
}

export interface MyH2Element extends MyBlockElement {
  type: typeof ELEMENT_H2;
  children: MyInlineChildren;
}

export interface MyH3Element extends MyBlockElement {
  type: typeof ELEMENT_H3;
  children: MyInlineChildren;
}

export interface MyBlockquoteElement extends MyBlockElement {
  type: typeof ELEMENT_BLOCKQUOTE;
  children: MyInlineChildren;
}

export interface MyCodeLineElement extends TElement {
  type: typeof ELEMENT_CODE_LINE;
  children: PlainText[];
}

export interface MyBulletedListElement extends TElement, MyBlockElement {
  type: typeof ELEMENT_UL;
  children: MyListItemElement[];
}

export interface MyNumberedListElement extends TElement, MyBlockElement {
  type: typeof ELEMENT_OL;
  children: MyListItemElement[];
}

export interface MyListItemElement extends TElement, MyBlockElement {
  type: typeof ELEMENT_LI;
  children: MyInlineChildren;
}

export interface MyTodoListElement extends TTodoListItemElement, MyBlockElement {
  type: typeof ELEMENT_TODO_LI;
  children: MyInlineChildren;
}

export interface MyImageElement extends TImageElement, MyBlockElement {
  type: typeof ELEMENT_IMAGE;
  children: [EmptyText];
}

export type MyNestableBlock = MyParagraphElement;

export type MyBlock = Exclude<MyElement, MyInlineElement>;
export type MyBlockEntry = TNodeEntry<MyBlock>;

export type MyRootBlock =
  | MyParagraphElement
  | MyH1Element
  | MyH2Element
  | MyH3Element
  | MyBlockquoteElement
  | MyBulletedListElement
  | MyNumberedListElement
  | MyTodoListElement
  | MyImageElement;

export type EditorValue = MyRootBlock[];

/**
 * Editor types
 */

export type Editor = PlateEditor<EditorValue> & { isDragging?: boolean };
export type MyReactEditor = TReactEditor<EditorValue>;
export type MyNode = ENode<EditorValue>;
export type MyNodeEntry = ENodeEntry<EditorValue>;
export type MyElement = EElement<EditorValue>;
export type MyElementEntry = EElementEntry<EditorValue>;
export type MyText = EText<EditorValue>;
export type MyTextEntry = ETextEntry<EditorValue>;
export type MyElementOrText = EElementOrText<EditorValue>;
export type MyDescendant = EDescendant<EditorValue>;
export type MyMarks = EMarks<EditorValue>;
export type MyMark = keyof MyMarks;

/**
 * Plate types
 */

export type MyDecorate<P = PluginOptions> = Decorate<P, EditorValue, Editor>;
export type MyDecorateEntry = DecorateEntry<EditorValue>;
export type MyDOMHandler<P = PluginOptions> = DOMHandler<P, EditorValue, Editor>;
export type MyInjectComponent = InjectComponent<EditorValue>;
export type MyInjectProps = InjectProps<EditorValue>;
export type MyKeyboardHandler<P = PluginOptions> = KeyboardHandler<P, EditorValue, Editor>;
export type MyOnChange<P = PluginOptions> = OnChange<P, EditorValue, Editor>;
export type MyOverrideByKey = OverrideByKey<EditorValue, Editor>;
export type EditorPlugin<P = PluginOptions> = PlatePlugin<P, EditorValue, Editor>;
export type MyPlatePluginInsertData = PlatePluginInsertData<EditorValue>;
export type MyPlatePluginProps = PlatePluginProps<EditorValue>;
export type MyPlateProps = PlateProps<EditorValue, Editor>;
export type MySerializeHtml = SerializeHtml<EditorValue>;
export type MyWithOverride<P = PluginOptions> = WithOverride<P, EditorValue, Editor>;
