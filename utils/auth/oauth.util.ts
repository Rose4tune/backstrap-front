// TODO state transfer
export const generateOAuthState = (state?: Record<string, string>): string => {
  const rs = Math.random()
    .toString(36)
    .replace(/[^a-z]+/g, "")
    .substring(0, 10);

  return rs;
};
