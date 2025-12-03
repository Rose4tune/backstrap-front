import { useEffect, useState } from 'react';
import LoginButton from './LoginButton';
import useHttpPostOAuthToken from '@hooks/bagstrap/user/useHttpPostOAuthToken.hook';
import UserIdInput from './UserIdInput';
import UserPwInput from './UserPwInput';
import { string } from 'yup';

type InputStatusType = 'default' | 'writing' | 'error' | 'done' | 'still';

const resolveErrorMessage = (errorCode: string): string | undefined => {
  if (errorCode === 'unauthorized') {
    return '존재하지 않는 아이디입니다.';
  }

  if (errorCode === 'invalid_grant') {
    return '잘못된 비밀번호입니다. 다시 시도하거나 비밀번호를 재설정하세요.';
  }
};

export interface UserSigninFormProps {
  onSignin?: (result: AuthPayload) => void;
  queryId?: string | string[];
}

export default function UserSigninForm({ onSignin, queryId }: UserSigninFormProps) {
  //현재 input 창 status 상태관리
  const [idInputStatus, setIdInputStatus] = useState<InputStatusType>('default');
  const [pwInputStatus, setPwInputStatus] = useState<InputStatusType>('default');
  //value 상태관리
  const [idInput, setIdInput] = useState<string>('');
  const [pwInput, setPwInput] = useState<string>('');
  //비밀번호 보임 상태 관리: form 제출 시 password type으로 backend로 전송하기 위해 비밀번호 입력 컴포넌트가 아닌 여기서 관리
  const [pwVisible, setPwVisible] = useState<boolean>(false);

  //errorcode 상태관리
  const [errorCode, setErrorCode] = useState<string | undefined>();
  //state는 server 응답, signinWithEmail은 id, pw 받는 함수
  const [state, signinWithEmail] = useHttpPostOAuthToken();
  //버튼 로딩상태 관리 : 커스텀훅 state와 연동
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const errorMessage = errorCode && resolveErrorMessage(errorCode);

  //queryId 연결
  useEffect(() => {
    if (queryId && typeof queryId == 'string') {
      setIdInput(queryId);
    }
  }, [setIdInput, queryId]);

  useEffect(() => {
    //로그인 응답이 왔을 때
    if (state?.result) {
      onSignin?.(state.result);
      if (state?.loading) {
        //loading state true이면 loading 상태로 유지
        setIsLoading(true);
      } else {
        //loading state false여도 success 상태이면 리다이렉트 전까지 계속 로딩 표시(UX 측면)
        if (!state?.error) {
          setIsLoading(true);
        } else {
          setIsLoading(false);
        }
      }
    }
    //에러 코드 관리
    if (state?.error) {
      setErrorCode(state.error);

      if (state.error === 'unauthorized') {
        setIdInputStatus('error');
      }
      if (state.error === 'invalid_grant') {
        setPwInputStatus('error');
      }
    }
  }, [state]);

  /*제출 시 동작 */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); //기본 제출 방지
    setErrorCode(undefined);
    setPwVisible(false);
    signinWithEmail(idInput, pwInput);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col flex-1 gap-[52px]">
      <div className="flex flex-1 flex-col gap-[24px]">
        <UserIdInput
          device={'pc'}
          placeholder="이메일을 입력해주세요."
          inputStatus={idInputStatus}
          setInputStatus={setIdInputStatus}
          value={idInput}
          setValue={setIdInput}
          errorMessage={'존재하지 않는 아이디입니다.'}
        />
        <UserPwInput
          device={'pc'}
          placeholder="비밀번호를 입력해주세요."
          inputStatus={pwInputStatus}
          setInputStatus={setPwInputStatus}
          value={pwInput}
          setValue={setPwInput}
          pwVisible={pwVisible}
          setPwVisible={setPwVisible}
          errorMessage={'잘못된 비밀번호입니다. 다시 시도하거나 비밀번호를 재설정하세요.'}
        />
      </div>

      <LoginButton
        isLoading={isLoading}
        idInputStatus={idInputStatus}
        pwInputStatus={pwInputStatus}
        idInputValue={idInput}
        pwInputValue={pwInput}
      />
    </form>
  );
}
