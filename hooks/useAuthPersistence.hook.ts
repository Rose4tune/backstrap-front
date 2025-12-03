import React from 'react';
import { useCookies } from 'react-cookie';

/**
 * constants
 */
import { COOKIE_NS } from '@constants/common/cookie.constant';

import authContext from '@contexts/auth.context';

export default function useAuthPersistence(
  shouldLoad?: boolean
): [AuthPayload | undefined, (authPayload: AuthPayload) => void, () => void] {
  const [cookie, setCookie, removeCookie] = useCookies(); //쿠키 상태 조작

  const { loadAuthPayload } = React.useContext(authContext);

  React.useEffect(() => {
    if (shouldLoad) {
      loadAuthPayload(cookie[COOKIE_NS]?.authPayload); //쿠키 키(최상위 객체)에 authpayload 업로드
    }
  }, [shouldLoad]);

  return [
    cookie[COOKIE_NS]?.authPayload, //현재 쿠키에서 가져온 authpayload 반환
    authPayload => {
      setCookie(
        COOKIE_NS,
        {
          authPayload //기존 쿠키 객체에 authpayload만 저장
        },
        { path: '/' } //모든 경로에서 접근 가능
      );
    },
    () => {
      removeCookie(COOKIE_NS, { path: '/' }); //쿠키에서 authpayload 제거
    }
  ];
}
