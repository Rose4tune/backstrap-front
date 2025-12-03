export const checkAuthenticated = (
  authPayload?: AuthPayload
): authPayload is WithNonNilKeys<AuthPayload, "access_token"> => {
  return (
    !!authPayload && !!authPayload.access_token && !authPayload.needRegister
  );
};
