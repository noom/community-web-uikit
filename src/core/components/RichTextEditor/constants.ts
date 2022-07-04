import { MentionTarget } from './models.ts';

export const MentionSymbol: Record<MentionTarget, string> = {
  user: '@',
  tag: '#',
};

export const Marks = {
  Bold: 'bold',
  Code: 'code',
  Italic: 'italic',
  Strike: 'strikeThrough',
  FocusSaver: 'focusSaver',
} as const;

export const Nodes = {
  BlockQuote: 'block_quote',
  HeadingOne: 'heading_one',
  HeadingTwo: 'heading_two',
  HeadingThree: 'heading_three',
  ListItem: 'list_item',
  Link: 'link',
  Mention: 'mention',
  OrderedList: 'ol_list',
  UnorderedList: 'ul_list',
  Paragraph: 'paragraph',
} as const;

export const LIST_TYPES = [Nodes.OrderedList, Nodes.UnorderedList];
