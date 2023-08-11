import React, { createContext, useContext, useMemo } from 'react';
import { stripUndefinedValues } from '~/helpers/utils';

export type SocialConfiguration = {
  socialCommunityCreationButtonVisible?: boolean;
  showCreatePublicCommunityOption?: boolean;
  showUserProfileMetadata?: boolean;
  showOldStyleComments?: boolean;
  manateeUrl?: string;
  dashboardUrl?: string;
  isUserCurrentlyInStingDashCallback: (userAccessCode: string) => Promise<boolean>;
  addCoachNoteCallback: (userAccessCode: string, note: string) => Promise<boolean>;
  transferUserToStingCallback: (
    userAccessCode: string,
    optionalMessage?: string,
  ) => Promise<boolean>;
};

const defaultConfig = {
  socialCommunityCreationButtonVisible: true,
  showCreatePublicCommunityOption: false,
  showUserProfileMetadata: false,
  showOldStyleComments: false,
  manateeUrl: null,
  dashboardUrl: null,
  isUserCurrentlyInStingDashCallback: async (_uac: string) => false,
  addCoachNoteCallback: async (_uac: string, _note: string) => false,
  transferUserToStingCallback: async (_uac: string, _message?: string) => false,
};

const ConfigContext = createContext(defaultConfig);

export const useConfig = () => useContext(ConfigContext);

export default ({ children, config }) => {
  const value = useMemo(() => ({ ...defaultConfig, ...stripUndefinedValues(config) }), [config]);

  return <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>;
};
