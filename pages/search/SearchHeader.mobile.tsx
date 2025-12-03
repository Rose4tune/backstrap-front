import SearchBar from "src/components/header/SearchBar";
import DropdownArrowIcon from '@assets/icons/community/chevron-left.svg';
import { useRouter } from "next/router";

interface SearchHeaderMobileProps {
    showSearchPopup?:boolean;
    existValue?:string;
}

export default function SearchHeaderMobile({showSearchPopup, existValue}:SearchHeaderMobileProps) {
    const router = useRouter();
    return (
        <nav
            className={`
                flex fixed top-0 left-0 right-0 z-50 bg-white shadow-[0px_0px_30px_0px_rgba(0,0,0,0.1)] w-full p-5
                `}
                >
            <div className="flex flex-row items-center justify-between w-full">
                <DropdownArrowIcon onClick={()=>router.back()} className="w-5 h-5 rotate-180 text-gray-50"/>
                <div className="w-[252px]">
                    <SearchBar showPopup={showSearchPopup} existValue={existValue}/>
                </div>
                <button onClick={()=>router.back()} className="text-semibold-14 text-gray-60 flex-shrink-0">
                    취소
                </button>
            </div>
        </nav>
    )
}