import qs from 'qs';

import useHttpPost, { State } from '@hooks/useHttpPost.hook';

import { API_PATH_OAUTH_TOKEN } from '@constants/bagstrap/api/user.api.constant';

const AUTH_CODE = process.env.NEXT_PUBLIC_AUTH_CODE;
const REST_API_ENDPOINT = process.env.NEXT_PUBLIC_REST_API_ENDPOINT;

export default function useHttpPostOAuthToken(): [
  State<string, AuthPayload>,
  (username: string, password: string) => void
] {
  const url = `${API_PATH_OAUTH_TOKEN}`;

  const [state, request] = useHttpPost<string, AuthPayload>(url, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ZmFjdG9yeTo=`
    }
  });

  return [
    state,
    (username, password) => {
      request(
        qs.stringify({
          grant_type: 'password',
          username,
          password
        })
      );
    }
  ];
}
