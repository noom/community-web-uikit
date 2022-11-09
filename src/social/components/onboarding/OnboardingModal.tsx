import React from 'react';

import { Modal, ModalProps } from '@noom/wax-component-library';

import { WelcomeView } from './views/WelcomeView';

export type OnboardingModalProps = {} & ModalProps;

export function OnboardingModal({ ...props }: OnboardingModalProps) {
  return (
    <Modal {...props}>
      <WelcomeView />
    </Modal>
  );
}
