import { Dispatch, SetStateAction } from "react"
import SearchIcon from "src/assets/icons/common/SearchIcon.svg"
import PlusIcon from "src/assets/icons/common/PlusIcon.svg"

interface FloatButtonProps {
    setIsClassListModalOpen: Dispatch<SetStateAction<boolean>>
    setIsManualModalOpen: Dispatch<SetStateAction<boolean>>
}

export default function FloatButton(props: FloatButtonProps) {
    const { setIsClassListModalOpen, setIsManualModalOpen } = props
    return (
        <div className="fixed bottom-[60px] left-1/2 -translate-x-1/2 flex items-center gap-5 z-[1000]">
            <button
                onClick={() => setIsClassListModalOpen(true)}
                className="w-[240px] flex justify-center items-center gap-2 py-3 bg-normal rounded-full shadow-md hover:bg-hover">
                <SearchIcon className="w-[20px] h-[20px] text-white" />
                <span className="text-white text-semibold-16">수업 목록에서 추가하기</span>
            </button>
            <button
                onClick={() => setIsManualModalOpen(true)}
                className="w-[160px] flex justify-center items-center gap-2 py-3 bg-normal rounded-full shadow-md hover:bg-hover">
                <PlusIcon className="w-[20px] h-[20px] text-white" />
                <span className="text-white text-semibold-16">직접 추가하기</span>
            </button>
        </div>
    )
}