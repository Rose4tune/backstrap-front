import React, { useEffect, useState } from 'react';
import getRecommends, { RecommendPost } from '@api/community/getRecommends';
import SchoolIcon from '@assets/icons/community/school.svg';
import FavoriteIcon from '@assets/icons/community/favorite.svg';
import CommentIcon from '@assets/icons/community/comment.svg';
import BlingIcon from '@assets/icons/community/bling.svg';
import { components } from 'src/types/api';
import { useRouter } from 'next/router';

interface PostItemProps {
    title:string,
    school:string,
    author:string,
    likeCount:number,
    reviewCount:number,
    onClick:() => void,
}
function PostItem({title, school, author, likeCount, reviewCount, onClick}:PostItemProps) {
    return(
        <div className='flex w-full justify-between items-center cursor-pointer' onClick={onClick}>
            <div className='truncate text-semibold-16 text-gray-90'>
                {title}
            </div>
            <div className='flex gap-5 flex-row items-center flex-shrink-0'>
                <div className='flex gap-1 flex-row items-center'>
                    <SchoolIcon className='w-4 h-4 text-gray-70'/>
                    <div className='text-gray-70 text-semibold-14'>
                        {school}
                    </div>
                    <div className='text-gray-50 text-semibold-14'>
                        {author}
                    </div>
                </div>
                <div className='flex flex-row gap-2 text-semibold-12 text-gray-70'>
                    <div className='flex flex-row gap-1'>
                        <FavoriteIcon className='w-4 h-4 text-red'/>
                        {likeCount}
                    </div>
                    <div className='flex flex-row gap-1'>
                        <CommentIcon className='w-4 h-4 text-gray-60'/>
                        {reviewCount}
                    </div>
                </div>
            </div>
        </div>
    )
}

interface SimilarProps {
    categoryUuid:string,
    boardUuid:string,
    title:string,
    count?:number
}

export default function Similar({categoryUuid, boardUuid, title, count=7}:SimilarProps) {
    const [posts, setPosts] = useState<PostItemProps[]>([]);
    const router = useRouter();
    useEffect(()=>{
        async function getPosts() {
            try{
                const response = await getRecommends(boardUuid);
                if(response.success && response.data) {
                    const transformedPosts = response.data.map((board: components['schemas']['BoardEntityView']) => {
                        return {
                            title: board.title || '',
                            school: board.user?.school?.name || '학교 없음',
                            author: board.user?.name || '익명',
                            likeCount: board.likeCount || 0,
                            reviewCount: board.reviewCount || 0,
                            onClick: () => {
                                router.push(`/community/post/${board.uuid}?source=${categoryUuid}`);
                            }
                        };
                    });
                    setPosts(transformedPosts);
                }
            } catch(error) {
                console.error('Failed to parse board content:', error);
            }
        }
        getPosts()
    },[categoryUuid, boardUuid])
    return (
        <div className='flex flex-col px-5 gap-y-4'>
            <div className='text-bold-20 text-gray-90 gap-x-3'>
                <BlingIcon className='w-8 h-8'/>
                {title}
            </div>
            {posts.map((post, i)=><PostItem key={i} title={post.title} school={post.school} author={post.author} likeCount={post.likeCount} reviewCount={post.reviewCount} onClick={post.onClick}/>)}
        </div>
    )
}