import Image from 'next/image';
import { useCookies } from 'react-cookie';
import { generateOAuthState } from '@utils/auth/oauth.util';
import { COOKIE_NS_KAKAO_OAUTH } from '@constants/common/cookie.constant';
import BaseButton from '@common/button/BaseButton';

export interface KakaoLoginButtonProps {}

const KAKAO_JAVASCRIPT_KEY = process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY;
const KAKAO_LOGIN_REDIRECT_URI = process.env.NEXT_PUBLIC_KAKAO_LOGIN_REDIRECT_URI;

const KakaoLoginButton = (props: KakaoLoginButtonProps): JSX.Element => {
  const {} = props;

  const [, setCookie] = useCookies();

  return (
    <BaseButton
      onClick={() => {
        if (Kakao && KAKAO_LOGIN_REDIRECT_URI) {
          if (!Kakao.isInitialized()) {
            Kakao.init(KAKAO_JAVASCRIPT_KEY);
          }

          const state = generateOAuthState();

          setCookie(
            COOKIE_NS_KAKAO_OAUTH,
            {
              state
            },
            {
              path: '/'
            }
          );

          Kakao.Auth.authorize({
            redirectUri: KAKAO_LOGIN_REDIRECT_URI,
            state
          });
        }
      }}
    >
      <Image
        src="/images/[renewal]kakao.png"
        alt="카카오 로그인"
        width={52}
        height={52}
      />
    </BaseButton>
  );
};

export default KakaoLoginButton;
