import React, { ReactNode, useState } from 'react';

import RichTextEditor from './components/Editor';
import { markdownToSlate, slateToMarkdown } from './markdownParser';

export type Props = {
  id?: string;
  name?: string;
  value?: string;
  rows?: number;
  maxRows?: number;
  onClick?: () => void;
  onClear?: () => void;
  onChange: (value: string) => void;
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
};

export function Editor({ disabled, invalid, value, onChange, ...rest }: Props) {
  const [editorValue, setValue] = useState(markdownToSlate(value ?? ''));

  const handleChange = (newVal) => {
    onChange(slateToMarkdown(newVal));
    setValue(newVal);
  };

  return (
    <RichTextEditor
      onChange={(val) => handleChange(val)}
      isDisabled={disabled}
      isInvalid={invalid}
      value={editorValue}
      {...rest}
    />
  );
}

export default Editor;
