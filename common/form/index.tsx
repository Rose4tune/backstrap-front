import clsx from "clsx";
import { FormikValues } from "formik";

import BaseForm, { BaseFormProps } from "./BaseForm";

export interface BaseFormIndexProps<T extends FormikValues>
  extends Partial<BaseFormProps<T>> {}

const BaseFormIndex = <T extends FormikValues>(
  props: React.PropsWithChildren<BaseFormIndexProps<T>>
) => {
  const {
    children,
    className,
    initialValues = {} as T,
    onSubmit = () => new Promise(() => {}),
    ...formProps
  } = props;

  return (
    // wrap
    <div className={clsx("relative", className)}>
      {/* form */}
      <BaseForm
        initialValues={initialValues}
        onSubmit={onSubmit}
        {...formProps}
      >
        {children}
      </BaseForm>
    </div>
  );
};

export default BaseFormIndex;
