import React from "react";

import authContext from "@contexts/auth.context";

export default function useAuthPayload(): AuthPayload | undefined {
  const auth = React.useContext(authContext);

  return auth.authPayload;
}
