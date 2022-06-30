import { MentionTarget } from './models.ts';

export const LIST_TYPES = ['ol_list', 'ul_list'];
export const TEXT_ALIGN_TYPES = ['left', 'center', 'right', 'justify'];
export const MentionSymbol: Record<MentionTarget, string> = {
  user: '@',
  tag: '#',
};
