import React from "react";
import {
  Formik,
  FormikConfig,
  FormikValues,
  Form as FormikForm,
  FormikFormProps,
} from "formik";

export interface BaseFormProps<T extends FormikValues>
  extends Pick<
      FormikConfig<T>,
      | "initialValues"
      | "validationSchema"
      | "validateOnMount"
      | "validateOnChange"
      | "validateOnBlur"
    >,
    Pick<FormikFormProps, "className"> {
  readonly onSubmit?: (values: T) => void | Promise<void>;

  readonly resetAfterSubmit?: boolean;
}

const BaseForm = <T extends FormikValues>(props: React.PropsWithChildren<BaseFormProps<T>>) => {
  const {
    initialValues,
    onSubmit,
    resetAfterSubmit,
    validationSchema,
    children,
    className,
    ...formikProps
  } = props;

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={async (values, helpers) => {
        await helpers.validateForm(values);

        await onSubmit?.call(null, values);

        if (resetAfterSubmit) {
          helpers.resetForm({ values });
        }
      }}
      enableReinitialize
      validateOnMount
      {...formikProps}
    >
      {(formikProps) => {
        const { isValidating, isSubmitting, errors, dirty, touched, values } =
          formikProps;

        if (process.env.NODE_ENV !== "production") {
          console.log(errors, values);
        }

        return (
          <>
            <FormikForm className={className}>{children}</FormikForm>
          </>
        );
      }}
    </Formik>
  );
};

export default BaseForm;
