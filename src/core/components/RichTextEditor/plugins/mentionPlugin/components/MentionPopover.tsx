import React, { useMemo, useEffect, useRef } from 'react';
import {
  Data,
  NoData,
  getPluginOptions,
  usePlateEditorRef,
  ELEMENT_MENTION,
  getMentionOnSelectItem,
  Combobox,
  ComboboxProps,
  comboboxStore,
  useEventEditorSelectors,
} from '@udecode/plate';

import { MentionPlugin, MentionItem } from '../models';

export interface MentionComboboxProps<TData extends Data = NoData>
  extends Partial<ComboboxProps<TData>> {
  editorId?: string;
  pluginKey?: string;
  onMentionSearchChange?: (search: string) => void;
  onMentionSelect?: (item: MentionItem, search: string) => void;
}

export const MentionPopover = <TData extends Data = NoData>({
  pluginKey = ELEMENT_MENTION,
  id = pluginKey,
  onMentionSearchChange,
  editorId,
  ...props
}: MentionComboboxProps<TData>) => {
  const search = useRef<string | null>('');
  const editor = usePlateEditorRef(editorId)!;

  const { trigger } = getPluginOptions<MentionPlugin>(editor, pluginKey);

  const activeId = comboboxStore.use.activeId();
  const focusedEditorId = useEventEditorSelectors.focus();

  const open = comboboxStore.use.isOpen();
  const text = comboboxStore.use.text();

  const isOpen = useMemo(() => {
    if (!open || focusedEditorId !== editor.id || activeId !== id) {
      return false;
    }
    return true;
  }, [open, activeId, id, focusedEditorId, editor.id]);

  // then is you are using a useEffect to fire off an async search it can be controlled like this

  useEffect(() => {
    if (text === null) {
      search.current = text;
      return;
    }
    if (isOpen && text !== search.current) {
      search.current = text;
      if (onMentionSearchChange) {
        onMentionSearchChange(text);
      }
    }
  }, [isOpen, text, search, onMentionSearchChange]);

  return (
    <Combobox
      id={id}
      trigger={trigger!}
      controlled
      onSelectItem={getMentionOnSelectItem({
        key: pluginKey,
      })}
      {...props}
    />
  );
};
