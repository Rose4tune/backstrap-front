import React from 'react';
import SchoolIcon from '@assets/icons/community/school.svg';
import PostMoreMenu from './PostMoreMenu';
import { PostHeaderProps } from './Post.types';
import { useStore } from '@stores/useStore.hook';
import { useMediaQuery } from '@mui/material';
import PostHeaderMobile from 'src/components/mobile/community/PostHeaderMobile';
import { useRouter } from 'next/router';
import { observer } from 'mobx-react';

const PostHeader = ({
  title,
  author,
  createdAt,
  onEdit,
  onDelete,
  onSendMessage,
  onBlockUser,
  onReportUser,
  isDeleteLoading = false,
  isBlockLoading = false,
  isReportLoading = false,
  category = '',
  categoryUuid
}: PostHeaderProps) => {
  const {UserStore} = useStore();
  const isMine = UserStore.getUUID() === author.id;
  const isMobile = useMediaQuery('(max-width:550px)');
  const router = useRouter();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).replace(/\./g, '.') + ' ' + date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };
  return (
    <header className="flex flex-col pb-5 relative gap-y-4">
      {isMobile &&
        <PostHeaderMobile category={category} categoryUuid={categoryUuid}>
          <PostMoreMenu
              isMine={isMine}
              onEdit={onEdit}
              onDelete={onDelete}
              onSendMessage={onSendMessage}
              onBlockUser={onBlockUser}
              onReportUser={onReportUser}
              isDeleteLoading={isDeleteLoading}
              isBlockLoading={isBlockLoading}
              isReportLoading={isReportLoading}
            />
        </PostHeaderMobile>
      }
      {!isMobile &&
      <>
        <div className='text-bold-20'>
          <span className='cursor-pointer text-gray-90' onClick={()=>{
            if(categoryUuid) router.push(`/community/${categoryUuid}?name=${category}`);
          }}>
            {category}
          </span>
        </div>
        <div className='w-full h-[1px] bg-gray-30 rounded-full'/>
      </>
      }
      {/* 제목과 더보기 메뉴 */}
      <div>
        <div className='flex flex-row justify-between relative'>
          <h1 className={`${isMobile?'text-bold-20':'text-bold-24'} text-gray-90 leading-[32px] tracking-[-0.4px] mb-2`}>
            {title}
          </h1>
          {!isMobile&&<PostMoreMenu
            isMine={isMine}
            onEdit={onEdit}
            onDelete={onDelete}
            onSendMessage={onSendMessage}
            onBlockUser={onBlockUser}
            onReportUser={onReportUser}
            isDeleteLoading={isDeleteLoading}
            isBlockLoading={isBlockLoading}
            isReportLoading={isReportLoading}
          />}
        </div>
        {/* 메타 정보와 더보기 메뉴 */}
        <div className="flex items-start justify-between">
          <div className="flex flex-row gap-x-3">
            {/* 학교 정보 */}
            { author.school?.name &&
              <div className="flex items-center gap-x-1">
                <SchoolIcon className='w-4 h-4 text-gray-70'/>
                <span className={`${isMobile?'text-semibold-12':'text-semibold-14'} text-gray-70 leading-[16px]`}>
                  {author.school.name}
                </span>
              </div>
            }

            {/* 작성자 닉네임 */}
            <span className={`${isMobile?'text-semibold-12':'text-semibold-14'} text-gray-50 leading-[16px]`}>
              {author.isAnonymous ? '익명의 끈' : (author.nickname || '익명')}
            </span>

            {/* 작성 시간 */}
            <span className={`${isMobile?'text-med-12':'text-med-14'} text-gray-50 leading-[16px]`}>
              {formatDate(createdAt)}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default observer(PostHeader);