import React from 'react';

import ModalDialog, { ModalDialogProps } from '@common/dialog/ModalDialog';
import NewModalDialog, { NewModalDialogProps } from '@common/dialog/NewModalDialog';

export type DialogContent = Pick<
  ModalDialogProps & NewModalDialogProps,
  | 'loading'
  | 'size'
  | 'header'
  | 'headerHeight'
  | 'body'
  | 'actions'
  | 'unstyled'
  | 'backgroundColor'
  | 'opacity'
  | 'button'
  | 'newStyle'
>;

export default function useModalDialog(
  content: DialogContent = {},
  onClose?: () => void
): [React.ReactNode, () => void, () => void] {
  const [isOpen, setIsOpen] = React.useState<boolean | undefined>();

  React.useEffect(() => {
    if (typeof isOpen === 'boolean') {
      if (isOpen) {
        // onOpen?.call(null)
      } else {
        return () => {
          onClose?.call(null);
        };
      }
    }
  }, [isOpen]);

  return [
    content.newStyle ? (
      <NewModalDialog open={isOpen} setIsOpen={setIsOpen} {...content} />
    ) : (
      <ModalDialog open={isOpen} {...content} />
    ),
    () => {
      setIsOpen(true);
    },
    () => {
      setIsOpen(false);
    }
  ];
}
