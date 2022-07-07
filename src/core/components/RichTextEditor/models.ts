import { Descendant, Editor, BaseSelection } from 'slate';
import { BlockType, LeafType } from 'remark-slate';

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

export type WithFocusSaver<TEditor extends Editor> = TEditor & { prevSelection?: BaseSelection };
