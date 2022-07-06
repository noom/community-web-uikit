/* eslint-disable no-param-reassign */
import React from 'react';
import { Box, Link, H1, H2, H3, List, ListItem } from '@noom/wax-component-library';
import { Marks, Nodes } from '../constants';
import { Mention } from './Mention';

export function Element({ attributes, children, element }) {
  const style = { textAlign: element.align };

  switch (element.type) {
    case Nodes.BlockQuote:
      return (
        <blockquote style={style} {...attributes}>
          {children}
        </blockquote>
      );
    case Nodes.UnorderedList:
      return (
        <List style={style} {...attributes}>
          {children}
        </List>
      );
    case Nodes.HeadingOne:
      return (
        <H1 style={{ ...style, fontSize: '2em' }} {...attributes}>
          {children}
        </H1>
      );
    case Nodes.HeadingTwo:
      return (
        <H2 style={{ ...style, fontSize: '1.5em' }} {...attributes}>
          {children}
        </H2>
      );
    case Nodes.HeadingThree:
      return (
        <H3 style={{ ...style, fontSize: '1.5em' }} {...attributes}>
          {children}
        </H3>
      );
    case Nodes.ListItem:
      return (
        <ListItem style={style} {...attributes}>
          {children}
        </ListItem>
      );
    case Nodes.OrderedList:
      return (
        <List isOrdered style={style} {...attributes}>
          {children}
        </List>
      );
    case Nodes.Link:
      return (
        <Link {...attributes} rel="noreferrer" href={element.link}>
          {children}
        </Link>
      );
    case Nodes.Mention:
      return (
        <Mention attributes={attributes} character={element.character} target={element.target}>
          {children}
        </Mention>
      );
    default:
      return (
        <p style={style} {...attributes}>
          {children}
        </p>
      );
  }
}

export function Leaf({ attributes, children, leaf }) {
  if (leaf[Marks.Bold]) {
    children = <strong>{children}</strong>;
  }

  if (leaf[Marks.Code]) {
    children = <code>{children}</code>;
  }

  if (leaf[Marks.Italic]) {
    children = <em>{children}</em>;
  }

  if (leaf[Marks.Strike]) {
    children = <s>{children}</s>;
  }

  if (leaf[Marks.FocusSaver]) {
    children = (
      <Box as="span" bg="primary.500">
        {children}
      </Box>
    );
  }

  return <span {...attributes}>{children}</span>;
}
