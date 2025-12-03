import qs from 'qs';
import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';

import { COOKIE_NS } from '@constants/common/cookie.constant';
import { API_PATH_SOCIAL_OAUTH } from '@constants/bagstrap/api/user.api.constant';
import {
  GRANT_TYPE_AUTHORIZATION_CODE,
  KAKAO_OAUTH_TOKEN_ENDPOINT
} from '@constants/bagstrap/api/oauth/kakao-oauth.api.constant';

const KAKAO_LOGIN_REDIRECT_URI = process.env.KAKAO_LOGIN_REDIRECT_URI;

const KAKAO_REST_API_KEY = process.env.KAKAO_REST_API_KEY;
const KAKAO_CLIENT_SECRET = process.env.KAKAO_CLIENT_SECRET;

const REST_API_ENDPOINT = process.env.NEXT_PUBLIC_REST_API_ENDPOINT;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { code, state } = req.query;

  return (
    // kakao access token
    axios
      .post(
        KAKAO_OAUTH_TOKEN_ENDPOINT,
        qs.stringify({
          grant_type: GRANT_TYPE_AUTHORIZATION_CODE,
          client_id: KAKAO_REST_API_KEY,
          client_secret: KAKAO_CLIENT_SECRET,
          redirect_uri: KAKAO_LOGIN_REDIRECT_URI,
          code
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
          }
        }
      )
      .then(result => {
        // bagstrap access token
        return axios.post<AuthPayload>(
          `${REST_API_ENDPOINT}${API_PATH_SOCIAL_OAUTH}`,
          qs.stringify({
            token: result.data.access_token,
            provider: 'KAKAOTALK'
          }),
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          }
        );
      })
      .then(result => {
        const needRegister = result.data.needRegister;
        const provider = 'KAKAOTALK'; // or 'KAKAOTALK' 일관성대로

        const cookieValue = JSON.stringify({
          authPayload: Object.assign(result.data, {
            isSignup: needRegister
          })
        });

        const location = needRegister
          ? `/user/sign-up?provider=${encodeURIComponent(provider)}`
          : '/';

        return res
          .setHeader('Set-Cookie',
            `${COOKIE_NS}=${cookieValue}; Path=/; Secure; SameSite=Lax;`
          )
          .redirect(302, location);
      })
      .catch(err => {
        console.log(err.response);

        return res.status(err.response?.status ?? 400).json(err.response?.data);
      })
  );
}
