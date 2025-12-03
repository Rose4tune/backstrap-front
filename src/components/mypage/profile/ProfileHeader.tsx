import Image from 'next/image';

// Import icons from the mypage assets
import EditIcon from 'src/assets/icons/mypage/upload.svg';
import SchoolIcon from 'src/assets/icons/mypage/school.svg';
import SchoolCapIcon from 'src/assets/icons/mypage/school-cap.svg';
import Link from 'next/link';

// Import image upload hook
import { useImageUpload } from 'src/hooks/useImageUpload';

interface ProfileHeaderProps {
  name: string;
  nickname: string;
  university: string;
  department: string;
  profileImageUrl?: string;
  onProfileImageChange?: (imageUrl: string) => void;
  accessToken: string;
  isUpdating?: boolean;
}

const ProfileHeader = ({
  name,
  nickname,
  university,
  department,
  profileImageUrl,
  onProfileImageChange,
  accessToken,
  isUpdating = false
}: ProfileHeaderProps) => {
  // 이미지 업로드 훅 사용
  const { isUploading, triggerImageUpload, ImageUploadInput } = useImageUpload({
    onImageChange: onProfileImageChange,
    accessToken
  });

  const isDisabled = isUploading || isUpdating;

  return (
    <div className="flex items-start justify-between w-full">
      {/* Profile Section */}
      <div className="flex gap-6 items-start">
        {/* Profile Picture */}
        <div className="relative w-[140px] h-[140px]">
          <div className="w-[140px] h-[140px] bg-gray-30 rounded-full flex items-center justify-center overflow-hidden">
            {profileImageUrl && (
              <Image
                src={profileImageUrl}
                alt={`${name}의 프로필 이미지`}
                width={140}
                height={140}
                className="w-full h-full object-cover rounded-full"
              />
            )}
          </div>

          {/* Edit Button */}
          <button
            onClick={triggerImageUpload}
            disabled={isDisabled}
            className="absolute bottom-0 right-0 bg-gray-40 rounded-full p-2 hover:bg-gray-50 transition-colors flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading || isUpdating ? (
              <div className="w-6 h-6 border-2 border-gray-70 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <EditIcon className="w-6 h-6 text-gray-70" />
            )}
          </button>
        </div>

        {/* Profile Information */}
        <div className="flex flex-col gap-2 py-3">
          {/* Name and Nickname */}
          <div className="flex items-end gap-3">
            <h1 className="text-bold-24 text-gray-90 leading-8">{name}</h1>
            <span className="text-bold-20 text-gray-50 leading-7">{nickname}</span>
          </div>

          {/* University */}
          <div className="flex items-center gap-1">
            <SchoolCapIcon className="w-6 h-6 text-gray-60" />
            <span className="text-semibold-16 text-gray-60">{university}</span>
          </div>

          {/* Department */}
          <div className="text-semibold-16 text-gray-60">
            {department}
          </div>
        </div>
      </div>

      {/* Edit Profile Button */}
      <Link
        href="/mypage/profile/edit"
        className="bg-gray-30 hover:bg-gray-40 transition-colors px-3 py-2 rounded-lg h-[34px] flex items-center"
      >
        <span className="text-semibold-14 text-gray-90">프로필 편집</span>
      </Link>

      {/* Hidden Image Upload Input */}
      <ImageUploadInput />
    </div>
  );
};

export default ProfileHeader;