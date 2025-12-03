import React from 'react';
import clsx from 'clsx';

import { useFormikContext } from 'formik';

/**
 * components
 */
import BaseButton, { BaseButtonProps } from '@common/button/BaseButton';

export interface BaseFormButtonProps extends BaseButtonProps {
  readonly autoDisabled?: boolean;

  readonly fullWidth?: boolean;
}

function BaseFormButton(props: BaseFormButtonProps, ref: any): JSX.Element {
  const { children, autoDisabled, fullWidth, className, onClick, ...baseButtonProps } =
    props;

  const formik = useFormikContext();

  const disabled = !formik.isValid || formik.isValidating || formik.isSubmitting;

  React.useImperativeHandle(ref, () => ({
    submit: () => {
      formik.submitForm();
    }
  }));

  return (
    <BaseButton
      ref={ref}
      type="submit"
      className={clsx(
        fullWidth && 'w-full',
        formik.isValid && formik.dirty ? 'text-primary' : 'text-grey2',
        className
      )}
      disabled={
        autoDisabled && disabled
        // || !formik.dirty
      }
      // onClick={(evt) => {
      //   if (formik) {
      //     formik.submitForm();
      //   }

      //   onClick?.call(null, evt);
      // }}
      {...baseButtonProps}
    >
      {children}
    </BaseButton>
  );
}

export default React.forwardRef(BaseFormButton);
