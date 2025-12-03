import BaseLink from '@common/BaseLink';

export default function AuthSupportLink() {
  return (
    <div className="flex flex-1 justify-between items-center">
      <BaseLink
        href="/user/id"
        className="flex flex-1 justify-center items-center text-reg-14 text-gray-50"
      >
        아이디 찾기
      </BaseLink>

      <div className="w-[1.5px] h-[13px] bg-gray-40 mx-[8px]" />
      <BaseLink
        href="/user/password"
        className="flex flex-1 justify-center items-center text-reg-14 text-gray-50"
      >
        비밀번호 찾기
      </BaseLink>
      <div className="w-[1.5px] h-[13px] bg-gray-40 mx-[8px]" />
      <BaseLink
        href="/user/sign-up"
        className="flex flex-1 justify-center items-center text-reg-14 text-gray-50"
      >
        회원가입
      </BaseLink>
    </div>
  );
}
