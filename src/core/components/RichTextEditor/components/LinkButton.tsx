import React, { useState, useEffect, FormEvent } from 'react';
import {
  ButtonGroup,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalProps,
  Text,
  Button,
  ColorScheme,
  Input,
  Stack,
  Box,
  IconButton,
  useDisclosure,
} from '@noom/wax-component-library';
import { useSlate } from 'slate-react';
import { isLinkActive, removeLink, insertLink, getSelectedText } from '../utils.ts';

type LinkModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (link: string, text?: string) => void;
  defaultUrl?: string;
  defaultText?: string;
  titleText?: string;
  colorScheme?: ColorScheme;
} & Omit<ModalProps, 'children'>;

const LinkModal = ({
  isOpen,
  onClose,
  onSubmit,
  titleText = 'Add link',
  colorScheme = 'primary',
  defaultUrl = 'https://',
  defaultText = '',
  ...modalProps
}: LinkModalProps) => {
  const [url, setUrl] = useState(defaultUrl);
  const [text, setText] = useState(defaultText);

  useEffect(() => {
    // Reset form on show
    if (isOpen) {
      setUrl(defaultUrl);
      setText(defaultText);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  function submit(event?: FormEvent) {
    if (event) {
      event.preventDefault();
    }
    onSubmit(url, text);
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} {...modalProps}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Text colorScheme={colorScheme}>{titleText}</Text>
        </ModalHeader>
        <ModalBody>
          <form onSubmit={(event) => submit(event)}>
            <Stack spacing={2}>
              <Box>
                <Input
                  label="URL"
                  name="url"
                  value={url}
                  size="md"
                  boxSizing="border-box"
                  onChange={(event) => setUrl(event.currentTarget.value)}
                />
              </Box>
              <Box>
                <Input
                  label="Text"
                  name="text"
                  value={text}
                  size="md"
                  boxSizing="border-box"
                  isDisabled={!!defaultText}
                  onChange={(event) => setText(event.currentTarget.value)}
                />
              </Box>
            </Stack>
            <Button type="submit" display="none" />
          </form>
        </ModalBody>

        <ModalFooter>
          <ButtonGroup spacing={2}>
            <Button variant="outline" size="md" colorScheme={colorScheme} onClick={onClose}>
              Cancel
            </Button>

            <Button
              border="none"
              variant="solid"
              size="md"
              colorScheme={colorScheme}
              isDisabled={!url.length}
              onClick={() => submit()}
            >
              Add
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export const LinkButton = ({ format, icon, activeIcon, ...rest }) => {
  const editor = useSlate();
  const isActive = isLinkActive(editor, format);
  const { isOpen, onClose, onOpen } = useDisclosure();
  const selectedText = getSelectedText(editor);

  function insert(url: string, text?: string) {
    if (url && editor.selection) {
      insertLink(editor, url, text);
    }
  }

  function remove() {
    removeLink(editor);
  }

  return (
    <>
      <IconButton
        {...rest}
        title={format}
        border="none"
        colorScheme={isActive ? 'primary' : 'gray'}
        onClick={() => {
          if (isActive) {
            remove();
          } else {
            onOpen();
          }
        }}
      >
        {activeIcon && isActive ? activeIcon : icon}
      </IconButton>
      <LinkModal
        isOpen={isOpen}
        size="md"
        defaultText={selectedText}
        onClose={onClose}
        onSubmit={(url, text) => insert(url, text)}
      />
    </>
  );
};
