import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';

import { checkAuthenticated } from '@utils/auth/auth.util';

import KakaoLoginButton from '@common/bagstrap/user/KakaoLoginButton';
import AppleIdLoginButton from '@common/bagstrap/user/AppleIdLoginButton';

import useUserAuthSign from '@hooks/useUserAuthSign.hook';
import Title from '@common/Title';
import OnboardingLayout from '@layouts/OnboardingLayout';
import UserSigninForm from 'src/components/onboarding/UserSinginForm';
import AuthSupportLink from 'src/components/onboarding/AuthSupportLink';
import banner from '/public/images/[renewal]onboardingBanner.png';
import KakaoJoinPopup from 'src/components/onboarding/KakaoJoinPopup';
import { useMediaQuery } from '@mui/material';
import { useStore } from '@stores/useStore.hook';
import { observer } from 'mobx-react';


const UserSigninPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { redirectUri: _redirectUri } = router.query;
  const { UserStore } = useStore();
  const redirectUri = Array.isArray(_redirectUri) ? _redirectUri[0] : _redirectUri;

  const [authPayload, afterSignedin] = useUserAuthSign();
  const isMobile = useMediaQuery('(max-width:)')
  async function redirectCVMO () {
    await UserStore.fetchUser();
    // router.replace(`http://localhost:3000/mo/home/web/guest?token=${UserStore.getAccessToken()}`);
    router.replace(`https://career.bagstrap.team/mo/home/web/guest?token=${UserStore.getAccessToken()}`);
  }
  //소셜로그인 인증되었고 회원가입이 필요한 상태가 아니면 홈으로 리다이렉팅
  useEffect(() => {
    if (checkAuthenticated(authPayload) && !authPayload?.isSignup) {
      if(redirectUri==='careermo') {
        redirectCVMO();
    }
      else router.replace(redirectUri || '/');
    }
  }, [authPayload]);

  return (
    <>
      <Head>
        <link
          rel="canonical"
          href="https://www.bagstrap.team/user/sign-in"
          key="canonical"
        />
      </Head>

      <OnboardingLayout>
        <div className="flex flex-1 w-full">
          {/* 로그인 영역 (40%) */}
          <div className="flex flex-col w-[90%] max-w-[450px] mx-auto pt-[60px] sm:pt-[120px] gap-[52px] max-h-[825px] pb-[151px] xl:w-[40%] xl:px-[20px]">
            <Title text="로그인" />
            <div className="flex flex-col w-full gap-[12px]">
              <UserSigninForm
                onSignin={result => {
                  afterSignedin(result, redirectUri);
                }}
                queryId={id}
              />
              <AuthSupportLink />
            </div>
            <div className="flex flex-1 justify-center items-center gap-[12px]">
              <div className='flex flex-col relative'>
                <KakaoLoginButton />
                <div className='absolute -bottom-12 left-1/2 -translate-x-1/2'>
                  <KakaoJoinPopup />
                </div>
              </div>

              <AppleIdLoginButton />
            </div>
          </div>

          {/* 이미지 영역 (60%) */}
          <div className="relative hidden xl:block xl:w-[60%]">
            <Image
              src={banner}
              alt="가방끈 앱 배너"
              layout="responsive"
              width={850}
              height={825}
              placeholder="blur"
              className="object-contain"
            />
          </div>
        </div>
      </OnboardingLayout>
    </>
  );
};

export default observer(UserSigninPage);

