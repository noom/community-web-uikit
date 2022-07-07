import React, { ReactNode, useState, useEffect } from 'react';

import RichTextEditor from './components/Editor';
import { markdownToSlate, slateToMarkdown } from './markdownParser';
import { Block } from './models';

export type Props = {
  id?: string;
  name?: string;
  value?: string;
  rows?: number;
  maxRows?: number;
  onClick?: () => void;
  onClear?: () => void;
  onChange: (data: {
    text: string;
    plainText: string;
    lastMentionText?: string;
    mentions: any[];
  }) => void;
  onKeyPress?: (event: React.KeyboardEvent) => void;
  mentionAllowed?: boolean;
  queryMentionees?: () => [];
  loadMoreMentionees?: () => [];
  placeholder?: string;
  disabled?: boolean;
  invalid?: boolean;
  multiline?: boolean;
  prepend?: ReactNode;
  append?: ReactNode;
  autoFocus?: boolean;
};

export function Editor({ disabled, invalid, value = '', onChange, ...rest }: Props) {
  const [cachedValue, setCachedValue] = useState(value);
  const [instanceNum, setInstanceNum] = useState(0);
  const [isFocused, setIsFocused] = useState(false);

  // Slate does not allow for value swapping. Yet Amity relies on it.
  // So we rerender the editor if the value unexpectedly changes.
  useEffect(() => {
    if (value !== cachedValue) {
      setInstanceNum(instanceNum + 1);
      setCachedValue(value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const handleChange = (data: { value: Block[]; lastMentionText: string }) => {
    const newMarkdown = slateToMarkdown(data.value);
    setCachedValue(newMarkdown);
    onChange({
      text: newMarkdown,
      plainText: newMarkdown,
      lastMentionText: data.lastMentionText,
      mentions: [],
    });
  };

  // To reduce visual clutter show toolbar on focus only
  const handleFocus = React.useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleBlur = React.useCallback(() => {
    setIsFocused(false);
  }, []);

  return (
    <RichTextEditor
      key={instanceNum}
      onChange={(data) => handleChange(data)}
      isDisabled={disabled}
      isInvalid={invalid}
      value={markdownToSlate(value)}
      onFocus={handleFocus}
      onBlur={handleBlur}
      isToolbarVisible={isFocused || cachedValue.length > 0}
      {...rest}
    />
  );
}

export default Editor;
