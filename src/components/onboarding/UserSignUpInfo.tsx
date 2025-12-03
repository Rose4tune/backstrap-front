import { useEffect, useState } from 'react';
import TextField from '@common/input/TextField';
import { useDebouncedValue } from '@hooks/UseDebouncedValue';
import { userSignupStore } from '@stores/useSignupStore';
import { isExistsNickName } from '@apis/onboarding/isNickNameExists';
import { isEmailExist } from '@apis/onboarding/isEmailExist';

type ButtonStatusType = 'active' | 'click' | 'disable' | 'hover' | 'loading' | 'empty';

interface UserSignUpInfoInterface {
  setButtonStatus: React.Dispatch<React.SetStateAction<ButtonStatusType>>;
  isSocialUser: boolean;
  isKakao: boolean;
}

const SESSION_KEY = 'user_signup_info';

//닉네임, 이메일 onBlur될 때 중복여부 API로 판단하여 에러메시지 보내기
//초기 에러 점검은 onBlur시에 가동, 이후에는 onChange 디바운싱해서 에러 점검
export default function UserSignUpInfo({
  setButtonStatus,
  isSocialUser,
  isKakao
}: UserSignUpInfoInterface) {
  //이름
  const [name, setName] = useState('');
  //닉네임 debounce 적용
  const [nickname, setNickname] = useState('');
  const debouncedNickname = useDebouncedValue(nickname, 500);
  //이메일 debounce 적용
  const [email, setEmail] = useState('');
  const debouncedEmail = useDebouncedValue(email, 500);
  //비밀번호
  const [password, setPassword] = useState('');
  //비밀번호 확인
  const [passwordCheck, setPasswordCheck] = useState('');

  //저장
  userSignupStore.update({
    name: nickname,
    realName: name,
    email: email,
    password: password
  });

  //에러 상태 관리
  // const [nameError, setNameError] = useState(false);
  //닉네임 에러 상태 관리
  const [nicknameError, setNicknameError] = useState(false);
  const [nicknameErrorMessage, setNickNameErrorMessage] = useState<string>('');
  //이메일 에러 상태 관리
  const [emailValidationError, setEmailValidationError] = useState(false); //유효성 검사
  const [emailDuplicateError, setEmailDuplicateError] = useState(false); //중복 검사 에러러
  const [emailErrorMessage, setEmailErrorMessage] = useState('');
  //패스워드 에러 상태 관리
  const [passwordError, setPasswordError] = useState(false);
  const [passwordCheckError, setPasswordCheckError] = useState(false);

  // 이메일 형식 유효성 검사
  const isValidEmail = (email: string) => {
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    return emailRegex.test(email);
  };

  // 비밀번호 형식 유효성 검사
  function isValidPassword(password: string): boolean {
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*(),.?":{}|<>[\]\\\/'`~\-_=+]{6,20}$/; //todo: 특수문자 되는거 명시적이게 보여주기
    return passwordRegex.test(password);
  }

  // 버튼 활성화 조건
  useEffect(() => {
    // 소셜X: 모든 입력 + 패스워드 OK
    if (!isSocialUser) {
      const ok =
        !!name &&
        !!nickname &&
        !!password &&
        !!passwordCheck &&
        !nicknameError &&
        !passwordError &&
        !passwordCheckError &&
        // 이메일은 카카오가 아니면 필요
        (!isKakao ? !!email && !emailValidationError && !emailDuplicateError : true);

      setButtonStatus(ok ? 'active' : 'disable');
      return;
    }

    // 소셜 유저: 기본적으로 이름/닉네임 OK
    // 이메일은 카카오가 아니면 필요, 카카오는 제외
    const okSocial =
      !!name &&
      !!nickname &&
      !nicknameError &&
      (isKakao ? true : !!email && !emailValidationError && !emailDuplicateError);

    setButtonStatus(okSocial ? 'active' : 'disable');
  }, [
    isSocialUser,
    isKakao,
    name,
    nickname,
    email,
    password,
    passwordCheck,
    nicknameError,
    emailValidationError,
    emailDuplicateError,
    passwordError,
    passwordCheckError,
    setButtonStatus,
  ]);

  // 닉네임 중복 확인
  useEffect(() => {
    const trimmed = debouncedNickname.trim();

    if (trimmed.length === 0) {
      setNicknameError(false);
      setNickNameErrorMessage('');
      return;
    }

    const checkNickname = async () => {
      const response = await isExistsNickName(trimmed);
      if (response.success) {
        //응답 성공적으로 왔을 때
        if (response.data) {
          setNicknameError(true);
          setNickNameErrorMessage('중복하는 닉네임이 있습니다.');
        } else {
          setNicknameError(false);
          setNickNameErrorMessage('');
        }
      } else {
        setNicknameError(true);
        setNickNameErrorMessage(
          response.messages || '닉네임 확인 중 오류가 발생했습니다.'
        );
      }
    };

    checkNickname();
  }, [debouncedNickname]);

  // 이메일 중복/유효성 검사 (카카오는 완전 스킵)
  useEffect(() => {
    if (isKakao) {
      // 카카오면 이메일 관련 에러/메시지 리셋
      setEmailValidationError(false);
      setEmailDuplicateError(false);
      setEmailErrorMessage('');
      return;
    }

    const trimmed = debouncedEmail.trim();

    if (trimmed.length === 0) {
      setEmailValidationError(false);
      setEmailDuplicateError(false);
      setEmailErrorMessage('');
      return;
    }

    if (!isValidEmail(trimmed)) {
      setEmailDuplicateError(false);
      if (trimmed.length <= 2) {
        setEmailValidationError(false);
        setEmailErrorMessage('');
      } else {
        setEmailValidationError(true);
        setEmailErrorMessage('올바른 이메일 형식이 아닙니다.');
      }
      return;
    }

    (async () => {
      setEmailValidationError(false);
      const response = await isEmailExist(trimmed);
      if (response.success) {
        if (response.data) {
          setEmailDuplicateError(true);
          setEmailErrorMessage(response.messages || '이미 사용중인 이메일입니다.');
        } else {
          setEmailDuplicateError(false);
          setEmailErrorMessage('');
        }
      } else {
        setEmailDuplicateError(true);
        setEmailErrorMessage(response.messages || '이메일 확인 중 오류가 발생했습니다.');
      }
    })();
  }, [debouncedEmail, isKakao]);

  // 세션 정보 불러오기
  useEffect(() => {
    const saved = sessionStorage.getItem(SESSION_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      setName(parsed.name || '');
      setNickname(parsed.nickname || '');
      setEmail(parsed.email || '');
    }
  }, []);

  // 세션 정보 변경 시 저장 → 불러오기가 끝난 이후 변경될 때만 작동
  useEffect(() => {
    if (name || nickname || email) {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify({ name, nickname, email }));
    }
  }, [name, nickname, email]);

  return (
    <div className="flex flex-col gap-[24px] pb-[173px]">
      <TextField
        title="이름"
        device="pc"
        description="실명을 입력해주세요"
        placeholder="이름을 입력해주세요"
        value={name}
        onChange={val => {
          setName(val);
        }}
      />
      <TextField
        title="닉네임"
        device="pc"
        placeholder="커뮤니티에서 사용할 닉네임을 입력해주세요"
        value={nickname}
        onChange={setNickname}
        isError={nicknameError}
        errorMessage={nicknameErrorMessage}
      />
      {!isKakao && <TextField
        title="이메일"
        device="pc"
        placeholder="로그인할 때 사용할 이메일을 입력해주세요"
        value={email}
        onChange={setEmail}
        isError={emailValidationError || emailDuplicateError}
        errorMessage={emailErrorMessage}
      />}
      {!isSocialUser && (
        <TextField
          title="비밀번호"
          device="pc"
          placeholder="사용하실 비밀번호를 입력해주세요"
          description="영문과 숫자 각각 최소 1자 이상 포함해주세요 (6자~20자)"
          value={password}
          onChange={val => {
            setPassword(val);
            setPasswordError(!isValidPassword(val));
          }}
          isError={passwordError}
          errorMessage="영문과 숫자 각각 최소 1자 이상 포함해주세요 (6자~20자)"
        />
      )}
      {!isSocialUser && (
        <TextField
          title="비밀번호 확인"
          device="pc"
          placeholder="비밀번호를 다시 입력해주세요"
          value={passwordCheck}
          onChange={val => {
            setPasswordCheck(val);
            setPasswordCheckError(val !== password);
          }}
          isError={passwordCheckError}
          errorMessage="비밀번호가 일치하지 않습니다."
        />
      )}
    </div>
  );
}
