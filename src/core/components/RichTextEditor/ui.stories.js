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

  console.log(value);

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
  multiline: false,
  invalid: false,
  disabled: false,
};

RichText.argTypes = {
  multiline: { control: { type: 'boolean' } },
  invalid: { control: { type: 'boolean' } },
  disabled: { control: { type: 'boolean' } },
  onClear: { action: 'onClear()' },
  onChange: { action: 'onChange()' },
};
