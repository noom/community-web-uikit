import { CommunityPostSettings } from '@amityco/js-sdk';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import { toHumanString } from '~/helpers/toHumanString';
import { CommunityFeedTabs } from './constants';

export function getTabs(postSetting, isJoined, canReview, isAnonymous, pendingPostCount = 0) {
  const tabs = [
    { value: CommunityFeedTabs.TIMELINE, label: <FormattedMessage id="tabs.timeline" /> },
    { value: CommunityFeedTabs.GALLERY, label: <FormattedMessage id="tabs.gallery" /> },
  ];

  if (!isAnonymous) {
    tabs.push({ value: CommunityFeedTabs.MEMBERS, label: <FormattedMessage id="tabs.members" /> });
  }

  if (isJoined && postSetting === CommunityPostSettings.ADMIN_REVIEW_POST_REQUIRED) {
    const amount = pendingPostCount;

    tabs.push({
      value: CommunityFeedTabs.PENDING,
      label: (
        <FormattedMessage
          id="tabs.pendingPosts"
          values={{ amount, formattedAmount: toHumanString(amount) }}
        />
      ),
    });
  }

  return tabs;
}
