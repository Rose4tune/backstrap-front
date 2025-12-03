import clsx from 'clsx';

import { AnnounceResponse } from '@generated/graphql';
import BaseLink from '@common/BaseLink';
import EmployCard from './EmployCard';

interface HomeEmployProps extends BaseProps {
  employAnnounces?: AnnounceResponse[];
}

export const HOME_MAX_VIEW = 8;

function HomeEmploy({ employAnnounces = [], className }: HomeEmployProps) {
  return (
    <section className={clsx('box-border p-1', className)}>
      {/* header */}
      <div className="flex items-center justify-between">
        <div className="text-[20px] font-bold text-[#00CBBC]">석박사 채용공고</div>
        <BaseLink
          className="text-[11px] font-bold text-[#727272]"
          href={'/board/announce'}
        >
          더보기 &gt;
        </BaseLink>
      </div>

      {/* cards */}
      <div
        className={clsx(
          'mt-[10px]',
          'h-auto',
          'flex flex-row flex-wrap justify-between gap-1.5'
        )}
      >
        {employAnnounces.map(announce => (
          <EmployCard key={announce.uuid} employ={announce} />
        ))}
      </div>
    </section>
  );
}

export default HomeEmploy;
