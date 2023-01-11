import React from 'react';
import customizableComponent from '~/core/hocs/customization';
import withSDK from '~/core/hocs/withSDK';
import UICommunityPermissions from './CommunityPermissions';
import { usePermission } from './utils';
import useCommunity from '~/social/hooks/useCommunity';

function shouldCommentsBeDisabled(communityMetadata) {
  return communityMetadata?.areCommentsHidden && communityMetadata?.isCommentingDisabled;
}

const CommunityPermissions = ({ communityId }) => {
  const [needApprovalOnPostCreation, updateNeedApprovalOnPostCreation] = usePermission(
    communityId,
    'needApprovalOnPostCreation',
  );
  const { community, handleCommentingToggle } = useCommunity(communityId);

  return (
    <UICommunityPermissions
      needApprovalOnPostCreation={needApprovalOnPostCreation}
      onNeedApprovalOnPostCreationChange={updateNeedApprovalOnPostCreation}
      areCommentsDisabled={shouldCommentsBeDisabled(community?.metadata)}
      onDisableComments={handleCommentingToggle}
    />
  );
};

export default withSDK(customizableComponent('CommunityPermissions', CommunityPermissions));
