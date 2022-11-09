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
import { FormattedMessage, useIntl } from 'react-intl';

import { PrimaryButton } from '~/core/components/Button';

export type WelcomeViewProps = { isLoading?: boolean; error?: string };

export function WelcomeView({ isLoading }: WelcomeViewProps) {
  return (
    <ModalContent>
      <ModalHeader>
        <H1>
          <FormattedMessage id="onboarding.welcome.title" />
        </H1>
        <Text>
          <FormattedMessage id="onboarding.welcome.subTitle" />
        </Text>
      </ModalHeader>
      <ModalBody>
        <List>
          <ListItem>List item</ListItem>
        </List>
      </ModalBody>
      <ModalFooter>
        <PrimaryButton isFullWidth isLoading={isLoading}>
          <FormattedMessage id="onboarding.welcome.button" />
        </PrimaryButton>
      </ModalFooter>
    </ModalContent>
  );
}
