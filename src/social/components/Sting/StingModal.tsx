import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import {
  Box,
  Button,
  ButtonGroup,
  Container,
  FormLabel,
  Loader,
  Stack,
  Textarea,
} from '@noom/wax-component-library';
import { FormattedMessage, useIntl } from 'react-intl';
import Modal from '~/core/components/Modal';
import { useConfig } from '~/social/providers/ConfigProvider';
import { ErrorMessage } from '../CommunityForm/styles';

type StingModalProps = {
  userAccessCode: string;
  pathToContent: string;
  isOpen: boolean;
  onClose: () => void;
};

export const StingModal = ({ userAccessCode, pathToContent, isOpen, onClose }: StingModalProps) => {
  const { formatMessage } = useIntl();
  const {
    formState: { errors },
    register,
    handleSubmit,
    reset,
    setError,
  } = useForm();
  const { isUserCurrentlyInStingDashCallback, addCoachNoteCallback, transferUserToStingCallback } =
    useConfig();
  const [userInStingDash, setUserInStingDash] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      (async () => {
        const inStingDash = await isUserCurrentlyInStingDashCallback(userAccessCode);
        setUserInStingDash(inStingDash);
        setIsLoading(false);
      })();
    }
  }, [userAccessCode, isOpen]);

  useEffect(() => {
    setIsLoading(true);
    reset();
  }, [isOpen]);

  const onSubmit = async (data: { coachNotes: string }) => {
    let canAttachNote = true;
    if (!userInStingDash) {
      canAttachNote = await transferUserToStingCallback(userAccessCode);
    }
    if (canAttachNote) {
      const realPath = pathToContent.replace(
        /.+\/social\//,
        `${window.location.protocol}//${window.location.hostname}/`,
      );
      addCoachNoteCallback(
        userAccessCode,
        `${data.coachNotes}\n\nPath to Circles content:\n${realPath}`,
      );
    }
    onClose();
  };

  const validateAndSubmit = async (data) => {
    if (!data.coachNotes) {
      setError('coachNotes', {
        message: formatMessage({ id: 'sting.notesAreRequired' }),
      });
      return;
    }
    onSubmit(data);
  };

  const statusLabelId = userInStingDash ? 'sting.userInStingDash' : 'sting.userNotInStingDash';
  const buttonLabelId = userInStingDash ? 'sting.addNewNote' : 'sting.transferUser';

  return (
    <Modal
      isOpen={isOpen}
      data-qa-anchor="sting-modal"
      title={isLoading ? '' : formatMessage({ id: statusLabelId })}
      onCancel={onClose}
    >
      {isLoading ? (
        <Container centerHorizontal>
          <Loader size="md" colorScheme="primary" />
        </Container>
      ) : (
        <form onSubmit={handleSubmit(validateAndSubmit)}>
          <Stack>
            <Box>
              <FormLabel>
                <FormattedMessage id="sting.coachNotes" />
              </FormLabel>
              <Textarea
                placeholder={formatMessage({ id: 'sting.notesPlaceholder' })}
                {...register('coachNotes')}
              />
              <ErrorMessage errors={errors} name="coachNotes" />
            </Box>

            <ButtonGroup w="100%" justifyContent="center">
              <Button colorScheme="primary" type="submit">
                <FormattedMessage id={buttonLabelId} />
              </Button>
            </ButtonGroup>
          </Stack>
        </form>
      )}
    </Modal>
  );
};
