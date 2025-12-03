import Image from 'next/image';
import { useRouter } from 'next/router';
interface ViewInterface {
  view: string;
}

('onboarding');
export default function Header({ view }: ViewInterface) {
  const router = useRouter();
  if (view === 'onboarding') {
    return (
      <header className="w-full max-w-[1440px] mx-auto">
        <div className="flex border-gray-10 border-b-[2px]">
          <button
            onClick={() => router.push('/')}
            className="flex items-center justify-between h-[86px] pt-[24px] pb-[21px] px-[32px]"
          >
            <Image
              src={'/logos/[renewal]onboardingLogo.png'}
              alt="bagstrap logo"
              width={152}
              height={41}
            />
          </button>
        </div>
      </header>
    );
  }
  return <></>;
}
