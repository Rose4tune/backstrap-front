import React from 'react';

export interface AuthContextValue {
  readonly isLoaded?: boolean; //auth 상태가 로드 되었나?

  readonly authPayload?: AuthPayload; //로그인 사용자 정보

  readonly loadAuthPayload: (authPayload: AuthPayload) => void; //authpayload를 context에 로드

  readonly resetAuthPayload?: (shouldResetPersistence?: boolean) => void; //authpayload 초기화
}

export default React.createContext<AuthContextValue>({
  loadAuthPayload: () => {} //초기값 빈함수 가지는 context 생성
});
