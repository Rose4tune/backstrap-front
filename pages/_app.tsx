/* eslint-disable @next/next/no-sync-scripts */
import React, { useCallback, useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import Head from 'next/head';
import type { AppProps } from 'next/app';
import Script from 'next/script';

import { StoreProvider } from '@stores/index';
import { useStore } from '@stores/useStore.hook';

import { ApolloProvider } from '@apollo/client';

import '@styles/global.style.scss';

import { generateOAuthState } from '@utils/auth/oauth.util';

import {
  COOKIE_NS,
  COOKIE_NS_APPLE_OAUTH,
  COOKIE_NS_KAKAO_OAUTH
} from '@constants/common/cookie.constant';

import { useApollo } from '@libs/apolloClient';

import AuthContext from '@contexts/auth.context';

import useErrorVar from '@hooks/useErrorVar.hook';
import useAuthContext from '@hooks/useAuthContext.hook';
import useAuthPersistence from '@hooks/useAuthPersistence.hook';

import ErrorBoundary from '@common/ErrorBoundary';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { theme } from '@styles/themes/theme';

import { CacheProvider, EmotionCache } from '@emotion/react';
import { cache } from '@styles/emotion-cache';
import mixpanel from 'mixpanel-browser';
import getMe from 'src/apis/user/getMe';
import { access } from 'fs';
import { useSearchParams } from 'next/navigation';

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

const GTM_CONTAINER_ID = process.env.NEXT_PUBLIC_GTM_CONTAINER_ID;
const KAKAO_JAVASCRIPT_KEY = process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY;
const APPLEID_CLIENT_ID = process.env.NEXT_PUBLIC_APPLEID_CLIENT_ID ?? '';
const APPLEID_SIGNIN_REDIRECT_URI = process.env.NEXT_PUBLIC_APPLEID_SIGNIN_REDIRECT_URI;
// BASE_URL: 환경 변수가 있으면 사용, 없으면 Vercel 배포 URL 사용
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 
                 (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://backstrap-front.vercel.app');

function App({ Component, pageProps }: AppProps) {
  const apolloClient = useApollo(pageProps);

  const authContext = useAuthContext();

  const [authGuardModalDialog] = useErrorVar();

  const [cookie, setCookie] = useCookies();

  const store = useStore();

  const channelTalk = useSearchParams().get('channelTalk');

  const accessToken =
    cookie[COOKIE_NS]?.authPayload?.access_token ||
    cookie[COOKIE_NS_APPLE_OAUTH]?.authPayload?.access_token ||
    cookie[COOKIE_NS_KAKAO_OAUTH]?.authPayload?.access_token;
  /* initialize store data */
  React.useEffect(() => {
    if (store.FaGroupStore.isEmpty()) {
      if (!!!pageProps.faGroups) {
        store.FaGroupStore.getFaGroups();
      } else {
        store.FaGroupStore.setFaGroups(pageProps.faGroups);
      }
    }
    if (store.MeStore.isEmpty()) {
      store.MeStore.getMe();
    }
  }, []);

  useAuthPersistence(true);

  const initKakao = useCallback(() => {
    if (Kakao && Kakao.isInitialized && Kakao.init && !Kakao.isInitialized()) {
      Kakao.init(KAKAO_JAVASCRIPT_KEY);
    }
  }, []);

  const initApple = useCallback(() => {
    if (AppleID && AppleID.auth && AppleID.auth.init) {
      const state = generateOAuthState();

      AppleID.auth.init({
        clientId: String(APPLEID_CLIENT_ID),
        scope: 'name email',
        redirectURI: APPLEID_SIGNIN_REDIRECT_URI,
        state,
        usePopup: false
      });

      setCookie(
        COOKIE_NS_APPLE_OAUTH,
        {
          state: cookie?.[COOKIE_NS_APPLE_OAUTH]?.state,
          _state: state
        },
        {
          path: '/'
        }
      );
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const ReactPixel = require('react-facebook-pixel').default;
      ReactPixel.init('478501071939181');
      ReactPixel.pageView();
    }
  }, []);
  useEffect(() => {
    mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_TOKEN as string, {
      debug: process.env.NODE_ENV === 'development'
    });
    mixpanel.register({
      platform: 'web'
    });
  }, []);

  useEffect(() => {
    if (channelTalk === 'hide') {
      console.log('채널톡 숨김 시도 시작...');

      let attempts = 0;
      const maxAttempts = 20; // 최대 10초간 시도

      const hideChannelIO = () => {
        attempts++;
        console.log(`채널톡 숨김 시도 ${attempts}/${maxAttempts}`);

        if (typeof window !== 'undefined') {
          // 채널톡 예상 위치에서 DOM 요소 직접 숨김
          const channelButton = document.querySelector('#ch-plugin');
          const channelFrame = document.querySelector('iframe[src*="channel.io"]');
          const channelScript = document.querySelector('div[id*="ch-plugin"]');

          if (channelButton) {
            (channelButton as HTMLElement).style.display = 'none';
            console.log('채널톡 버튼 DOM 숨김 성공');
          }

          if (channelFrame) {
            (channelFrame as HTMLElement).style.display = 'none';
            console.log('채널톡 iframe DOM 숨김 성공');
          }

          if (channelScript) {
            (channelScript as HTMLElement).style.display = 'none';
            console.log('채널톡 스크립트 DOM 숨김 성공');
          }

          // ChannelIO API 사용
          if ((window as any).ChannelIO) {
            try {
              (window as any).ChannelIO('hide');
              console.log('채널톡 API 숨김 성공');
              return; // 성공하면 더 이상 시도하지 않음
            } catch (error) {
              console.log('채널톡 API 에러:', error);
            }
          }

          // 아직 로드되지 않았거나 실패한 경우 재시도
          if (attempts < maxAttempts) {
            setTimeout(hideChannelIO, 500);
          } else {
            console.log('채널톡 숨김 최대 시도 횟수 초과');
          }
        }
      };

      // 즉시 시작
      hideChannelIO();

      // DOM 변경 감지로 동적으로 숨김
      const observer = new MutationObserver(() => {
        const channelElements = document.querySelectorAll('#ch-plugin, iframe[src*="channel.io"], div[id*="ch-plugin"]');
        channelElements.forEach(element => {
          (element as HTMLElement).style.display = 'none';
        });
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true
      });

      return () => {
        observer.disconnect();
      };
    }
  }, [channelTalk]);

  //유저 정보 불러와서 믹스패널과 동기화
  useEffect(() => {
    const fetchUser = async () => {
      if (!accessToken) return;
      // console.log(accessToken);
      const res = await getMe(accessToken);

      if (res.success && res.data) {
        const user = res.data;

        // Mixpanel identify
        // mixpanel.identify(user.uuid);
        // mixpanel.people.set({
        //   $name: user.name,
        //   $email: user.email
        // });
      }
    };

    fetchUser();
  }, [accessToken]);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) {
    return null;
  }

  return (
    <>
      <Head>
        <title>똑똑한 대학원 커뮤니티 생활, 가방끈</title>
        {/* Wanted Sans 로컬 폰트 프리로드 */}
        <link rel="preload" href="/fonts/WantedSansVariable.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/WantedSans-Regular.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/WantedSans-Medium.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/WantedSans-SemiBold.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/WantedSans-Bold.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="apple-touch-icon" sizes="57x57" href="/apple-icon-57x57.png" />
        <link rel="apple-touch-icon" sizes="60x60" href="/apple-icon-60x60.png" />
        <link rel="apple-touch-icon" sizes="72x72" href="/apple-icon-72x72.png" />
        <link rel="apple-touch-icon" sizes="76x76" href="/apple-icon-76x76.png" />
        <link rel="apple-touch-icon" sizes="114x114" href="/apple-icon-114x114.png" />
        <link rel="apple-touch-icon" sizes="120x120" href="/apple-icon-120x120.png" />
        <link rel="apple-touch-icon" sizes="144x144" href="/apple-icon-144x144.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/apple-icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-icon-180x180.png" />
        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href="/android-icon-192x192.png"
        />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="msapplication-TileImage" content="/ms-icon-144x144.png" />
        <meta name="theme-color" content="#ffffff" />

        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width user-scalable=no"
        />
        <meta
          name="description"
          content="가방끈 긴 당신을 위한 서비스: 대학원 커뮤니티 가방끈에서 시간표 마법사와 입시 멘토를 만나보세요"
        />

        {/* open graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={BASE_URL} />
        <meta property="og:title" content="똑똑한 대학원 커뮤니티 생활, 가방끈" />
        <meta
          property="og:description"
          content="가방끈 긴 당신을 위한 서비스: 대학원 커뮤니티 가방끈에서 시간표 마법사와 입시 멘토를 만나보세요"
        />
        <meta
          property="og:image"
          content={`${BASE_URL}/logos/logo-bagstrap-symbol.svg`}
        />

        {/* twitter card */}
        <meta name="twitter:title" content="똑똑한 대학원 커뮤니티 생활, 가방끈" />
        <meta name="twitter:creator" content="Bagstrap" />
        <meta name="twitter:site" content="@" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:description"
          content="가방끈 긴 당신을 위한 서비스: 대학원 커뮤니티 가방끈에서 시간표 마법사와 입시 멘토를 만나보세요"
        />

        {/* google search console */}
        <meta
          name="google-site-verification"
          content="I766rot4hsG5rg41-QMvaOoXsohSxJMW11gou65bpEo"
        />

        {/* <!-- Google Tag Manager --> */}
        {GTM_CONTAINER_ID && (
          <script
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${GTM_CONTAINER_ID}');`
            }}
          />
        )}
        {/* <!-- End Google Tag Manager --> */}

        {/* <!-- Google Tag Manager --> */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-P49N7F9T');`
          }}
        />
        {/* <!-- End Google Tag Manager --> */}

        {/* channel talk */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var w=window;if(w.ChannelIO){return w.console.error("ChannelIO script included twice.");}var ch=function(){ch.c(arguments);};ch.q=[];ch.c=function(args){ch.q.push(args);};w.ChannelIO=ch;function l(){if(w.ChannelIOInitialized){return;}w.ChannelIOInitialized=true;var s=document.createElement("script");s.type="text/javascript";s.async=true;s.src="https://cdn.channel.io/plugin/ch-plugin-web.js";var x=document.getElementsByTagName("script")[0];if(x.parentNode){x.parentNode.insertBefore(s,x);}}if(document.readyState==="complete"){l();}else{w.addEventListener("DOMContentLoaded",l);w.addEventListener("load",l);}})();

                            ChannelIO('boot', {
                              "pluginKey": "d855d87a-10fe-468b-a5c4-f87fa7f51883"
                            });`
          }}
        />
        {/* toss payments */}
        <script src="https://js.tosspayments.com/v2/standard"></script>

        {/* <!-- Google tag (gtag.js) --> */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-0CM153FG20" />
        <script
          dangerouslySetInnerHTML={{
            __html: `  window.dataLayer = window.dataLayer || [];
                            function gtag(){dataLayer.push(arguments);}
                            gtag('js', new Date());
                            gtag('config', 'G-0CM153FG20');`
          }}
        />
      </Head>
      {/* <!-- Meta Pixel Code --> */}
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=478501071939181&ev=PageView&noscript=1`}
        />
      </noscript>

      {/* <!-- Google Tag Manager (noscript) --> */}
      <noscript>
        <iframe
          src="https://www.googletagmanager.com/ns.html?id=GTM-P49N7F9T"
          height="0"
          width="0"
          style={{ display: 'none', visibility: 'hidden' }}
        ></iframe>
      </noscript>
      {/* <!-- End Google Tag Manager (noscript) --> */}

      {/* kakao sdk */}
      <Script
        src="https://t1.kakaocdn.net/kakao_js_sdk/2.0.1/kakao.min.js"
        integrity="sha384-eKjgHJ9+vwU/FCSUG3nV1RKFolUXLsc6nLQ2R1tD0t4YFPCvRmkcF8saIfOZNWf/"
        crossOrigin="anonymous"
        onLoad={initKakao}
      />

      {/* apple sdk */}
      <Script
        type="text/javascript"
        src="https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/ko_KR/appleid.auth.js"
        onLoad={initApple}
      />
      <Script
        id="fb-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `!function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
                          fbq('init', 478501071939181);
              fbq('track', 'PageView');
              `
        }}
      />
      <ErrorBoundary>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <ApolloProvider client={apolloClient}>
            <AuthContext.Provider value={authContext}>
              <StoreProvider {...pageProps}>
                {authGuardModalDialog}
                <Component {...pageProps} />
              </StoreProvider>
            </AuthContext.Provider>
          </ApolloProvider>
        </ThemeProvider>
      </ErrorBoundary>
    </>
  );
}

export default App;
