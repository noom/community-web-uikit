import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import {
  Modal as WaxModal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useBreakpointValue,
} from '@noom/wax-component-library';
import useElement from '~/core/hooks/useElement';

const Modal = ({
  size,
  isCentered,
  className,
  onOverlayClick,
  onCancel,
  title,
  footer,
  isOpen,
  children,
  scrollBehavior,
  'data-qa-anchor': dataQaAnchor = '',
}) => {
  const [modalRef, modalElement] = useElement();
  // auto focus to prevent scroll on background (when focus kept on trigger button)
  useEffect(() => modalElement && modalElement.focus(), [modalElement]);
  const forceCentered = useBreakpointValue({
    base: false,
    md: true,
  });

  const attrProps = { className, ref: modalRef };

  const modalSize = size === 'small' ? 'sm' : 'lg';

  return (
    <WaxModal
      isOpen={isOpen}
      isCentered={isCentered || forceCentered}
      onClose={onCancel ?? onOverlayClick}
      size={modalSize}
      scrollBehavior={scrollBehavior}
    >
      <ModalOverlay />

      <ModalContent tabIndex={0} marginY={0} {...attrProps} data-qa-anchor={dataQaAnchor}>
        {title && <ModalHeader>{title}</ModalHeader>}
        {onCancel && <ModalCloseButton />}
        <ModalBody>{children}</ModalBody>

        {footer && <ModalFooter>{footer}</ModalFooter>}
      </ModalContent>
    </WaxModal>
  );
};

Modal.propTypes = {
  size: PropTypes.string,
  isCentered: PropTypes.bool,
  className: PropTypes.string,
  onOverlayClick: PropTypes.bool,
  onCancel: PropTypes.func,
  title: PropTypes.string,
  footer: PropTypes.any,
  isOpen: PropTypes.bool,
  children: PropTypes.any,
  scrollBehavior: PropTypes.string,
  'data-qa-anchor': PropTypes.string,
};

export default Modal;
