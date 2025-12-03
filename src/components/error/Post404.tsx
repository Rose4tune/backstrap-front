import React from 'react';
import { useRouter } from 'next/router';
import DeleteIcon from '@assets/icons/community/delete.svg';

interface Post404Props {
  className?: string;
}

const Post404: React.FC<Post404Props> = ({ className = '' }) => {
  const router = useRouter();

  const handleGoHome = () => {
    router.push('/');
  };

  return (
    <div className={`flex flex-col items-center justify-center px-[20px] py-[200px] ${className}`}>
      {/* 🗑️ 삭제 아이콘 */}
      <div className="w-10 h-10 mb-3 m:mb-6 text-gray-60">
        <DeleteIcon className="w-full h-full" />
      </div>

      {/* 제목 */}
      <div className="mb-6">
        <p className="text-semibold-22 m:text-bold-24 text-[#47484c] text-center tracking-[-0.552px] leading-[1.334]">
          삭제된 게시글이에요
        </p>
      </div>

      {/* 홈으로 가기 버튼 */}
      <div className="w-[220px] m:w-[200px] py-0 m:py-5">
        <button
          onClick={handleGoHome}
          className="w-full py-3 m:py-[17px] bg-[#10e4d5] text-white text-semibold-16 m:text-bold-20 rounded-2xl
                   hover:bg-[#0dd4c5] transition-colors duration-200 tracking-[-0.4px]"
          type="button"
        >
          가방끈 홈으로 가기
        </button>
      </div>
    </div>
  );
};

export default Post404;