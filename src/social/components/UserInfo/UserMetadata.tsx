import React from 'react';
import { useForm } from 'react-hook-form';
import { FormattedMessage, useIntl } from 'react-intl';
import {
  Box,
  ButtonGroup,
  Button,
  Table,
  TableContainer,
  Tbody,
  Tr,
  Td,
  Icon,
  IconButton,
  Input,
  Switch,
  Select,
  FormLabel,
  Stack,
  useDisclosure,
} from '@noom/wax-component-library';

import Time from '~/core/components/Time';
import Modal from '~/core/components/Modal';
import { useNoomUserMetadata } from '~/social/hooks/useNoomUserMetadata';

type User = {
  userId: string;
  metadata?: {
    userType?: string;
    hasFinishedInitialProfileSync?: boolean;
    isMigratedFromCircles?: boolean;
    localeLanguage?: string[];
    businessType?: string;
    partnerId?: number;
  };
  createdAt: string;
};

type NoomMetadata = {
  deviceInformation: {
    os: string;
    clientVersion: string;
  };
  localeInformation: {
    language: string;
    timezone: string;
  };
};

type MetadataEditModalProps = {
  user: User;
  isOpen: boolean;
  metadata: User['metadata'];
  onClose: () => void;
  onSave: (userAccessCode: string, metadata: User['metadata']) => void;
};

const MetadataEditModal = ({ user, onClose, isOpen, metadata, onSave }: MetadataEditModalProps) => {
  const { formatMessage } = useIntl();
  const { register, handleSubmit } = useForm();

  const onSubmit = (data: User['metadata']) => {
    onSave(user.userId, data), onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      data-qa-anchor="edit-metadata-modal"
      title={formatMessage({ id: 'userMetadata.edit.title' })}
      onCancel={onClose}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack>
          <Box>
            <FormLabel>
              <FormattedMessage id="userMetadata.userType" />
            </FormLabel>
            <Select
              options={['user', 'coach', 'writer', 'team'].map((key) => ({
                label: key,
                value: key,
              }))}
              defaultValue={metadata?.userType}
              {...register('userType')}
            />
          </Box>
          <Box display="flex" flexDir="row" justifyContent="space-between">
            <FormLabel>
              <FormattedMessage id="userMetadata.hasFinishedInitialProfileSync" />
            </FormLabel>
            <Switch
              colorScheme="primary"
              defaultChecked={metadata?.hasFinishedInitialProfileSync}
              {...register('hasFinishedInitialProfileSync')}
            />
          </Box>
          <Box display="flex" flexDir="row" justifyContent="space-between">
            <FormLabel>
              <FormattedMessage id="userMetadata.isMigratedFromCircles" />
            </FormLabel>
            <Switch
              colorScheme="primary"
              defaultChecked={metadata?.isMigratedFromCircles}
              {...register('isMigratedFromCircles')}
            />
          </Box>
          <Box display="flex" flexDir="row" justifyContent="space-between">
            <FormLabel>
              <FormattedMessage id="userMetadata.localeLanguage" />
            </FormLabel>
            <Select
              options={['en', 'de', 'es'].map((key) => ({
                label: key,
                value: key,
              }))}
              defaultValue={metadata?.localeLanguage?.[0]}
              {...register('localeLanguage.0')}
            />
          </Box>
          <Box display="flex" flexDir="row" justifyContent="space-between">
            <FormLabel>
              <FormattedMessage id="userMetadata.businessType" />
            </FormLabel>
            <Select
              options={['B2C', 'B2B'].map((key) => ({
                label: key,
                value: key,
              }))}
              defaultValue={metadata?.businessType}
              {...register('businessType')}
            />
          </Box>
          <Box display="flex" flexDir="row" justifyContent="space-between">
            <FormLabel>
              <FormattedMessage id="userMetadata.partnerId" />
            </FormLabel>
            <Input value={metadata?.partnerId?.toString()} {...register('partnerId')} />
          </Box>

          <ButtonGroup w="100%" justifyContent="center">
            <Button colorScheme="primary" type="submit">
              Save
            </Button>
          </ButtonGroup>
        </Stack>
      </form>
    </Modal>
  );
};

export const UIUserMetadata = ({
  user,
  noomMetadata,
  onUpdate,
}: {
  user: User;
  noomMetadata: NoomMetadata;
  onUpdate: MetadataEditModalProps['onSave'];
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <TableContainer>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <b>
              <FormattedMessage id="userMetadata.title" />
            </b>
            {' - '}
            <FormattedMessage id="userMetadata.helper" />
          </Box>
          <IconButton size="sm" icon="edit" variant="ghost" onClick={onOpen} />
        </Box>
        <Table variant="simple" size="sm">
          <Tbody>
            <Tr>
              <Td>
                <FormattedMessage id="userMetadata.accessCode" />
              </Td>
              <Td>{user.userId}</Td>
            </Tr>
            <Tr>
              <Td>
                <FormattedMessage id="userMetadata.userType" />
              </Td>
              <Td>{user.metadata?.userType ?? '-'}</Td>
            </Tr>
            <Tr>
              <Td>
                <FormattedMessage id="userMetadata.platform" />
              </Td>
              <Td>
                {noomMetadata?.deviceInformation?.os
                  ? noomMetadata?.deviceInformation?.os === 'iOS'
                    ? 'iOS'
                    : 'Android'
                  : '-'}
              </Td>
            </Tr>
            <Tr>
              <Td>
                <FormattedMessage id="userMetadata.appVersion" />
              </Td>
              <Td>{noomMetadata?.deviceInformation?.clientVersion ?? '-'}</Td>
            </Tr>
            <Tr>
              <Td>
                <FormattedMessage id="userMetadata.timezone" />
              </Td>
              <Td>{noomMetadata?.localeInformation?.timezone ?? '-'}</Td>
            </Tr>
            <Tr>
              <Td>
                <FormattedMessage id="userMetadata.dateJoined" />
              </Td>
              <Td>{user.createdAt && <Time date={user.createdAt} />}</Td>
            </Tr>
            <Tr>
              <Td>
                <FormattedMessage id="userMetadata.hasFinishedInitialProfileSync" />
              </Td>
              <Td>
                {user.metadata?.hasFinishedInitialProfileSync ? (
                  <Icon icon="check" />
                ) : (
                  <Icon icon="close" />
                )}
              </Td>
            </Tr>
            <Tr>
              <Td>
                <FormattedMessage id="userMetadata.isMigratedFromCircles" />
              </Td>
              <Td>
                {user.metadata?.isMigratedFromCircles ? (
                  <Icon icon="check" />
                ) : (
                  <Icon icon="close" />
                )}
              </Td>
            </Tr>
            <Tr>
              <Td>
                <FormattedMessage id="userMetadata.localeLanguage" />
              </Td>
              <Td>{user.metadata?.localeLanguage?.join(', ')}</Td>
            </Tr>
            <Tr>
              <Td>
                <FormattedMessage id="userMetadata.businessType" />
              </Td>
              <Td>{user.metadata?.businessType}</Td>
            </Tr>
            <Tr>
              <Td>
                <FormattedMessage id="userMetadata.partnerId" />
              </Td>
              <Td>{user.metadata?.partnerId}</Td>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>
      <MetadataEditModal
        user={user}
        isOpen={isOpen}
        onClose={onClose}
        onSave={onUpdate}
        metadata={user.metadata}
      />
    </>
  );
};

export const UserMetadata = ({ user }: { user: User }) => {
  const { metadata, updateMetadata } = useNoomUserMetadata(user.userId);

  const handleUpdate = (userAccessCode: string, metadata: any) => {
    updateMetadata(userAccessCode, metadata, () => {
      //TODO: Replace this with actual fetch from Amity
      location.reload();
    });
  };

  return (
    <UIUserMetadata user={user} noomMetadata={metadata as NoomMetadata} onUpdate={handleUpdate} />
  );
};
