import React, { useState } from 'react';

import RichTextEditor from './index.tsx';

import { markdownToSlate, slateToMarkdown } from './markdownParser';

export default {
  title: 'Ui Only/RichTextEditor',
};

const initialValue = markdownToSlate('This is **bold** and _italic_ and ~~strike through~~ text');

export const RichText = ({ onChange, ...rest }) => {
  const [value, setValue] = useState(initialValue);

  const handleChange = (newVal) => {
    onChange(slateToMarkdown(newVal));
    setValue(newVal);
  };

  return (
    <RichTextEditor
      {...rest}
      placeholder="What is on your mind?"
      value={value}
      onChange={handleChange}
    />
  );
};

RichText.storyName = 'Simple Input text';

RichText.args = {
  isMultiline: false,
  isInvalid: false,
  isDisabled: false,
  rows: 3,
  maxRows: 5,
};

RichText.argTypes = {
  isMultiline: { control: { type: 'boolean' } },
  isInvalid: { control: { type: 'boolean' } },
  isDisabled: { control: { type: 'boolean' } },
  rows: { control: { type: 'number' } },
  maxRows: { control: { type: 'number' } },
  onClear: { action: 'onClear()' },
  onChange: { action: 'onChange()' },
  onClick: { action: 'onClick()' },
  onKeyPress: { action: 'onKeyPress()' },
};
