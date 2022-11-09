import React from 'react';
import {
  Box,
  List,
  ListItem,
  H1,
  Button,
  Text,
  ModalHeader,
  ModalBody,
  ModalContent,
  ModalFooter,
} from '@noom/wax-component-library';
import { FormattedMessage } from 'react-intl';

export type WelcomeViewProps = {};

export function WelcomeView(props: WelcomeViewProps) {
  return (
    <ModalContent>
      <ModalHeader>Header</ModalHeader>
      <ModalBody>
        <List>
          <ListItem>List item</ListItem>
        </List>
      </ModalBody>
      <ModalFooter>
        <Button isFullWidth colorScheme="primary" size="md">
          Click
        </Button>
      </ModalFooter>
    </ModalContent>
  );
}
