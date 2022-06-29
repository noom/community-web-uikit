import React from 'react';

export const Mention = ({ attributes, children, element }) => {
  return (
    <span
      {...attributes}
      contentEditable={false}
      data-cy={`mention-${element.character.replace(' ', '-')}`}
    >
      {children}@{element.character}
    </span>
  );
};
