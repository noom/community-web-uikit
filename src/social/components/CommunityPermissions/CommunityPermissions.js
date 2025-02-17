import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import SwitchItem from './SwitchItem';
import {
  CommunityPermissionsBody,
  CommunityPermissionsContainer,
  CommunityPermissionsHeader,
} from './styles';

export default ({
  needApprovalOnPostCreation,
  onNeedApprovalOnPostCreationChange,
  areCommentsDisabled,
  onDisableComments,
  isAnonymous,
  onToggleAnonymous,
}) => {
  const { formatMessage } = useIntl();

  return (
    <>
      <CommunityPermissionsContainer>
        <CommunityPermissionsHeader>
          <FormattedMessage id="community.permissions.postReview" />
        </CommunityPermissionsHeader>

        <CommunityPermissionsBody>
          <SwitchItem
            value={needApprovalOnPostCreation}
            onChange={onNeedApprovalOnPostCreationChange}
            title={formatMessage({ id: 'community.permissions.approvePosts' })}
            prompt={formatMessage({ id: 'community.permissions.approvePosts.prompt' })}
          />
          <SwitchItem
            value={areCommentsDisabled}
            onChange={onDisableComments}
            title={formatMessage({ id: 'community.permissions.disableComments' })}
            prompt={formatMessage({ id: 'community.permissions.disableComments.prompt' })}
          />
        </CommunityPermissionsBody>
      </CommunityPermissionsContainer>
      <CommunityPermissionsContainer>
        <CommunityPermissionsHeader>
          <FormattedMessage id="community.permissions.anonymity" />
        </CommunityPermissionsHeader>

        <CommunityPermissionsBody>
          <SwitchItem
            value={isAnonymous}
            onChange={onToggleAnonymous}
            title={formatMessage({ id: 'community.permissions.anonymous' })}
            prompt={formatMessage({ id: 'community.permissions.anonymous.prompt' })}
          />
        </CommunityPermissionsBody>
      </CommunityPermissionsContainer>
    </>
  );
};
