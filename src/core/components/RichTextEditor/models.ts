import { Descendant, Editor, BaseSelection, BaseElement } from 'slate';

export type GenericElement = BaseElement & {
  type: string;
};

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

export type MentionElement = {
  type: 'mention';
  target: MentionTarget;
  character: string;
  children: CustomText[];
};

export type WithFocusSaver<TEditor extends Editor> = TEditor & { prevSelection?: BaseSelection };
