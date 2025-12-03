import BaseButton from "@common/button/BaseButton";
import BaseTextInput from "@common/input/BaseTextInput";
import SearchIcon from "@assets/icons/header/search.svg";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { SearchPopup } from "../search";
import { useStore } from "@stores/useStore.hook";
import useRecentSearches from "src/hooks/useRecentSearches";
import { useMediaQuery } from "@mui/material";
import CloseIcon from '@assets/icons/community/close.svg';

interface SearchBarProps {
    showPopup?: boolean;
    existValue?: string;
    href?: string;
    placeholder?: string;
    preserveQuery?: boolean;
}

export default function SearchBar({
    showPopup = true,
    existValue,
    href = '/search',
    placeholder = "대학원 '합격수기' 궁금해요",
    preserveQuery = false

}:SearchBarProps) {
    const isMobile = useMediaQuery('(max-width:550px)');
    const router = useRouter();
    const searchParams = useSearchParams();
    const [searchKeyword, setSearchKeyword] = useState('');
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const { UserStore } = useStore();
    const accessToken = UserStore.accessToken;
    const searchBarRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const { addRecentSearch } = useRecentSearches();

    // 현재 쿼리 파라미터를 보존하는 함수
    const buildUrlWithQuery = (baseUrl: string) => {
        if (!preserveQuery) return baseUrl;
        
        const queryString = searchParams.toString();
        return queryString ? `${baseUrl}?${queryString}` : baseUrl;
    };
    function handleSearchEnter() {
        if (searchKeyword.trim()) {
            addRecentSearch(searchKeyword.trim());
            const url = buildUrlWithQuery(`${href}/${encodeURIComponent(searchKeyword.trim())}`);
            router.replace(url);
            setIsPopupOpen(false);
        }
    }
    function handleInputFocus() {
        setIsPopupOpen(true);
    }

    function handlePopupClose() {
        setIsPopupOpen(false);
    }

    function handlePopupSearch(keyword: string) {
        setSearchKeyword(keyword);
        addRecentSearch(keyword);
        const url = buildUrlWithQuery(`${href}/${encodeURIComponent(keyword)}`);
        router.replace(url);
        setIsPopupOpen(false);
    }

    function handleClearSearch() {
        setSearchKeyword('');
        // 입력창에 포커스
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }

    // Handle click outside to close popup
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (searchBarRef.current && !searchBarRef.current.contains(event.target as Node)) {
                setIsPopupOpen(false);
            }
        }
        if (isPopupOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }

    }, [isPopupOpen]);

    // Handle ESC key to close popup
    useEffect(() => {
        function handleEscapeKey(event: KeyboardEvent) {
            if (event.key === 'Escape') {
                setIsPopupOpen(false);
            }
        }
        if(existValue) setSearchKeyword(existValue);
        if (isPopupOpen) {
            document.addEventListener('keydown', handleEscapeKey);
            return () => document.removeEventListener('keydown', handleEscapeKey);
        }
    }, [isPopupOpen]);

    return (
        <div className="w-full" ref={searchBarRef}>
            <div className={`flex w-full ${isMobile?'h-[20px]':'4xl:h-16 h-13'} bg-gray-20 rounded-xl items-center justify-between px-5 py-5`}>
                <div
                    className="w-full relative"
                    onClick={handleInputFocus}
                >
                    <BaseTextInput
                        ref={inputRef}
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                        placeholder={placeholder}
                        className="bg-transparent border-none w-full"
                        inputProps={{
                            className: 'px-0 h-auto border-none bg-transparent text-[16px] placeholder:text-[#c9ced8] w-full',
                            onFocus: handleInputFocus,
                            onClick: handleInputFocus
                        } as any}
                        onEnterPress={handleSearchEnter}
                    />
                </div>
                { (searchKeyword===''&&!isMobile) &&
                        <BaseButton onClick={handleSearchEnter} aria-label="search">
                            <SearchIcon className="w-6 h-6" />
                        </BaseButton>
                }
                { !(searchKeyword==='') &&
                    <button onClick={handleClearSearch}>
                        <CloseIcon className="w-4 h-4 text-gray-50"/>
                    </button>
                }
            </div>

            {/* Search Popup */}
            {(showPopup&&isPopupOpen) && (
                <div className={`${!isMobile&&'top-full'} absolute left-0 right-0 mt-2 z-50`}>
                    <SearchPopup
                        onClose={handlePopupClose}
                        onSearch={handlePopupSearch}
                        accessToken={accessToken}
                    />
                </div>
            )}
        </div>
    )
}