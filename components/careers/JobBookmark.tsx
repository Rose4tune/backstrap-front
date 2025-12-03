import { useState } from 'react';
import useAuthGuard from '@hooks/useAuthGuard.hook';
import { JobBookmarkContainer } from './JobBookmark.style';
import Image from 'next/image';

interface JobBookmarkProps {
  selected: boolean;
  defaultColor: 'grey' | 'white';
  onClickEvent: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const JobBookmark = ({ selected, defaultColor, onClickEvent }: JobBookmarkProps) => {
  const [authGuardModalDialogEl, passed] = useAuthGuard(true);

  const [showModal, setShowModal] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!passed) {
      setShowModal(true);
      return;
    }
    onClickEvent(e);
  };

  return (
    <JobBookmarkContainer
      selected={selected}
      defaultColor={defaultColor}
      onClick={handleClick}
    >
      <Image
        src={
          selected
            ? '/icons/[careers]bookmark-selected-primary.svg'
            : defaultColor === 'grey'
              ? '/icons/[careers]bookmark-empty-gr.svg'
              : '/icons/[careers]bookmark-empty-wh.svg'
        }
        fill
        style={{ objectFit: 'contain' }}
        alt={'job_bookmark'}
      />
      {showModal && authGuardModalDialogEl}
    </JobBookmarkContainer>
  );
};
export default JobBookmark;
