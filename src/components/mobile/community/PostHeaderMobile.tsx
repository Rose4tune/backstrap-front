import DropdownArrowIcon from '@assets/icons/community/chevron-left.svg';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ReactNode } from 'react';
import { PostMoreMenu } from 'src/components/community/post';
interface PostHeaderMobile {
    children:ReactNode;
    category:string;
    categoryUuid:string;
}
export default function PostHeaderMobile({children, category, categoryUuid}) {
    const router = useRouter();
    return (
    <nav
        className={`
          flex flex-col-reverse fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-30 w-full h-[70px] p-5
        `}
      >
        <div className="flex flex-row items-center justify-between">
            <DropdownArrowIcon onClick={()=>router.back()} className="w-5 h-5 rotate-180 text-gray-50"/>
          <Link href={'/community/'+categoryUuid+'?name='+category} className='flex text-semibold-16 text-gray-90 flex-shrink-0'>
            {category}
          </Link>
          <div className='flex fex-row gap-x-5'>
            {children}
          </div>
        </div>
      </nav>
    )
}