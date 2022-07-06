import React, { ReactNode, useState, useEffect } from 'react';

import RichTextEditor from './components/Editor';
import { markdownToSlate, slateToMarkdown } from './markdownParser';
import { GenericElement } from './models';

export type Props = {
  id?: string;
  name?: string;
  value?: string;
  rows?: number;
  maxRows?: number;
  onClick?: () => void;
  onClear?: () => void;
  onChange: ({ text: string, plainText: string }) => void;
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

export function Editor({ disabled, invalid, value = '', onChange, ...rest }: Props) {
  const [cachedValue, setCachedValue] = useState(value);
  const [instanceNum, setInstanceNum] = useState(0);

  // Slate does not allow for value swapping. Yet Amity relies on it.
  // So we rerender the editor if the value unexpectedly changes.
  useEffect(() => {
    if (value !== cachedValue) {
      setInstanceNum(instanceNum + 1);
      setCachedValue(value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const handleChange = (newVal: GenericElement[]) => {
    const newMarkdown = slateToMarkdown(newVal);
    setCachedValue(newMarkdown);
    onChange({ text: newMarkdown, plainText: newMarkdown });
  };

  return (
    <RichTextEditor
      key={instanceNum}
      onChange={(val: GenericElement[]) => handleChange(val)}
      isDisabled={disabled}
      isInvalid={invalid}
      value={markdownToSlate(value)}
      {...rest}
    />
  );
}

export default Editor;
