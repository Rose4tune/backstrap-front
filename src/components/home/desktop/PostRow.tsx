import { components } from "src/types/api";
import ImageIcon from "src/assets/icons/home/ImageIcon.svg";
import LoveIcon from "src/assets/icons/home/LoveIcon.svg";
import SmallCommentIcon from "src/assets/icons/home/SmallCommentIcon.svg";
import hasImage from "src/utils/home/hasImage";

type BoardEntityViewDto = components['schemas']['BoardEntityView'];

export default function PostRow({ item }: { item: BoardEntityViewDto }) {
    return (
        <div className="space-y-1 flex flex-1 flex-col min-w-0">
            <div className="flex flex-1 justify-between items-center min-w-0">
                {/* 제목 영역 */}
                <div className="flex flex-1 whitespace-nowrap truncate items-center justify-between gap-1">
                    {hasImage(item.content || '') && <ImageIcon className="text-gray-60 w-[20px] h-[20px]" />}
                    <p className="flex flex-1 whitespace-nowrap truncate text-bold-16 text-gray-90 min-w-0">
                        {item.title}
                    </p>
                    {/* 좋아요 / 댓글 */}
                    <div className="flex items-center gap-[8px] pl-2">
                        <div className="flex items-center text-semibold-12 text-gray-70 space-x-1">
                            <LoveIcon className="w-[16px] h-[16px] mb-[2px]" />
                            <span>{item.likeCount}</span>
                        </div>
                        <div className="flex items-center text-semibold-12 text-gray-70 space-x-1">
                            <SmallCommentIcon className="w-[16px] h-[16px] mb-[4px]" />
                            <span>{item.reviewCount}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 요약 */}
            <p className="flex flex-1 text-med-14 text-gray-60 truncate whitespace-nowrap">
                {item.summary}
            </p>

        </div>
    );
}
