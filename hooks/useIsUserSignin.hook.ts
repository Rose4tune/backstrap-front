// hooks/useIsUserSignin.hook.ts
import { useContext } from 'react';
import authContext from '@contexts/auth.context';
import useAuthPersistence from './useAuthPersistence.hook';

/**
 * 사용자가 로그인한 상태인지 여부를 반환하는 훅
 * - Context 또는 쿠키에 authPayload가 존재하면 true
 */
export default function useIsUserSignin(): boolean {
  const { authPayload: contextPayload } = useContext(authContext);
  const [cookiePayload] = useAuthPersistence();

  return !!contextPayload || !!cookiePayload;
}
