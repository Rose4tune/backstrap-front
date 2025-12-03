export const generateHttpAuthorizationHeader = (
  authPayload?: AuthPayload,
  scheme = "Bearer"
): string => {
  if (authPayload == null) {
    return "";
  }

  const { access_token } = authPayload;

  return `${scheme} ${access_token}`;
};
