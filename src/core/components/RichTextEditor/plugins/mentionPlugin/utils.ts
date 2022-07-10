import { MentionData, MentionItem } from './models';

export function toMentionItem(data: MentionData): MentionItem {
  return {
    data,
    key: data.id,
    text: data.display,
  };
}

export function fromMentionItem(item: MentionItem): MentionData {
  return item.data;
}
