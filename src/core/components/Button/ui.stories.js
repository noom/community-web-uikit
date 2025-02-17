import React from 'react';
import UiKitButton from '.';

export default {
  title: 'Ui Only',
};

export const Button = ({ label, ...props }) => <UiKitButton {...props}>{label}</UiKitButton>;

Button.args = {
  label: 'hello world',
  variant: 'primary',
  disabled: false,
  isFullWidth: false,
};

Button.argTypes = {
  label: {
    control: {
      type: 'text',
    },
  },
  variant: {
    control: { type: 'select' },
    options: ['primary', 'secondary'],
  },
  disabled: {
    control: {
      type: 'boolean',
    },
  },
  isFullWidth: {
    control: {
      type: 'boolean',
    },
  },
  onClick: { action: 'onClick()' },
};
