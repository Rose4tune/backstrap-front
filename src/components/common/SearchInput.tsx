import SearchIcon from "src/assets/icons/common/SearchIcon.svg";

interface SearchInputProps {
    placeholder: string;
    value?: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    thin?: boolean;
}

export default function SearchInput({
    placeholder,
    value,
    onChange,
    thin
}: SearchInputProps) {
    return (
        <div className="relative flex items-center w-full">
            <input
                type='text'
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`placeholder:text-gray-50 w-full ${thin ? 'h-[34px] pl-3 pr-8' : 'h-[56px] pl-4 pr-10'} rounded-lg focus:outline-none bg-gray-20 ${thin ? 'text-reg-12' : 'text-reg-14'}`}
            />
            <SearchIcon className={`absolute ${thin? 'w-4 h-4 right-3':'w-5 h-5 right-4'} text-gray-50`} />
        </div>
    );
}