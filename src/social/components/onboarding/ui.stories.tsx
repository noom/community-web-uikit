import React from 'react';

import { OnboardingModal as UIOnboardingModal, OnboardingModalProps } from './OnboardingModal';

export default {
  title: 'Ui Only',
};

export const OnboardingModal = ({ ...props }: OnboardingModalProps) => {
  return <UIOnboardingModal {...props} />;
};

const argTypes = {
  isLoading: { control: { type: 'boolean' } },
  isOpen: { control: { type: 'boolean' } },
  onClose: { action: 'onClose' },
  error: { control: { type: 'text' } },
};

const args = {
  isLoading: false,
  isOpen: true,
};

OnboardingModal.argTypes = argTypes;
OnboardingModal.args = args;
