import React, { useEffect } from 'react';
import { useRouter } from 'next/router';

import authContext from '@contexts/auth.context';

import useAuthPersistence from './useAuthPersistence.hook';
import { useStore } from '@stores/useStore.hook';

export default function useUserAuthSign(): [
  AuthPayload | undefined,
  (authPayload: AuthPayload, redirectUri?: string) => void
] {
  const router = useRouter();
  const { UserStore } = useStore();

  const [authPayload, persistAuthPayload] = useAuthPersistence(); // 쿠키에 저장된 인증정보, 인증 저장하는 함수 불러오기

  const { loadAuthPayload } = React.useContext(authContext); //전역 컨텍스트에서 인증 정보를 메모리 상에 로드
  return [
    authPayload, //현재 쿠키에 인증된 저장 정보 반환
    async(authPayload, redirectUri) => {
      loadAuthPayload(authPayload); //context에 업로드

      persistAuthPayload(authPayload); //쿠키에 저장

      // useMeQuery({ fetchPolicy: "network-only" });
      if(redirectUri==='careermo') {
        await UserStore.fetchUser();
        router.replace(`https://career.bagstrap.team/mo/home/web/guest?token=${UserStore.getAccessToken()}`)
        // router.replace('http://localhost:3000'+`?token=${UserStore.getAccessToken()}`)
      }
      else if (redirectUri) {
        router.replace(redirectUri); //리다이렉트
      }
    }
  ];
}
