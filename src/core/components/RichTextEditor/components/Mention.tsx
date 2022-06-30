import React from 'react';
import { Link } from '@noom/wax-component-library';

import { MentionTarget } from '../models.ts';
import { MentionSymbol } from '../constants.ts';

export type MentionProps = {
  children?: React.ReactNode;
  character?: string;
  target: MentionTarget;
  attributes?: any;
};

export const Mention = ({ attributes, character, target = 'user', children }) => {
  return (
    <Link
      {...attributes}
      contentEditable={false}
      data-cy={`mention-${character.replace(' ', '-')}`}
    >
      {children}
      {MentionSymbol[target]}
      {character}
    </Link>
  );
};
