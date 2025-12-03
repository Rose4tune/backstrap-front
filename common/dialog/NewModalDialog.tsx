import { Fragment, useRef } from 'react';

import clsx from 'clsx';

import { Dialog, Transition } from '@headlessui/react';

import LoadingSurface from '@common/surface/LoadingSurface';

import CloseGray from '@public/icons/close-gray.svg';

import {
  NewModalDialogContainer,
  NewModalDialogHeader,
  NewModalDialogHeaderCloseButton,
  NewModalDialogBody,
  NewModalDialogActions
} from './NewModalDialog.style';

export interface NewModalDialogProps extends BaseProps {
  open?: boolean;

  onClose?: () => void;

  header?: React.ReactNode;

  body?: React.ReactNode;

  actions?: React.ReactNode;

  size?: 'sm' | 'md' | 'lg';

  headerHeight?: number;

  loading?: boolean;

  button?: React.ReactNode;

  newStyle?: boolean;

  setIsOpen?: (prev: boolean) => void;
}

const NewModalDialog = (props: NewModalDialogProps): JSX.Element => {
  const {
    className,
    open = false,
    onClose,
    header,
    body,
    size,
    loading,
    button,
    setIsOpen
  } = props;

  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <Transition appear show={open} as={Fragment}>
        <Dialog
          open={open}
          onClose={() => {
            onClose?.call(null);
          }}
          as="div"
          className={clsx('fixed inset-0 z-[10000] overflow-auto flex-center', className)}
          initialFocus={containerRef}
        >
          <LoadingSurface open={loading} global />

          {/* overlay */}
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-20" />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <NewModalDialogContainer ref={containerRef}>
              {/* header */}
              {header && (
                <NewModalDialogHeader>
                  {header}
                  <NewModalDialogHeaderCloseButton
                    onClick={setIsOpen && (() => setIsOpen(false))}
                  >
                    <CloseGray />
                  </NewModalDialogHeaderCloseButton>
                </NewModalDialogHeader>
              )}

              {/* body */}
              <NewModalDialogBody>{body}</NewModalDialogBody>

              {/* actions */}
              <NewModalDialogActions>{button}</NewModalDialogActions>
            </NewModalDialogContainer>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
};

export default NewModalDialog;
