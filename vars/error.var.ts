import { makeVar } from "@apollo/client";

import { ErrorType } from "@enums/common/error.enum";

export type ErrorVar = {
  [ErrorType.Unauthorized]?: boolean;
  [ErrorType.Forbidden]?: boolean;
};

export const errorVar = makeVar<ErrorVar>({
  FORBIDDEN: false,
  UNAUTHORIZED: false,
});

export const setErrorUnauthorizedAction = (): ErrorVar => {
  const prev = errorVar();

  return errorVar({
    ...prev,
    [ErrorType.Unauthorized]: true,
  });
};

export const setErrorForbiddenAction = (): ErrorVar => {
  const prev = errorVar();

  return errorVar({
    ...prev,
    [ErrorType.Forbidden]: true,
  });
};

export const resetErrorAction = (): ErrorVar => {
  return errorVar({});
};