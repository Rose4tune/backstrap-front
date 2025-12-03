import axios from "axios";

import { API_REZI_USER_TOKEN } from "@constants/bagstrap/api/user.api.constant";
import { generateHttpAuthorizationHeader } from "@utils/common/http.util";

const REST_API_ENDPOINT = process.env.NEXT_PUBLIC_REST_API_ENDPOINT;

export default function getReziUserToken(authPayload?: AuthPayload) {
  const url = REST_API_ENDPOINT + API_REZI_USER_TOKEN

  const fetch = axios.get(url, {
    headers: {
      Authorization: generateHttpAuthorizationHeader(authPayload),
    },
  })

  return fetch
}