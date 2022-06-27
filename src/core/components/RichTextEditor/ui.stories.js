import React, { useState } from 'react';

import RichTextEditor from '.';

export default {
  title: 'Ui Only/RichTextEditor',
};

const initialValue = [
  {
    type: 'paragraph',
    children: [
      { text: 'This is editable ' },
      { text: 'rich', bold: true },
      { text: ' text, ' },
      { text: 'much', italic: true },
      { text: ' better than a ' },
      { text: '<textarea>', code: true },
      { text: '!' },
    ],
  },
  {
    type: 'paragraph',
    children: [
      {
        text: "Since it's rich text, you can do things like turn a selection of text ",
      },
      { text: 'bold', bold: true },
      {
        text: ', or add a semantically rendered block quote in the middle of the page, like this:',
      },
    ],
  },
  {
    type: 'block-quote',
    children: [{ text: 'A wise quote.' }],
  },
  {
    type: 'paragraph',
    align: 'center',
    children: [{ text: 'Try it out for yourself!' }],
  },
];

export const RichText = ({ onChange, ...rest }) => {
  const [value, setValue] = useState(initialValue);

  const handleChange = (newVal) => {
    onChange(newVal);
    setValue(newVal);
  };

  return <RichTextEditor {...rest} value={value} onChange={handleChange} />;
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
