import React from "react";

export {};

declare global {
  // utility types
  export type PartialOn<T, K extends keyof T> = Omit<T, K> &
    Partial<Pick<T, K>>;

  export type nil = null | undefined;

  // removes both null or undefined from T
  export type NonNil<T> = T extends nil ? never : T;

  // make all properties nilable
  export type NilableProps<T> = { [P in keyof T]?: T[P] | nil };

  // make all properties nullable
  export type NullableProps<T> = { [P in keyof T]: T[P] | null };

  // make all properties undefinable
  export type UndefinableProps<T> = { [P in keyof T]?: T[P] | undefined };

  // make all properties non nilable
  export type NonNilProps<T> = { [P in keyof T]-?: NonNil<T[P]> };

  // make some keys non nil
  export type WithNonNilKeys<T, K extends keyof T> = Omit<T, K> &
    NonNilProps<Pick<T, K>>;

  // base types
  export interface BaseProps
    extends Pick<React.HTMLProps<any>, "id" | "className" | "style"> {}

  export interface BaseInputProps<T = HTMLInputElement>
    extends BaseProps,
      Pick<
        React.AllHTMLAttributes<T>,
        | "name"
        | "value"
        | "checked"
        // | "onChange"
        | "onBlur"
        | "placeholder"
        | "readOnly"
        | "disabled"
      > {
    readonly onChange?: React.ChangeEventHandler<T>;
  }

  export interface BaseFormFieldProps
    extends WithNonNilKeys<
      Omit<BaseInputProps, "onChange" | "onBlur">,
      "name"
    > {
    readonly required?: boolean;
  }

  export type SelectOption = {
    readonly label: string;
    readonly value: string | number | boolean;
    readonly isDisabled?: boolean;
  };

  export type AuthPayload = {
    access_token: string;
    refresh_token: string;
    email: string;
    jti: string;
    scope: string;
    token_type: string;

    userId: number;
    userUuid: string;
    username: string;

    needRegister?: boolean;
    isSignup?: boolean;
  };

  var AppleID: any;
  var Kakao: any;
  var katex: any;
}
