import { observer } from "mobx-react";
import { Dispatch, SetStateAction } from "react";

interface MobileAddProps {
    setIsMobileAddModalOpen: Dispatch<SetStateAction<boolean>>;
    setIsClassListModalOpen: Dispatch<SetStateAction<boolean>>;
    setIsManualModalOpen: Dispatch<SetStateAction<boolean>>;
}

function MobileAddModal({
    setIsMobileAddModalOpen,
    setIsClassListModalOpen,
    setIsManualModalOpen,
}: MobileAddProps) {
    return (
        <>
            {/* 배경 딤 */}
            <div className="fixed inset-0 bg-dim max-w-[550px] mx-auto z-[10001]" onClick={() => setIsMobileAddModalOpen(false)}
            />

            {/* 바텀시트 */}
            <div
                className="fixed bottom-0 left-1/2 -translate-x-1/2 bg-white px-[20px] pt-[24px] pb-[60px] rounded-t-[24px] w-full max-w-[550px] mx-auto z-[10002]"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-bold-18 text-gray-90">시간표 추가</h2>

                <div className="flex flex-col mt-[20px]">
                    <button
                        onClick={() => {
                            setIsClassListModalOpen(true);
                            setIsMobileAddModalOpen(false);
                        }}
                        className="text-med-16 text-left hover:bg-bagstrap-10 py-[10px] pl-2 rounded-[12px]"
                    >
                        수업 등록하기
                    </button>

                    <button
                        onClick={() => {
                            setIsManualModalOpen(true);
                            setIsMobileAddModalOpen(false);
                        }}
                        className="text-med-16 text-left hover:bg-bagstrap-10 py-[10px] pl-2 rounded-[12px]"
                    >
                        수업 직접 추가하기
                    </button>
                </div>
            </div>
        </>

    );
}

export default observer(MobileAddModal)