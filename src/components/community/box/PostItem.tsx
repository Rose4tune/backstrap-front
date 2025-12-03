import ImageIcon from '@assets/icons/community/image.svg';
import FavoriteIcon from '@assets/icons/community/favorite.svg';
import CommentIcon from '@assets/icons/community/comment.svg';

export interface PostItemProps {
  title: string;
  content: any;
  hasImage?: boolean;
  uuid: string;
  likeCount?: number;
  commentCount?: number;
  onClick?: () => void;
}

export default function PostItem({ title, content, hasImage, onClick, likeCount, commentCount }: PostItemProps) {
  return (
    <div
      className="flex w-full flex-col gap-1 cursor-pointer hover:bg-gray-20 rounded-sm transition-colors"
      onClick={onClick}
    >
        <div className="flex justify-between items-center gap-2 flex-row">
        {hasImage ? (
            <div className="flex items-start gap-1 min-w-0">
                <div className="w-4 h-4 flex items-center justify-center mt-0.5">
                <ImageIcon className="w-4 h-4 text-gray-50" />
                </div>
                <div className="text-bold-16 truncate text-gray-90 leading-[18px]">
                    {title}
                </div>
            </div>
            ) : (
            <div className="text-bold-16 truncate text-gray-90 leading-[18px]">
                {title}
            </div>
            )}
          <div className='flex flex-shrink-0 flex-row items-center gap-x-1'>
            {
                (likeCount!==undefined) && (
                    <div className='flex flex-row gap-x-1 items-center'>
                    <FavoriteIcon className='w-4 h-4 text-red'/>
                    <div className='text-semibold-12 text-gray-70'>
                        {likeCount}
                    </div>
                    </div>
                )
            }
            {
                (commentCount!==undefined) && (
                    <div className='flex flex-row gap-x-1 items-center'>
                    <CommentIcon className='w-4 h-4 text-gray-60'/>
                    <div className='text-semibold-12 text-gray-70'>
                        {commentCount}
                    </div>
                    </div>
                )
            }
          </div>
        </div>
      <div className='flex justify-between items-center'>
        <div className="truncate text-med-14 text-gray-60 leading-[20px] whitespace-nowrap overflow-hidden text-ellipsis">
          {content}
        </div>
      </div>
    </div>
  );
}