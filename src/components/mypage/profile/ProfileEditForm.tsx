import { useState } from 'react';
import Image from 'next/image';
import { useImageUpload } from 'src/hooks/useImageUpload';

// Import icons from the mypage assets
import EditIcon from 'src/assets/icons/mypage/upload.svg';
import EyeIcon from 'src/assets/icons/mypage/eye.svg';
import CloseIcon from 'src/assets/icons/mypage/close.svg';
import { observer } from 'mobx-react';

interface ProfileEditFormProps {
  // 기본 정보
  name: string;
  nickname: string;
  email: string;
  phone: string;
  password?: string;
  profileImageUrl?: string;
  researchKeywords?: string[];

  // 상태 관리
  accessToken: string;
  isUpdating?: boolean;

  // 콜백 함수들
  onProfileImageChange?: (imageUrl: string) => void;
  onNicknameChange?: (nickname: string) => void;
  onPasswordChange?: (password: string) => void;
  onResearchKeywordAdd?: (keyword: string) => void;
  onResearchKeywordRemove?: (keyword: string) => void;
  onSave?: () => void;
}

const ProfileEditForm = ({
  name,
  nickname,
  email,
  phone,
  password = '',
  profileImageUrl,
  researchKeywords = [],
  accessToken,
  isUpdating = false,
  onProfileImageChange,
  onNicknameChange,
  onPasswordChange,
  onResearchKeywordAdd,
  onResearchKeywordRemove,
  onSave
}: ProfileEditFormProps) => {
  const [localNickname, setLocalNickname] = useState('');
  const [localPassword, setLocalPassword] = useState('');
  const [newKeyword, setNewKeyword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleNicknameChange = (value: string) => {
    setLocalNickname(value);
    onNicknameChange?.(value);
  };

  const handlePasswordChange = (value: string) => {
    setLocalPassword(value);
    onPasswordChange?.(value);
  };

  // 비밀번호 유효성 검사 함수
  const isPasswordValid = (pwd: string): boolean => {
    if (pwd.length === 0) return true; // 빈 문자열은 유효한 것으로 처리 (아직 입력하지 않음)
    if (pwd.length < 6 || pwd.length > 20) return false;

    const hasLetter = /[a-zA-Z]/.test(pwd);
    const hasNumber = /\d/.test(pwd);

    return hasLetter && hasNumber;
  };

  const passwordValid = isPasswordValid(localPassword);


  // 이미지 업로드 훅 사용
  const { isUploading, triggerImageUpload, ImageUploadInput } = useImageUpload({
    onImageChange: onProfileImageChange,
    accessToken
  });

  const handleAddKeyword = () => {
    if (newKeyword.trim() && !researchKeywords.includes(newKeyword.trim())) {
      onResearchKeywordAdd?.(newKeyword.trim());
      setNewKeyword('');
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    onResearchKeywordRemove?.(keyword);
  };

  const isDisabled = isUploading || isUpdating;
  const isSaveDisabled = isDisabled || (localPassword===''&&localNickname==='');
  return (
    <div className="bg-white flex flex-col gap-8 p-10 rounded-2xl w-full">
      {/* Header */}
      <div className="flex items-center justify-between w-full">
        <h1 className="text-bold-36 text-gray-90 leading-[44px]">회원정보 수정</h1>
        <div className="flex gap-3 items-center">
          <p className="text-med-14 text-gray-70 leading-5">
            이름과 전화번호 변경 희망할 시 채널톡으로 문의해주세요
          </p>
          <button
            onClick={onSave}
            disabled={isSaveDisabled}
            className="disabled:bg-gray-40 hover:bg-hover bg-normal transition-colors px-6 py-3 rounded-2xl disabled:cursor-not-allowed text-white disabled:text-gray-50"
          >
            <span className="text-semibold-16 leading-6">변경사항 저장하기</span>
          </button>
        </div>
      </div>

      {/* Profile Image */}
      <div className="relative w-[140px] h-[140px]">
        <div className="w-[140px] h-[140px] bg-gray-30 rounded-full flex items-center justify-center overflow-hidden">
          {profileImageUrl && (
            <Image
              src={profileImageUrl}
              alt="프로필 이미지"
              width={140}
              height={140}
              className="w-full h-full object-cover rounded-full"
            />
          )}
        </div>

        {/* Upload Button */}
        <button
          onClick={triggerImageUpload}
          disabled={isDisabled}
          className="absolute bottom-0 right-0 bg-gray-40 rounded-full p-2 hover:bg-gray-50 transition-colors flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUploading ? (
            <div className="w-6 h-6 border-2 border-gray-70 border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <EditIcon className="w-6 h-6 text-gray-70" />
          )}
        </button>
      </div>

      {/* Form Fields */}
      <div className="flex flex-col gap-8 w-full">
        {/* 이름 (읽기 전용) */}
        <div className="flex flex-col gap-2 w-full">
          <label className="text-med-14 text-gray-90 leading-5">이름</label>
          <div className="bg-gray-40 flex items-center p-5 rounded-xl w-full border border-gray-30">
            <span className="text-reg-16 text-gray-60 leading-[22px]">{name}</span>
          </div>
        </div>

        {/* 닉네임 (편집 가능) */}
        <div className="flex flex-col gap-2 w-full">
          <label className="text-med-14 text-gray-90 leading-5">닉네임</label>
          <div className="bg-gray-20 flex items-center p-5 rounded-xl w-full border border-gray-30">
            <input
              type="text"
              value={localNickname || ''}
              onChange={(e) => handleNicknameChange(e.target.value)}
              className="text-reg-16 text-gray-90 leading-[22px] bg-transparent outline-none w-full placeholder:text-gray-90"
              disabled={isDisabled}
              placeholder={nickname}
            />
          </div>
        </div>

        {/* 이메일 주소 (읽기 전용) */}
        <div className="flex flex-col gap-2 w-full">
          <label className="text-med-14 text-gray-90 leading-5">이메일 주소</label>
          <div className="bg-gray-40 flex items-center p-5 rounded-xl w-full border border-gray-30">
            <span className="text-reg-16 text-gray-60 leading-[22px]">
              {email || "이메일 정보가 없습니다"}
            </span>
          </div>
        </div>

        {/* 비밀번호 (편집 가능) */}
        <div className="flex flex-col gap-2 w-full">
          <label className="text-med-14 text-gray-90 leading-5">비밀번호</label>
          <div className={`bg-gray-20 flex items-center justify-between p-5 rounded-xl w-full border ${
            passwordValid ? 'border-gray-30' : 'border-red'
          }`}>
            <input
              type={showPassword ? 'text' : 'password'}
              value={localPassword || ''}
              onChange={(e) => handlePasswordChange(e.target.value)}
              className="text-reg-16 text-gray-90 leading-[22px] bg-transparent outline-none flex-1"
              disabled={isDisabled}
              placeholder="새 비밀번호를 입력해주세요"
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="ml-2 w-6 h-6 flex items-center justify-center"
            >
              <EyeIcon className="w-5 h-[14px] text-gray-60" />
            </button>
          </div>
          <p className={'text-reg-14 leading-5 text-gray-70'}>
            영문 알파벳과 숫자 각각 최소 1자 이상 포함해주세요 (6자~20자)
          </p>
        </div>

        {/* 전화번호 (읽기 전용) */}
        <div className="flex flex-col gap-2 w-full">
          <label className="text-med-14 text-gray-90 leading-5">전화번호</label>
          <div className="bg-gray-40 flex items-center p-5 rounded-xl w-full border border-gray-30">
            <span className="text-reg-16 text-gray-60 leading-[22px]">
              {phone || "전화번호 정보가 없습니다"}
            </span>
          </div>
        </div>

        {/* 연구분야 */}
        <div className="flex flex-col gap-3 w-full">
          <div className="flex flex-col gap-2 w-full">
            <label className="text-med-14 text-gray-90 leading-5">연구분야</label>
            <div className="flex gap-2 items-start w-full">
              <div className="flex-1 bg-gray-20 flex items-center p-5 rounded-xl border border-gray-30">
                <input
                  type="text"
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  placeholder="관심있는 연구 키워드를 입력해주세요"
                  className="text-reg-16 text-gray-90 leading-[22px] bg-transparent outline-none w-full placeholder-gray-50"
                  disabled={isDisabled}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddKeyword()}
                />
              </div>
              <button
                onClick={handleAddKeyword}
                disabled={isDisabled || !newKeyword.trim()}
                className="bg-gray-40 hover:bg-gray-50 transition-colors px-5 py-4 rounded-2xl h-[62px] flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="text-semibold-16 text-gray-50 leading-6">추가하기</span>
              </button>
            </div>
          </div>

          {/* 연구 키워드 태그들 */}
          {researchKeywords.length > 0 && (
            <div className="flex gap-2 flex-wrap w-full">
              {researchKeywords.map((keyword, index) => (
                <div
                  key={index}
                  className="bg-gray-20 flex gap-2 items-center px-4 py-2 rounded-[20px]"
                >
                  <span className="text-reg-16 text-gray-90 leading-[22px]">{keyword}</span>
                  <button
                    onClick={() => handleRemoveKeyword(keyword)}
                    className="w-5 h-5 flex items-center justify-center"
                    disabled={isDisabled}
                  >
                    <CloseIcon className="" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Hidden Image Upload Input */}
      <ImageUploadInput />
    </div>
  );
};

export default observer(ProfileEditForm);