import React, { useState } from "react";
import MobileMessageModal from "./MobileMessageModal";
import ArrowLeftIcon from "src/assets/icons/common/[renewal]LeftArrowIcon.svg";
import SchoolHatIcon from "src/assets/icons/common/SchoolHatIcon.svg";
import MoreIcon from "src/assets/icons/common/MoreIcon.svg";
import { useRouter } from "next/navigation";

interface Props {
  name: string;
  school: string;
  partnerUuid: string;
  isAnynomous?: boolean;
  isOut?: boolean;
  isReportedByMe?: boolean;
  roomUuid: string;
  setSelectedUuid: React.Dispatch<React.SetStateAction<string | null>>;
  onReloadRooms?: () => void;   
}

const AlarmMessageHeader: React.FC<Props> = ({
  name,
  school,
  isAnynomous,
  isOut,
  isReportedByMe,
  partnerUuid,
  roomUuid,
  setSelectedUuid,
  onReloadRooms,       
}) => {
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  const handleBack = () => {
    // 리스트 화면으로 돌아가기
    setSelectedUuid(null);
    onReloadRooms?.();
  };

  return (
    <>
      <div className="fixed top-0 left-0 w-full bg-white flex items-center justify-between px-5 pt-[53px] pb-[20px] border-b border-gray-30">
        <button
          onClick={handleBack}
          className="w-[26px] h-[26px] flex items-center justify-center"
        >
          <ArrowLeftIcon width={20} height={20} className="text-gray-50" />
        </button>

        <div className="flex gap-2 items-center">
          <span className="text-semibold-16 text-gray-90">
            {isOut
              ? "(알 수 없음)"
              : isAnynomous
              ? "익명의 끈"
              : name}
          </span>
          {!isAnynomous && !isOut && (
            <span className="flex gap-1 items-center">
              <SchoolHatIcon width={16} height={16} className="text-gray-70" />
              <span className="text-semibold-14 text-gray-70">{school}</span>
            </span>
          )}
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="w-[26px] h-[26px] flex items-center justify-center"
        >
          <MoreIcon width={24} height={24} className="text-gray-60" />
        </button>
      </div>

      {showModal && (
        <MobileMessageModal
          roomUuid={roomUuid}
          partnerUuid={partnerUuid}
          isOut={isOut}
          isReportedByMe={isReportedByMe}
          onClose={() => setShowModal(false)}
        />
      )}
      <div className="h-[40px] bg-gray-20" />
    </>
  );
};

export default AlarmMessageHeader;
