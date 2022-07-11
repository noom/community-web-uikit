import React, { ReactNode, useState } from 'react';

import RichTextEditor from './components/Editor';
import { markdownToSlate, slateToMarkdown } from './markdownParser';
import { EditorValue } from './models';
import { MentionOutput } from './plugins/mentionPlugin/models';

export type Props = {
  id: string;
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
    mentions: MentionOutput[];
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

export function Editor({ id, disabled, invalid, value = '', onChange, ...rest }: Props) {
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (data: { value: EditorValue }) => {
    const newMarkdown = slateToMarkdown(data.value);

    console.log(data.value, newMarkdown);

    onChange({
      text: newMarkdown.text,
      plainText: newMarkdown.text,
      lastMentionText: '',
      mentions: newMarkdown.mentions,
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
      id={id}
      onChange={(data) => handleChange(data)}
      isDisabled={disabled}
      isInvalid={invalid}
      initialValue={markdownToSlate(value)}
      onFocus={handleFocus}
      onBlur={handleBlur}
      // isToolbarVisible={isFocused}
      {...rest}
    />
  );
}

export default Editor;
