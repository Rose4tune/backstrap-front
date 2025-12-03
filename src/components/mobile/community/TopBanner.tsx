import React, { useEffect, useState } from 'react';
import getTopFixBanner from 'src/apis/community/getTopFixBanner';
import { components } from 'src/types/api';
import SpeakerIcon from '@assets/icons/community/speaker.svg';
import Link from 'next/link';

type TopFixBanner = components['schemas']['BoardEntityView'];

interface TopBannerProps {
  accessToken?: string;
  className?: string;
}

export default function TopBanner({ accessToken, className }: TopBannerProps) {
  const [banner, setBanner] = useState<TopFixBanner | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch banner data
  useEffect(() => {
    const fetchBanner = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await getTopFixBanner(accessToken);

        if (response.success && response.data) {
          setBanner(response.data);
          // console.log(JSON.stringify(response.data))
        } else {
          setError(response.messages || '배너 정보를 가져올 수 없습니다.');
        }
      } catch (err) {
        console.error('Error fetching banner:', err);
        setError('배너 정보를 가져오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchBanner();
  }, [accessToken]);

  // Don't render if loading, error, or no banner
  if (loading || error || !banner) {
    return null;
  }

  return (
    <div
      className={`flex flex-row gap-[7px] items-center justify-start pt-3 px-5 ${className || ''}`}
    >
      {/* Megaphone Icon */}
      <div className="relative shrink-0 w-6 h-6">
        {/* <img
          alt="공지"
          className="block max-w-none w-full h-full"
          src={megaphoneIcon}
        /> */}
        <SpeakerIcon/>
      </div>

      {/* Banner Text */}
      <Link href={`/community/post/${banner.uuid}`} className="bg-red-10 flex flex-row gap-2.5 items-center justify-start px-3 py-2 rounded-lg shrink-0">
        <div className="font-semibold text-gray-90 text-semibold-12 leading-[18px] whitespace-nowrap">
          {banner.title}
        </div>
      </Link>
    </div>
  );
}