import React from "react";

import { checkAuthenticated } from "@utils/auth/auth.util";

import AuthContext from "@contexts/auth.context";

import useAuthPersistence from "./useAuthPersistence.hook";
import useAuthGuardModalDialog from "./bagstrap/user/useAuthGuardModalDialog.hook";

export default function useAuthGuard(
  authRequired?: boolean
): [React.ReactNode, boolean] {
  const [passed, setPassed] = React.useState(false);

  const auth = React.useContext(AuthContext);

  useAuthPersistence(true);

  const [modalDialogEl, openModalDialog] = useAuthGuardModalDialog();

  React.useEffect(() => {
    const isAuthenticated = checkAuthenticated(auth.authPayload);

    if (!authRequired || isAuthenticated) {
      setPassed(true);

      return;
    }

    if (authRequired && auth.isLoaded && !isAuthenticated) {
      openModalDialog();

      return;
    }
  }, [auth, authRequired]);

  return [modalDialogEl, passed];
}
