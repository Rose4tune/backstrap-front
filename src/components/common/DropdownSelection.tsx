import { useState, useRef, useEffect } from 'react';
import ArrowUpIcon from "src/assets/icons/common/ArrowUpIcon.svg"
import ArrowDownIcon from "src/assets/icons/common/ArrowDownIcon.svg"

interface DropdownSelectionProps {
    options?: any[];
    placeholder?: string;
    title: string;
    onChange: (val: string) => void;
    value?: string;
    optionTextStyle: string;
    iconSize: number;
    needGap?: boolean;
}

export default function DropdownSelection({
    options,
    placeholder,
    title,
    onChange,
    value,
    optionTextStyle,
    iconSize,
    needGap
}: DropdownSelectionProps) {
    const [isOpen, setIsOpen] = useState(false); //options 열림 상태 관리
    const dropdownRef = useRef<HTMLDivElement>(null);

    /**선택했을 때 함수 */
    const handleSelect = (value: string) => {
        setIsOpen(false);
        onChange(value);
    };

    // 바깥 클릭 시 닫기
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className={`w-full flex flex-col ${needGap ? 'gap-2' : ''}`}>
            <p className="text-med-14 text-gray-90">{title}</p>
            <div className="relative inline-block w-full" ref={dropdownRef}>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`${isOpen ? 'bg-gray-30' : 'bg-gray-20'} flex w-full items-center justify-between gap-[4px] text-left border border-gray-30 px-[12px] py-[8px] rounded-[8px]`}
                    disabled={!options || options?.length === 0}
                >
                    {value ? (
                        <p className={`${optionTextStyle} text-gray-90`}>{value}</p>
                    ) : (
                        <p className={`${optionTextStyle} text-gray-50`}>{placeholder}</p>
                    )}
                    {isOpen ? <ArrowUpIcon width={iconSize} height={iconSize} className='text-gray-50' /> : <ArrowDownIcon width={iconSize} height={iconSize} className='text-gray-50' />}
                </button>

                {isOpen && (
                    <div className="absolute z-10 w-full max-h-[188px] py-[12px] overflow-y-auto border border-gray-30 rounded-[12px] bg-gray-20 no-scrollbar">
                        {options?.map(option => (
                            <button
                                key={option}
                                onClick={() => handleSelect(option)}
                                className="w-full text-left text-semibold-14 px-[16px] py-[6px] text-gray-90 hover:bg-gray-40 rounded-[12px]"
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
