import React from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useCookies } from 'react-cookie';

import { checkAuthenticated } from '@utils/auth/auth.util';

import { COOKIE_NS_APPLE_OAUTH } from '@constants/common/cookie.constant';

import LoadingSurface from '@common/surface/LoadingSurface';

import useUserAuthSign from '@hooks/useUserAuthSign.hook';
import useHttpPostSocialOAuth from '@hooks/bagstrap/user/useHttpPostSocialOAuth.hook';

const OAuthApplePage: NextPage = () => {
  const router = useRouter();

  const [cookie] = useCookies();

  const [authPayload, afterSignedin] = useUserAuthSign();

  const [signinWithSocialState, signinWithSocial] = useHttpPostSocialOAuth();

  React.useEffect(() => {
    // authenticated check => redirect
    if (checkAuthenticated(authPayload) && !authPayload?.isSignup) {
      router.replace('/');

      return;
    }

    if (router.isReady) {
      const { id_token: _id_token, state: _state } = router.query;

      const id_token = Array.isArray(_id_token) ? _id_token[0] : _id_token;

      const state = Array.isArray(_state) ? _state[0] : _state;

      const storedState = cookie[COOKIE_NS_APPLE_OAUTH]?.state;

      if (id_token && (!state || state === storedState)) {
        signinWithSocial(id_token, 'APPLE');
      } else {
        alert('apple auth failed!');

        router.replace('/user/sign-in');
      }
    }
  }, [router]);

  React.useEffect(() => {
    if (signinWithSocialState?.result) {
      afterSignedin(
        Object.assign(signinWithSocialState.result, {
          isSignup: signinWithSocialState.result.needRegister
        }),
        signinWithSocialState.result.needRegister ? '/user/sign-up' : '/'
      );
    }
  }, [signinWithSocialState]);

  return (
    <>
      <Head>
        <meta name="robots" content="noindex" />
      </Head>

      <LoadingSurface open />
    </>
  );
};

export default OAuthApplePage;
