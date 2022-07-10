import { TElement, Data, NoData, CreateMentionNode, TComboboxItemWithData } from '@udecode/plate';

export type MentionTarget = 'mention' | 'tag';

export type MentionElement = TElement & {
  value: string;
};

export type MentionInputElement = TElement & {
  trigger: string;
};

export type MentionPlugin<TData extends Data = NoData> = {
  createMentionNode?: CreateMentionNode<TData>;
  id?: string;
  insertSpaceAfterMention?: boolean;
  trigger?: string;
  inputCreation?: { key: string; value: string };
};

export type MentionData = {
  avatar?: string;
  display: string;
  id: string;
  isLastItem: boolean;
};

export type MentionItem = TComboboxItemWithData<MentionData>;
