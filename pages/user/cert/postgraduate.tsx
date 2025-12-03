import clsx from 'clsx';
import React, { useCallback, useEffect } from 'react';
import { useRouter } from 'next/router';
import { observer } from 'mobx-react';
import Head from 'next/head';

import { useStore } from '@stores/useStore.hook';
import { SchoolVerificationStatus } from '@generated/graphql';
import { checkAuthenticated } from '@utils/auth/auth.util';
import PageLayout from '@layouts/PageLayout';
import useAuthPayload from '@hooks/useAuthPayload.hook';
import BagstrapSymbolLogo from '@public/logos/logo-bagstrap-symbol.svg';
import PostgradCertForm from '@common/bagstrap/school/PostgradCertForm';

function PostGraduateCertPage() {
  const router = useRouter();
  const { MeStore } = useStore();

  const authPayload = useAuthPayload();

  const isLogin =
    checkAuthenticated(authPayload) &&
    !authPayload.isSignup &&
    MeStore.getMe().schoolVerificationStatus !== SchoolVerificationStatus.None;

  // useEffect(() => {
  //   router.beforePopState(({ url, as, options }) => {
  //     if (as == '/user/cert') {
  //       console.log(url, as)
  //       router.back()
  //       return false
  //     }

  //     return true
  //   })
  // }, [])

  return (
    <>
      <Head>
        <meta name="robots" content="noindex" />
      </Head>

      <PageLayout logoOnly>
        <div
          className={clsx(
            'max-w-[484px] mx-auto',
            'md:border md:border-grey2 md:rounded-[10px] md:my-7'
          )}
        >
          {/* header */}
          <div className={clsx('px-6 py-5 space-y-5', 'md:px-8 md:py-9 md:space-y-8')}>
            <div
              className={clsx(
                'w-100% h-[76px] bg-[#EFF6F6] rounded-2xl px-[14px]',
                'flex items-center justify-between'
              )}
            >
              <div className="align-middle md:text-[14px] text-[12px]">
                학교인증 후 타학교 대학원생들을 만나보세요!
                <br />
                시간표/채용추천/멘토활동이 가능해져요
              </div>
              <BagstrapSymbolLogo className="w-[56px] h-[37px]" />
            </div>
          </div>

          {/* body */}
          <section className={clsx('px-6 pb-9', 'md:px-8')}>
            <PostgradCertForm
              onSubmit={() => {
                if (isLogin) router.push('/my/profile');
                else router.push('/user/sign-up/welcome');
              }}
            />
          </section>
        </div>
      </PageLayout>
    </>
  );
}

export default observer(PostGraduateCertPage);
