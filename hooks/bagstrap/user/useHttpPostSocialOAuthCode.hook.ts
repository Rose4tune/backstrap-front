import qs from "qs";

import useHttpPost, { State } from "@hooks/useHttpPost.hook";

import { API_PATH_SOCIAL_OAUTH_CODE } from "@constants/bagstrap/api/user.api.constant";

const REST_API_ENDPOINT = process.env.NEXT_PUBLIC_REST_API_ENDPOINT;

export default function useHttpPostSocialOAuthCode(): [
  State<string, AuthPayload>,
  (
    code: string,
    provider: "APPLE" | "FACEBOOK" | "KAKAOTALK",
    redirectUri?: string
  ) => void
] {
  const url = `${REST_API_ENDPOINT}${API_PATH_SOCIAL_OAUTH_CODE}`;

  const [state, request] = useHttpPost<string, AuthPayload>(url, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  return [
    state,
    (code, provider, redirectUri) => {
      request(
        qs.stringify({
          code,
          provider,
          redirectUri,
        })
      );
    },
  ];
}
