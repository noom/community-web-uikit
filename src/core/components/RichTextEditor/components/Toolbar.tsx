import React from 'react';
import { ButtonGroup } from '@noom/wax-component-library';

export const Toolbar = ({ children }) => {
  return (
    <ButtonGroup size="md" spacing={1} paddingY={1}>
      {children}
    </ButtonGroup>
  );
};
