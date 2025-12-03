import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Lottie from 'lottie-react';
import welcomeAnimation from '@public/assets/[renewal]welcome.json';
import Image from 'next/image';
import { checkAuthenticated } from '@utils/auth/auth.util';

import BagstrapSymbolLogo from '@public/logos/logo-bagstrap-symbol.svg';

import CheckCircleIcon from '@public/icons/[sign]check-circle.svg';

import PageLayout from '@layouts/PageLayout';

import BaseLink from '@common/BaseLink';

import useUserAuthSign from '@hooks/useUserAuthSign.hook';
import OnboardingLayout from '@layouts/OnboardingLayout';
import Title from '@common/Title';

const UserSignupResultPage: NextPage = () => {
  const router = useRouter();
  const [nickname, setNickname] = useState<string | null>(null);

  //로그인 성공시 세션에 저장된 닉네임 받아오기
  useEffect(() => {
    const storedName = sessionStorage.getItem('signup-nickname');
    setNickname(storedName);
    sessionStorage.removeItem('signup-nickname');
  }, []);

  return (
    <>
      <Head>
        <meta name="robots" content="noindex" />
      </Head>
      <OnboardingLayout>
        <div className="flex flex-col min-h-screen mx-auto w-[90%] max-w-[400px] pt-[120px] gap-[52px]">
          <div className="flex w-full flex-col gap-[12px] justify-center items-center">
            <Title
              text={
                nickname && nickname.trim().length > 0
                  ? `안녕하세요, ${nickname} 끈님`
                  : '안녕하세요!'
              }
            />
            <p className="text-center text-gray-60 text-reg-14 mb-[32px]">
              <p>회원가입이 완료되었어요!</p>
              <p>대학원 입학부터 졸업까지, 가방끈과 함께해요</p>
            </p>

            <Lottie
              animationData={welcomeAnimation}
              className="absolute w-full h-full pointer-events-none"
            />
            <div className="relative w-[124px] h-[124px] mb-[32px] ml-[11.5px]">
              <Image
                src="/images/[renewal]party.png"
                width={124}
                height={124}
                alt="환영합니다"
                className="absolute top-0 left-0"
              />
            </div>
            <button
              onClick={() => router.replace('/')}
              className="text-bold-20 text-white px-[30px] py-[17px] bg-normal rounded-[16px]"
            >
              커뮤니티 보러가기
            </button>
          </div>
        </div>
      </OnboardingLayout>
    </>
  );
};

export default UserSignupResultPage;
