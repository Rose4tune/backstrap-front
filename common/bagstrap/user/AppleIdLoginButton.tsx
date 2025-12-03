import Image from 'next/image';
import { useCookies } from 'react-cookie';
import { COOKIE_NS_APPLE_OAUTH } from '@constants/common/cookie.constant';
import BaseButton from '@common/button/BaseButton';

export interface AppleIdLoginButtonProps {}

const AppleIdLoginButton = (props: AppleIdLoginButtonProps): JSX.Element => {
  const [cookie, setCookie] = useCookies();

  const state = cookie?.[COOKIE_NS_APPLE_OAUTH]?._state;

  return (
    <BaseButton
      onClick={() => {
        setCookie(
          //이전에 저장된 쿠키 먼저 읽음
          COOKIE_NS_APPLE_OAUTH,
          {
            state //보안방지용 저장
          },
          {
            path: '/'
          }
        );

        AppleID.auth.signIn(); //애플로그인창 띄움
      }}
    >
      <Image src="/images/[renewal]apple.png" alt="애플 로그인" width={52} height={52} />
    </BaseButton>
  );
};

export default AppleIdLoginButton;
