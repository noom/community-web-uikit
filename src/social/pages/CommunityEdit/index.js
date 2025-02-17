import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { ImageSize, FileRepository } from '@amityco/js-sdk';

import useUser from '~/core/hooks/useUser';
import withSDK from '~/core/hocs/withSDK';
import CommunityMembers from '~/social/components/CommunityMembers';
import CommunityPermissions from '~/social/components/CommunityPermissions';
import CommunityForm from '~/social/components/CommunityForm';
import { AddMemberModal } from '~/social/components/AddMemberModal';
import { PageTypes } from '~/social/constants';
import useCommunity from '~/social/hooks/useCommunity';
import useCommunityMembers from '~/social/hooks/useCommunityMembers';
import PageLayout from '~/social/layouts/Page';

import CommunityEditHeader from '~/social/components/community/EditPageHeader';
import { useNavigation } from '~/social/providers/NavigationProvider';
import { CloseCommunityAction, AddMemberAction } from './ExtraAction';
import { PageTabs, tabs } from './constants';
import { canCloseCommunity } from '~/helpers/permissions';

const CommunityEditPage = ({ communityId, tab, currentUserId }) => {
  const { onChangePage } = useNavigation();
  const [activeTab, setActiveTab] = useState(tab);
  const [addMemberModalOpen, setAddMemberModalOpen] = useState(false);

  const openAddMemberModal = () => setAddMemberModalOpen(true);
  const closeAddMemberModal = () => setAddMemberModalOpen(false);

  useEffect(() => setActiveTab(tab), [tab]);

  const { onClickCommunity } = useNavigation();
  const { community, updateCommunity } = useCommunity(communityId);
  const { members, addMembers } = useCommunityMembers(communityId);

  const { user } = useUser(currentUserId, [currentUserId]);

  const handleReturnToCommunity = () => onClickCommunity(communityId);

  const handleEditCommunity = async (data) => {
    await updateCommunity(data);
    handleReturnToCommunity();
  };

  const submitAddMembers = async ({ members }) => {
    await addMembers(members);
    closeAddMemberModal();
  };

  const renderAsideComponent = () => {
    switch (activeTab) {
      case PageTabs.EDIT_PROFILE:
        return (
          canCloseCommunity(user) ?
          <CloseCommunityAction
            communityId={communityId}
            onCommunityClosed={() => onChangePage(PageTypes.NewsFeed)}
          /> : <></>
        );
      case PageTabs.MEMBERS:
        return (
          <>
            <AddMemberAction action={openAddMemberModal} />

            {addMemberModalOpen && (
              <AddMemberModal
                usersToOmit={members}
                closeConfirm={closeAddMemberModal}
                community={community}
                onSubmit={submitAddMembers}
              />
            )}
          </>
        );
      default:
        return null;
    }
  };

  // TODO: this is temporary - we should use file.fileUrl when supported.
  const fileUrl = useMemo(
    () =>
      community.avatarFileId &&
      FileRepository.getFileUrlById({
        fileId: community.avatarFileId,
        imageSize: ImageSize.Small,
      }),
    [community.avatarFileId],
  );

  return (
    <PageLayout
      aside={renderAsideComponent()}
      header={
        <CommunityEditHeader
          avatarFileUrl={fileUrl}
          communityName={community?.displayName}
          tabs={tabs}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onReturnToCommunity={handleReturnToCommunity}
        />
      }
    >
      {activeTab === PageTabs.EDIT_PROFILE && !!community.communityId && (
        <CommunityForm
          data-qa-anchor="community-edit"
          community={community}
          edit
          onSubmit={(data) => handleEditCommunity(data)}
        />
      )}

      {activeTab === PageTabs.MEMBERS && <CommunityMembers communityId={communityId} />}

      {activeTab === PageTabs.PERMISSIONS && <CommunityPermissions communityId={communityId} />}
    </PageLayout>
  );
};

CommunityEditPage.propTypes = {
  communityId: PropTypes.string.isRequired,
  tab: PropTypes.oneOf(Object.values(PageTabs)),
  currentUserId: PropTypes.string.isRequired,
};

CommunityEditPage.defaultProps = {
  tab: PageTabs.EDIT_PROFILE,
};

export default withSDK(CommunityEditPage);
