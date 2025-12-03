import PinIcon from '@assets/icons/community/pin.svg';
import NewIcon from '@assets/icons/community/new.svg';
import ChevronLeftIcon from '@assets/icons/community/chevron-left.svg';
import { components } from 'src/types/api';
import { useEffect, useState, useRef } from 'react';
import getBoardGroupAll from 'src/apis/community/getBoardGroupAll';
import Link from 'next/link';
import unBookmarkBoardGroup from 'src/apis/community/unBookmarkBoardGroup';
import { useCookies } from 'react-cookie';
import { COOKIE_NS, COOKIE_NS_APPLE_OAUTH, COOKIE_NS_KAKAO_OAUTH } from '@constants/common/cookie.constant';
import bookmarkBoardGroup from 'src/apis/community/bookmarkBoardGroup';
import clsx from 'clsx';

type Category = components['schemas']['FAGroupViewDto'];

type CategoryLinkProps = {
    category:Category,
    onPinClick:(isBookmarked: boolean, uuid: string) => Promise<void>
}

function CategoryLink({category, onPinClick}:CategoryLinkProps) {
    function getPinIcon() {
        if(category.isPinned) return <PinIcon className="w-[24px] h-[24px] text-red"/>
        else if(category.isBookmarkedByMe) return <PinIcon className="w-[24px] h-[24px] text-normal"/>
        else return <PinIcon className="w-[24px] h-[24px] text-gray-50"/>
    }
    return (
        <div className="truncate flex gap-x-2 flex-shrink-0 min-w-0 text-ellipsis h-10" style={{width:250, padding:'8px 20px 8px 16px'}}>
                <div className='flex z-10 cursor-pointer' onClick={()=>onPinClick(category.isBookmarkedByMe?category.isBookmarkedByMe:false, category.uuid??'')}>
                    {getPinIcon()}
                </div>
                <Link className="flex text-semibold-16 items-center gap-x-2" href={`/community/${category.uuid}?name=${category.name}`}>
                    {category.name}
                    {category.hasNewBoard&& <NewIcon/>}
                </Link>
            </div>
    )
}

interface CommunityNavigatorProps {
    isOpen: boolean;
    onToggle: () => void;
    categories?: Category[];
    onCategoriesChange?: (categories: Category[]) => void;
    className?: string;
}

export default function CommunityNavigator({
    isOpen,
    onToggle,
    categories = [],
    onCategoriesChange,
    className
}: CommunityNavigatorProps) {
    const [communityList, setCommunityList] = useState<Category[]>(categories);
    const [contentHeight, setContentHeight] = useState<number | null>(null);
    const [isAnimating, setIsAnimating] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [cookies] = useCookies();
    const accessToken =
        cookies[COOKIE_NS]?.authPayload?.access_token ||
        cookies[COOKIE_NS_APPLE_OAUTH]?.authPayload?.access_token ||
        cookies[COOKIE_NS_KAKAO_OAUTH]?.authPayload?.access_token;

    async function getList() {
        let pinned_list = [] as Category[];
        let bookmarked_list = [] as Category[];
        let basic_list = [] as Category[];
        const response = await getBoardGroupAll(accessToken);
        if(response.data) {
            response.data.forEach((category)=>{
                if(category.isPinned) pinned_list.push(category);
                else if(category.isBookmarkedByMe) bookmarked_list.push(category);
                else basic_list.push(category);
            })
        }
        const newList = [...pinned_list, ...bookmarked_list, ...basic_list];
        setCommunityList(newList);
        onCategoriesChange?.(newList);
    }
    async function onPinClick(isBookmarked:boolean, uuid:string) {
        if(isBookmarked) {
            const response = await unBookmarkBoardGroup(uuid, accessToken);
        }
        else {
            const response = await bookmarkBoardGroup(uuid, accessToken);
        }
        await getList();
    }

    // Update local state when categories prop changes
    useEffect(() => {
        setCommunityList(categories);
    }, []);
    // Calculate content height for smooth animation
    useEffect(() => {
        if (contentRef.current) {
            setContentHeight(contentRef.current.scrollHeight?contentRef.current.scrollHeight+40:0);
        }
    }, [communityList]);

    useEffect(()=>{
        if (categories.length === 0) {
            getList();
        }
    },[categories.length, accessToken])

    return (
        <div
            className={clsx(
                'flex w-full overflow-hidden transition-all duration-500 ease-in-out bg-gray-20 4xl:px-60 px-20 items-center',
                className
            )}
            style={{
                height: isOpen ? `${contentHeight}px` : '0px',
                maxHeight: isOpen ? `${contentHeight}px` : '0px',
                opacity: isOpen ? 1 : 0,
                transform: isOpen ? 'translateY(0)' : 'translateY(-10px)',
                transitionProperty: 'max-height, opacity, transform, height',
            }}
        >
            <div
                ref={contentRef}
                className="flex w-full flex-wrap"
            >
                {communityList.map((val, i) => (
                    <CategoryLink key={i} category={val} onPinClick={onPinClick} />
                ))}
            </div>
        </div>
    )
}