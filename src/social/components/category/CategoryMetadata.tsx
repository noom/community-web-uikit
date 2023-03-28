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
  IconButton,
  Select,
  FormLabel,
  Stack,
  useDisclosure,
  Input,
} from '@noom/wax-component-library';

import Modal from '~/core/components/Modal';
import { useNoomCategoryMetadata } from '~/social/hooks/useNoomCategoryMetadata';

type Category = {
  categoryId: string;
  metadata?: {
    locale?: string;
    partnerId?: number;
  };
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
  category: Category;
  isOpen: boolean;
  metadata: Category['metadata'];
  onClose: () => void;
  onSave: (categoryId: string, metadata: Category['metadata']) => void;
};

const MetadataEditModal = ({
  category,
  onClose,
  isOpen,
  metadata,
  onSave,
}: MetadataEditModalProps) => {
  const { formatMessage } = useIntl();
  const { register, handleSubmit } = useForm();

  const onSubmit = (data: Category['metadata']) => {
    onSave(category.categoryId, data), onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      data-qa-anchor="edit-metadata-modal"
      title={formatMessage({ id: 'categoryMetadata.edit.title' })}
      onCancel={onClose}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack>
          <Box>
            <FormLabel>
              <FormattedMessage id="categoryMetadata.locale" />
            </FormLabel>
            <Select
              options={['EN', 'ES', 'DE', 'KO', 'JA'].map((key) => ({
                label: key,
                value: key,
              }))}
              defaultValue={metadata?.locale}
              {...register('locale')}
            />
          </Box>
          <Box display="flex" flexDir="row" justifyContent="space-between">
            <FormLabel>
              <FormattedMessage id="categoryMetadata.partner" />
            </FormLabel>
            <Input colorScheme="primary" {...register('partnerId')} />
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

export const UICategoryMetadata = ({
  category,
  noomMetadata,
  onUpdate,
}: {
  category: Category;
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
              <FormattedMessage id="categoryMetadata.title" />
            </b>
            {' - '}
            <FormattedMessage id="categoryMetadata.helper" />
          </Box>
          <IconButton size="sm" icon="edit" variant="ghost" onClick={onOpen} />
        </Box>
        <Table variant="simple" size="sm">
          <Tbody>
            <Tr>
              <Td>
                <FormattedMessage id="categoryMetadata.locale" />
              </Td>
              <Td>{category.metadata?.locale ?? 'EN'}</Td>
            </Tr>
            <Tr>
              <Td>
                <FormattedMessage id="categoryMetadata.partner" />
              </Td>
              <Td>{category.metadata?.partnerId ?? '-'}</Td>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>
      <MetadataEditModal
        category={category}
        isOpen={isOpen}
        onClose={onClose}
        onSave={onUpdate}
        metadata={category.metadata}
      />
    </>
  );
};

export const CategoryMetadata = ({ category }: { category: Category }) => {
  const { metadata, updateMetadata } = useNoomCategoryMetadata(category.categoryId);

  const handleUpdate = (categoryId: string, metadata: any) => {
    updateMetadata(categoryId, metadata, () => {
      //TODO: Replace this with actual fetch from Amity
      location.reload();
    });
  };

  return (
    <UICategoryMetadata
      category={category}
      noomMetadata={metadata as NoomMetadata}
      onUpdate={handleUpdate}
    />
  );
};
