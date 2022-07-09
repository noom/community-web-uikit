import React, { ReactNode, useState } from 'react';

import RichTextEditor from './components/Editor';
import { markdownToSlate, slateToMarkdown } from './markdownParser';
import { MentionData, EditorValue } from './models';

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
    mentions: MentionData[];
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
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (data: {
    value: EditorValue;
    lastMentionText?: string;
    mentions: MentionData[];
  }) => {
    const newMarkdown = slateToMarkdown(data.value);
    console.log(data.value, newMarkdown);
    onChange({
      text: newMarkdown,
      plainText: newMarkdown,
      lastMentionText: data.lastMentionText,
      mentions: data.mentions,
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
      onChange={(data) => handleChange(data)}
      isDisabled={disabled}
      isInvalid={invalid}
      initialValue={markdownToSlate(value)}
      onFocus={handleFocus}
      onBlur={handleBlur}
      isToolbarVisible={isFocused}
      {...rest}
    />
  );
}

export default Editor;
