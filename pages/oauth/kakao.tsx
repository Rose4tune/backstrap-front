import React from 'react';
import Head from 'next/head';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useCookies } from 'react-cookie';

import { checkAuthenticated } from '@utils/auth/auth.util';

import { COOKIE_NS_KAKAO_OAUTH } from '@constants/common/cookie.constant';

import LoadingSurface from '@common/surface/LoadingSurface';

import useUserAuthSign from '@hooks/useUserAuthSign.hook';
import useHttpPostSocialOAuth from '@hooks/bagstrap/user/useHttpPostSocialOAuth.hook';
import useHttpPostSocialOAuthCode from '@hooks/bagstrap/user/useHttpPostSocialOAuthCode.hook';

const KAKAO_LOGIN_REDIRECT_URI = process.env.NEXT_PUBLIC_KAKAO_LOGIN_REDIRECT_URI;

const OAuthKakaoPage: NextPage = () => {
  const router = useRouter();

  const [cookie] = useCookies();

  //쿠키에 저장된 인증 정보, 인증 정보 컨텍스트, 쿠키에 저장 후 리다이렉트
  const [authPayload, afterSignedin] = useUserAuthSign();

  const [signinState, signinWithCode] = useHttpPostSocialOAuthCode();
  React.useEffect(() => {
    // authenticated check => redirect
    if (checkAuthenticated(authPayload) && !authPayload?.isSignup) {
      router.replace('/');

      return;
    }
    if (router.isReady && cookie) {
      const { code: _code, state: _state } = router.query;

      const code = Array.isArray(_code) ? _code[0] : _code || '';

      const state = Array.isArray(_state) ? _state[0] : _state;

      const storedState = cookie[COOKIE_NS_KAKAO_OAUTH]?.state;
    }
  }, [router, authPayload, cookie]);

  return (
    <>
      <Head>
        <meta name="robots" content="noindex" />
      </Head>

      <LoadingSurface open global />
    </>
  );
};

export default OAuthKakaoPage;
