import React, { useState } from 'react';
import {
  ModalBody,
  ModalFooter,
  H3,
  Text,
  Box,
  ModalContent,
  ModalHeader,
} from '@noom/wax-component-library';
import { FormattedMessage } from 'react-intl';

import { PrimaryButton } from '~/core/components/Button';

import { Interest as InterestData } from '../models';
import { InterestSelect } from '../components/InterestSelect';

export type InterestSelectViewProps = {
  isLoading?: boolean;
  error?: string;
  interests?: InterestData[];
  onSubmit: (interests: InterestData[]) => void;
};

export function InterestSelectView({
  isLoading,
  onSubmit,
  interests = [],
}: InterestSelectViewProps) {
  const [selected, setSelected] = useState<InterestData[]>([]);

  return (
    <ModalContent>
      <ModalHeader>
        <H3 mb={2} fontWeight="500">
          <FormattedMessage id="onboarding.interests.title" />
        </H3>
        <Text size="md" fontWeight="normal">
          <FormattedMessage
            id="onboarding.interests.subTitle"
            values={{
              b: (text) => <b>{text}</b>,
            }}
          />
        </Text>
      </ModalHeader>
      <ModalBody display="flex" flexDir="column">
        <InterestSelect interests={interests} isDisabled={isLoading} onChange={setSelected} />
      </ModalBody>
      <ModalFooter>
        <PrimaryButton isFullWidth isLoading={isLoading} onClick={() => onSubmit(selected)}>
          <FormattedMessage id="onboarding.interests.button" />
        </PrimaryButton>
      </ModalFooter>
    </ModalContent>
  );
}
