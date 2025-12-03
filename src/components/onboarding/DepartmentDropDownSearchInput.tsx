import { useState, useRef, useEffect } from 'react';
import TextBoxDeleteIcon from 'public/icons/[renewal]TextBoxDeleteIcon.svg';
import { useDebouncedValue } from '@hooks/UseDebouncedValue';
import {
  getSchoolDepartmentListBySearchKeyword,
  SchoolDepartment
} from '@apis/onboarding/getSchoolDepartmentListBySearchKeyword';

interface DropDownSearchInputProps {
  placeholder: string;
  title: string;
  onChangeDepartement: (departmentName: string) => void;
  value: string;
}

export default function DepartmentDropDownSearchInput({
  placeholder,
  title,
  onChangeDepartement,
  value
}: DropDownSearchInputProps) {
  const [isOpen, setIsOpen] = useState(false); //options 열림 상태 관리
  const [results, setResults] = useState<SchoolDepartment[]>([]);
  const [skipSearch, setSkipSearch] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState<boolean>(false);

  // 검색 useEffect
  useEffect(() => {
    if (!isFocused) {
      //선택되었을 때만 검색허용
      return;
    }
    //빈칸처리
    if (value.length === 0) {
      setIsOpen(false);
    }
    if (!value) {
      setResults([]);
      return;
    }
    getSchoolDepartmentListBySearchKeyword(value).then(res => {
      if (res.success && res.data) {
        setResults(res.data);
        setIsOpen(true);
      }
    });
  }, [value, isFocused, setIsOpen, setResults]);

  const handleSelect = (name: string) => {
    setIsOpen(false);
    onChangeDepartement(name);
  };

  return (
    <div className="w-full space-y-[8px]">
      <p className="text-med-14 text-gray-90">{title}</p>
      <div className="relative w-full">
        <div
          className={`${isOpen ? 'bg-gray-30' : 'bg-gray-20'} relative flex justify-between w-full px-[16px] h-[56px]  rounded-[12px] border-[1px] border-gray-30`}
        >
          <input
            onChange={e => onChangeDepartement(e.target.value)}
            value={value}
            placeholder={placeholder}
            className={`bg-transparent flex justify-between text-left w-full  `}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />

          {value.length !== 0 && (
            <button onClick={() => onChangeDepartement('')}>
              <TextBoxDeleteIcon />
            </button>
          )}
        </div>
        {isOpen && (
          <div className="absolute z-10 w-full max-w-[400px] max-h-[188px] py-[20px] overflow-y-auto border border-gray-30 rounded-[12px] bg-gray-20 no-scrollbar">
            {results.map(department => (
              <button
                key={department.name}
                onClick={() => handleSelect(department.name)}
                className="w-full py-[6px] text-left text-leg-14 px-[24px] text-gray-90 hover:bg-gray-40 rounded-[12px]"
              >
                {department.name}
              </button>
            ))}
            <div className="mx-[24px] bg-gray-40 h-[1px]" />
            <button
              onClick={() => handleSelect(value)}
              className="w-full py-[6px] text-left text-leg-14 px-[24px] text-gray-90 hover:bg-gray-40 rounded-[12px]"
            >{`'${value}' 직접 입력하기`}</button>
          </div>
        )}
      </div>
    </div>
  );
}
