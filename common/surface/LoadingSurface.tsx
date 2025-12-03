import React from "react";

import BaseSurface, { BaseSurfaceProps } from "./BaseSurface";

export interface LoadingSurfaceProps extends BaseSurfaceProps {
  readonly open?: boolean;

  readonly loadingProps?: BaseProps;
}

const LoadingSurface = (props: LoadingSurfaceProps): JSX.Element => {
  const { open, className, loadingProps, ...surfaceProps } = props;

  return (
    <>
      {open && (
        <BaseSurface className={className} {...surfaceProps}>
          {/* TODO loading indicator */}
        </BaseSurface>
      )}
    </>
  );
};

export default LoadingSurface;
