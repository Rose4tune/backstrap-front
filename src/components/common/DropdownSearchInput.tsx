import { useState, useEffect } from 'react';
import SearchIcon from "src/assets/icons/common/SearchIcon.svg"

interface DropdownSearchInputProps<T> {
    placeholder: string;
    title: string;
    value: string;
    onChange: (val: string) => void;
    onSelect: (item: T) => void;
    onSearch: (keyword: string) => Promise<{ success: boolean; data?: T[] }>;
    getOptionLabel: (item: T) => string;
}

export default function DropdownSearchInput<T>({
    placeholder,
    title,
    value,
    onChange,
    onSelect,
    onSearch,
    getOptionLabel
}: DropdownSearchInputProps<T>) {
    const [isOpen, setIsOpen] = useState(false);
    const [results, setResults] = useState<T[]>([]);
    const [isFocused, setIsFocused] = useState(false);

    useEffect(() => {
        if (!isFocused) return;
        if (value.trim().length === 0) {
            setIsOpen(false);
            return;
        }

        onSearch(value).then(res => {
            if (res.success && res.data) {
                setResults(res.data);
                setIsOpen(true);
            }
        });
    }, [value, isFocused, onSearch]);

    const handleSelect = (item: T) => {
        setIsOpen(false);
        onSelect(item);
    };

    return (
        <div className="w-full space-y-[8px]">
            <p className="text-med-14 text-gray-90">{title}</p>
            <div className="relative w-full">
                <div
                    className={`${isOpen ? 'bg-gray-30' : 'bg-gray-20'} relative flex items-center justify-between w-full px-[16px] h-[56px] rounded-[12px] border-[1px] border-gray-30`}
                >
                    <input
                        onChange={e => onChange(e.target.value)}
                        value={value}
                        placeholder={placeholder}
                        className={`bg-transparent w-full text-reg-14 ${value ? 'text-gray-90' : 'text-gray-50'}`}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                    />
                    <SearchIcon className='w-[20px] h-[20px] text-gray-50' />
                </div>
                {isOpen && (
                    <div className="absolute z-10 w-full max-w-[400px] max-h-[188px] py-[20px] overflow-y-auto border border-gray-30 rounded-[12px] bg-gray-20 no-scrollbar">
                        {results.map((item, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleSelect(item)}
                                className="w-full text-left text-leg-14 px-[24px] py-[6px] text-gray-90 hover:bg-hover rounded-[12px]"
                            >
                                {getOptionLabel(item)}
                            </button>
                        ))}
                        <div className="mx-[24px] bg-gray-40 h-[1px]" />
                        <button
                            onClick={() => onSelect({} as T)}
                            className="w-full text-left text-leg-14 px-[24px] py-[6px] text-gray-90 hover:bg-hover rounded-[12px]"
                        >{`'${value}' 직접 입력하기`}</button>
                    </div>
                )}
            </div>
        </div>
    );
}
