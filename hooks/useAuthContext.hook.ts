import React from "react";

import { AuthContextValue } from "@contexts/auth.context";

import useAuthPersistence from "./useAuthPersistence.hook";

export default function useAuthContext(): AuthContextValue {
  const [, , resetAuthPersistence] = useAuthPersistence();

  const [value, setValue] = React.useState<AuthContextValue>({
    loadAuthPayload: (authPayload) => {
      setValue((prev) => ({
        ...prev,
        authPayload,
        isLoaded: true,
      }));
    },

    resetAuthPayload: (shouldResetPersistence) => {
      setValue(() => ({
        loadAuthPayload: () => {},
        isLoaded: false,
      }));

      if (shouldResetPersistence) {
        resetAuthPersistence();
      }
    },
  });

  return value;
}
