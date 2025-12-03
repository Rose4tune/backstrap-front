import Link from "next/link";

const MYPAGE_TAB = [
    {
        label:'내 프로필',
        href:'/mypage/profile',
        // className:'text-gray-90'
    },
    {
        label:'커뮤니티 활동',
        href:'/mypage/community/*',
        // className:'text-gray-90'
    },
    {
        label:'멘토링 신청 내역',
        href:'/mypage/mentoring',
        // className:'text-gray-90'
    },
    {
        label:'설정',
        href:'/mypage/setting',
        // className:'text-gray-90'
    },
    {
        label:'로그아웃',
        href:'/mypage/logout',
        className:'text-gray-50 hover:text-red transition-colors'
    },
];

interface MyPageNavigatorProps {
    href:string
}
export default function MyPageNavigator({
    href
}:MyPageNavigatorProps) {
    // /mypage/ 뒤의 첫 번째 경로 세그먼트를 추출하는 함수
    const getFirstSegmentAfterMypage = (path: string): string => {
        const match = path.match(/^\/mypage\/([^\/]+)/);
        return match ? match[1] : '';
    };

    const currentSegment = getFirstSegmentAfterMypage(href);

    return (
        <div className="w-full bg-white flex flex-col gap-y-10 p-10 rounded-[16px] text-semibold-22 leading-7 text-gray-90">
            {MYPAGE_TAB.map((tab,i)=>{
                const tabSegment = getFirstSegmentAfterMypage(tab.href);
                const isActive = currentSegment === tabSegment;
                return (
                    <Link key={i} href={tab.href} className={tab.className+(isActive?' text-click':'')}>
                        {tab.label}
                    </Link>
                );
            })}
        </div>
    )
}