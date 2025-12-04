import qs from "qs";

import useHttpPost, { State } from "@hooks/useHttpPost.hook";

import { API_PATH_SOCIAL_OAUTH } from "@constants/bagstrap/api/user.api.constant";

const REST_API_ENDPOINT = process.env.NEXT_PUBLIC_REST_API_ENDPOINT;

export default function useHttpPostSocialOAuth(): [
  State<string, AuthPayload>,
  (token: string, provider: "APPLE" | "FACEBOOK" | "KAKAOTALK") => void
] {
  const url = `${API_PATH_SOCIAL_OAUTH}`;

  const [state, request] = useHttpPost<string, AuthPayload>(url, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  return [
    state,
    (token, provider) => {
      request(
        qs.stringify({
          token,
          provider,
        })
      );
    },
  ];
}
