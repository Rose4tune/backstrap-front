import clsx from 'clsx';
import React from 'react';

import BaseSurface, { BaseSurfaceProps } from '@common/surface/BaseSurface';

const BOARD_LOADING_MESSAGE = '게시글을 불러오고 있습니다...';

export interface BoardLoadingSurfaceProps extends BaseSurfaceProps {
  readonly open?: boolean;

  readonly loadingProps?: BaseProps;

  readonly message?: React.ReactNode;
}

const BoardLoadingSurface = (props: BoardLoadingSurfaceProps): JSX.Element => {
  const {
    open,
    className,
    loadingProps,
    message = BOARD_LOADING_MESSAGE,
    ...surfaceProps
  } = props;

  const [state, setState] = React.useState(open);

  React.useEffect(() => {
    if (open) {
      setState(open);
    } else {
      const timeout = setTimeout(() => {
        setState(open);
      }, 2000);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [open]);

  return (
    <>
      {(state || open) && (
        <BaseSurface className={clsx('bg-white', className)} {...surfaceProps}>
          <div className={clsx('absolute top-9 flex-center flex-col gap-4', 'lg:top-40')}>
            <img src="/images/loading.gif" className="w-[136px]" />
            <p className={clsx('text-[#BFBFBF] text-sm', 'md:text-base')}>{message}</p>
          </div>
        </BaseSurface>
      )}
    </>
  );
};

export default BoardLoadingSurface;
