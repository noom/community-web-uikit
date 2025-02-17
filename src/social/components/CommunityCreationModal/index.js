import React, { memo } from 'react';

import { CommunityRepository } from '@amityco/js-sdk';
import { useIntl } from 'react-intl';

import Modal from '~/core/components/Modal';
import { confirm } from '~/core/components/Confirm';
import customizableComponent from '~/core/hocs/customization';
import promisify from '~/helpers/promisify';
import { CommunityForm } from './styles';
import withSDK from '~/core/hocs/withSDK';
import { useActionEvents } from '~/core/providers/ActionProvider';

const CommunityCreationModal = ({ isOpen, onClose, canCreatePublic }) => {
  const { formatMessage } = useIntl();
  const actionEvents = useActionEvents();

  if (!isOpen) return null;

  const closeConfirm = () =>
    confirm({
      title: formatMessage({ id: 'CommunityCreationModal.title' }),
      content: formatMessage({ id: 'CommunityCreationModal.content' }),
      cancelText: formatMessage({ id: 'CommunityCreationModal.cancelText' }),
      okText: formatMessage({ id: 'CommunityCreationModal.okText' }),
      onOk: onClose,
    });

  const handleSubmit = async (data) => {
    const { communityId } = await promisify(CommunityRepository.createCommunity(data));
    actionEvents.onCommunityCreate?.({
      communityId,
      name: data.displayName,
      isPrivate: !data.isPublic,
    });
    onClose(communityId);
  };

  return (
    <Modal
      isOpen
      title={formatMessage({ id: 'createCommunity' })}
      onCancel={closeConfirm}
      data-qa-anchor="community-creation-modal"
    >
      <CommunityForm
        canCreatePublic={canCreatePublic}
        onCancel={closeConfirm}
        onSubmit={handleSubmit}
        data-qa-anchor="community-creation"
      />
    </Modal>
  );
};

export default memo(
  withSDK(customizableComponent('CommunityCreationModal', CommunityCreationModal)),
);
