import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { components } from 'src/types/api';
import getTimeTableShare from '@api/time-table/getTimeTableShare';
import TimeTableShare from 'src/components/timetable/TimeTableShare';
import Loader from 'src/components/common/Loader';
import { useMediaQuery } from '@mui/material';
import Head from 'next/head';
import { NextSeo } from 'next-seo';

type TimeTableEntityView = components['schemas']['TimeTableEntityView'];

export default function SharePage() {
    const router = useRouter();
    const [timeTable, setTimeTable] = useState<TimeTableEntityView | null>(null);
    const [loading, setLoading] = useState(true); // 로딩 상태 추가
    const isMobile = useMediaQuery('(max-width:1439.8px)')


    useEffect(() => {
        if (!router.isReady) return;

        const pathParts = router.asPath.split('/');
        const uuid = pathParts[pathParts.length - 1];

        if (uuid) {
            (async () => {
                setLoading(true);
                const res = await getTimeTableShare(uuid);
                if (res.success && res.data) {
                    setTimeTable(res.data);
                } else {
                    console.error(res.messages);
                }
                setLoading(false);
            })();
        }
    }, [router.isReady, router.asPath]);

    if (loading) {
        return <div className='w-full h-full'><Loader /></div>; // 로딩 UI
    }

    if (!timeTable) {
        return <div className='w-full h-full flex justify-center items-center'>시간표 정보를 찾을 수 없습니다.</div>; // 데이터 없을 때
    }
    return (

        <>
            <NextSeo
                title={`가방끈 | 시간표`}
                description="대학원 시간표는 가방끈"
                canonical={`https://www.bagstrap.team/timetable/share/${timeTable.uuid}`}
                openGraph={{
                    type: 'website',
                    url: `https://www.bagstrap.team/timetable/share/${timeTable.uuid}`,
                    title: `${timeTable?.name}`,
                    description: '대학원 시간표는 가방끈',
                    images: [
                        {
                            url: 'https://www.bagstrap.team/logos/timeTablePreview.png',
                            alt: `${timeTable?.name}`,
                        },
                    ],
                    site_name: 'Bagstrap',
                }}
            />            <div className='max-w-[1440px] mx-auto px-[20px] py-[40px] space-y-5'>
                <div className='flex items-end gap-2'>
                    <h1 className='text-bold-20 text-gray-90'>{timeTable.name}</h1>
                    <p className='text-semibold-16 text-click'>{timeTable.yearAndSemesterName}</p>
                </div>
                <TimeTableShare isMobile={isMobile} selectedTimeTableEntity={timeTable} />
            </div>
        </>

    );
}
