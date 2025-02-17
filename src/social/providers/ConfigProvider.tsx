import React, { createContext, useContext, useMemo } from 'react';
import { stripUndefinedValues } from '~/helpers/utils';

export type SocialConfiguration = {
  socialCommunityCreationButtonVisible?: boolean;
  showCreatePublicCommunityOption?: boolean;
  showUserProfileMetadata?: boolean;
  showOldStyleComments?: boolean;
  showCreateCommunity?: boolean;
  manateeUrl?: string;
  dashboardUrl?: string;
  isUserCurrentlyInStingDashCallback: (userAccessCode: string) => Promise<boolean>;
  addCoachNoteCallback: (
    userAccessCode: string,
    userLocale: string,
    note: string,
  ) => Promise<boolean>;
  transferUserToStingCallback: (
    userAccessCode: string,
    userLocale: string,
    optionalMessage?: string,
  ) => Promise<boolean>;
  fetchNextPostInCommunity: (
    communityId: string,
    postId: string,
    direction: string,
  ) => Promise<string | undefined>;
};

const defaultConfig = {
  socialCommunityCreationButtonVisible: true,
  showCreatePublicCommunityOption: false,
  showUserProfileMetadata: false,
  showOldStyleComments: false,
  showCreateCommunity: false,
  manateeUrl: null,
  dashboardUrl: null,
  isUserCurrentlyInStingDashCallback: async (_uac: string) => false,
  addCoachNoteCallback: async (_uac: string, _userLocale: string, _note: string) => false,
  transferUserToStingCallback: async (_uac: string, _userLocale: string, _message?: string) =>
    false,
  fetchNextPostInCommunity: async (_cid: string, _pid: string, _dir: string) => '',
};

const ConfigContext = createContext(defaultConfig);

export const useConfig = () => useContext(ConfigContext);

export default ({ children, config }) => {
  const value = useMemo(() => ({ ...defaultConfig, ...stripUndefinedValues(config) }), [config]);

  return <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>;
};
