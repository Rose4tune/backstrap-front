import clsx from 'clsx';
import React from 'react';

import { Dialog, Transition } from '@headlessui/react';

import { isNotNil } from '@utils/common/base.util';

import LoadingSurface from '@common/surface/LoadingSurface';

export interface ModalDialogProps extends BaseProps {
  open?: boolean;

  onClose?: () => void;

  header?: React.ReactNode;

  body?: React.ReactNode;

  actions?: [React.ReactNode | undefined, React.ReactNode | undefined];

  size?: 'sm' | 'md' | 'lg';

  headerHeight?: number | string;

  loading?: boolean;

  unstyled?: boolean;

  backgroundColor?: string;

  opacity?: number | string;
}

const ModalDialog = (props: ModalDialogProps): JSX.Element => {
  const {
    // base props
    id,
    style,
    className,

    // dialog props
    open = false,
    onClose,
    header,
    body,
    actions,
    size = 'sm',
    headerHeight,
    loading,
    unstyled,
    backgroundColor,
    opacity
  } = props;

  const containerRef = React.useRef<HTMLDivElement>(null);

  return (
    <>
      <Transition appear show={open} as={React.Fragment}>
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
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay
              className={`fixed inset-0 ${backgroundColor ? `bg-${backgroundColor}` : 'bg-black'} bg-opacity-${opacity ?? 20}`}
            />
          </Transition.Child>
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div
              id="container"
              ref={containerRef}
              className={clsx(
                'relative inline-block overflow-visible',
                'bg-white shadow-xl z-50',
                'rounded-2xl',
                !unstyled && size === 'sm' && 'max-w-[286px]',
                !unstyled && size === 'md' && 'max-w-[328px]',
                !unstyled && size === 'lg' && 'max-w-[372px]',
                !unstyled && 'w-full'
              )}
            >
              {/* header */}
              {header && (
                <header
                  className={clsx(
                    'absolute top-0 left-0 right-0 z-50',
                    'flex-between bg-white',
                    'px-6 mt-2',
                    'rounded-t-2xl',
                    'font-bold typo-body3',
                    size === 'sm' && 'h-14',
                    size === 'md' && 'h-16',
                    size === 'lg' && 'h-20'
                  )}
                  style={{
                    height: headerHeight
                  }}
                >
                  {header}
                </header>
              )}

              {/* body */}
              <div
                className={clsx(
                  'max-h-[90vh] no-scrollbar text-left',
                  'mt-2',
                  header && size === 'sm' ? 'pt-14' : '',
                  header && size === 'md' ? 'pt-16' : '',
                  header && size === 'lg' ? 'pt-20' : '',
                  false ? 'overflow-y-auto' : 'overflow-y-visible',
                  !unstyled && 'px-6 pb-[82px]'
                )}
                style={{
                  paddingTop: headerHeight
                }}
              >
                {body}
              </div>

              {/* actions */}
              <div
                className={clsx(
                  'absolute bottom-0 left-0 right-0 flex-evenly bg-white rounded-b-2xl',
                  'pt-4 px-6 pb-6 gap-2'
                )}
              >
                {actions?.filter(isNotNil)?.map((action, index) => (
                  <div key={index} className={clsx('flex-1 w-full h-full flex-center')}>
                    {action}
                  </div>
                ))}
              </div>
            </div>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
};

export default ModalDialog;
