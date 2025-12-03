import React from "react";

import { useReactiveVar } from "@apollo/client";

/**
 * vars
 */
import { ErrorVar, errorVar, resetErrorAction } from "@vars/error.var";

/**
 * hooks
 */
import useAuthPersistence from "./useAuthPersistence.hook";
import useAuthGuardModalDialog from "./bagstrap/user/useAuthGuardModalDialog.hook";

export default function useErrorVar(): [React.ReactNode, ErrorVar] {
  const error = useReactiveVar(errorVar);

  const [_, __, resetAuthPersistence] = useAuthPersistence();

  const [modalDialogEl, openModalDialog] = useAuthGuardModalDialog();

  React.useEffect(() => {
    if (error?.UNAUTHORIZED) {
      openModalDialog();

      resetErrorAction();

      resetAuthPersistence();
    }
  }, [error]);

  return [modalDialogEl, error];
}
