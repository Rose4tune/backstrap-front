import { useState, useRef, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import ArrowUpIcon from "src/assets/icons/common/ArrowUpIcon.svg";
import ArrowDownIcon from "src/assets/icons/common/ArrowDownIcon.svg";

// 옵션 타입
type DropdownOptionObject = { label: string; value: string };
type DropdownOption = string | DropdownOptionObject;

interface DropDownInputProps {
  options?: DropdownOption[];
  placeholder: string;
  title?: string;
  onChange: (value: string) => void;
  value: string;
  textClassName?: string; // 호환성 위해 둠
  needGap?: boolean;
  disabled?: boolean;
  thin?: boolean;
}

export default function DropdownInput({
  options,
  placeholder,
  title,
  onChange,
  thin,
  value,
  textClassName,
  needGap,
  disabled,
}: DropDownInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // 옵션 정규화
  const normalizedOptions = useMemo<DropdownOptionObject[]>(() => {
    if (!options || options.length === 0) return [];
    if (typeof options[0] === "string") {
      return (options as string[]).map((o) => ({ label: o, value: o }));
    }
    return options as DropdownOptionObject[];
  }, [options]);

  // 선택 라벨
  const selectedLabel = useMemo(() => {
    if (!value) return null;
    return normalizedOptions.find((o) => o.value === value)?.label ?? null;
  }, [value, normalizedOptions]);

  // 포지션 상태
  const [pos, setPos] = useState<{ left: number; top: number; width: number }>({
    left: 0,
    top: 0,
    width: 0,
  });

  // 좌표 재계산
  const updatePosition = () => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const width = rect.width;
    const left = Math.max(8, Math.min(rect.left, window.innerWidth - width - 8));

    // 일단 아래쪽에 붙였다가, 실제 높이를 측정해 위/아래 중 결정
    let top = rect.bottom + 4;

    // 일단 설정
    setPos({ left, top, width });

    // 다음 프레임에 메뉴 높이 측정해서 보정
    requestAnimationFrame(() => {
      const menuEl = menuRef.current;
      if (!menuEl) return;
      const menuH = menuEl.offsetHeight || 0;
      const fitsBelow = rect.bottom + 4 + menuH <= window.innerHeight - 8;
      const fitsAbove = rect.top - 4 - menuH >= 8;

      if (!fitsBelow && fitsAbove) {
        setPos({ left, top: rect.top - 4 - menuH, width });
      } else {
        setPos({ left, top: rect.bottom + 4, width });
      }
    });
  };

  // 열릴 때 포지션 계산 + 리스너 등록
  useEffect(() => {
    if (!isOpen) return;
    updatePosition();

    const onScroll = () => updatePosition();
    const onResize = () => updatePosition();

    window.addEventListener("scroll", onScroll, true); // 캡처로 내부 스크롤도 대응
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // 바깥 클릭 닫기 (포탈 포함)
  useEffect(() => {
    if (!isOpen) return;
    const handleDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (buttonRef.current?.contains(target)) return;
      if (menuRef.current?.contains(target)) return;
      setIsOpen(false);
    };
    document.addEventListener("mousedown", handleDown);
    return () => document.removeEventListener("mousedown", handleDown);
  }, [isOpen]);

  const handleSelect = (selectedValue: string) => {
    setIsOpen(false);
    onChange(selectedValue);
  };

  return (
    <div className="w-full">
      {title && (
        <p className={`text-med-14 text-gray-90 ${needGap ? "mb-2" : ""}`}>
          {title}
        </p>
      )}

      <div className="relative inline-block w-full">
        <button
          ref={buttonRef}
          onClick={() => setIsOpen((v) => !v)}
          className={`${isOpen ? "bg-gray-30" : "bg-gray-20"} ${thin ? "h-[34px] px-3 rounded-[8px]" : "h-[56px] p-4 rounded-[12px]"
            } flex justify-between items-center text-left w-full border-[1px] border-gray-30`}
          disabled={disabled || normalizedOptions.length === 0}
        >
          {selectedLabel ? (
            <p
              className={`${thin ? "text-reg-12" : "text-reg-14"} text-gray-90 truncate ${textClassName ?? ""
                }`}
            >
              {selectedLabel}
            </p>
          ) : (
            <p
              className={`${thin ? "text-reg-12" : "text-reg-14"} truncate text-gray-50 ${textClassName ?? ""
                }`}
            >
              {placeholder}
            </p>
          )}

          {isOpen ? (
            <ArrowUpIcon
              className={`${thin ? "w-4 h-4" : "w-5 h-5"} text-gray-50`}
            />
          ) : (
            <ArrowDownIcon
              className={`${thin ? "w-4 h-4" : "w-5 h-5"} text-gray-50`}
            />
          )}
        </button>
      </div>

      {/* 포탈 메뉴 */}
      {isOpen &&
        createPortal(
          <div
            ref={menuRef}
            style={{
              position: "fixed",
              left: pos.left,
              top: pos.top,
              width: pos.width,
            }}
            className="z-[10050] max-h-[188px] py-[20px] overflow-y-auto border border-gray-30 rounded-[12px] bg-gray-20 no-scrollbar shadow-xl"
          >
            {normalizedOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={`w-full text-left ${thin ? "text-reg-12 px-2 rounded-[8px]" : "text-reg-14 px-6 rounded-[12px]"
                  } py-[6px] text-gray-90 hover:bg-gray-40`}
              >
                {option.label}
              </button>
            ))}
          </div>,
          document.body
        )}
    </div>
  );
}
