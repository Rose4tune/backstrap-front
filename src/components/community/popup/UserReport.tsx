import React from 'react';
import clsx from 'clsx';
import WarningIcon from '@assets/icons/community/warning.svg';
import { useMediaQuery } from '@mui/material';

interface UserReportProps {
    isOpen?: boolean;
    onClose?: () => void;
    onConfirm?: () => void;
    userName?: string;
    isLoading?: boolean;
}

export default function UserReport({
    isOpen = true,
    onClose,
    onConfirm,
    userName = "사용자",
    isLoading = false
}: UserReportProps) {
    const isMobile = useMediaQuery('(max-width:550px)');
    const handleDimClick = (e: React.MouseEvent) => {
        // Only close if clicking on the dim background itself and not loading
        if (e.target === e.currentTarget && onClose && !isLoading) {
            onClose();
        }
    };

    const handleCancel = () => {
        if (onClose && !isLoading) {
            onClose();
        }
    };

    const handleConfirm = () => {
        if (onConfirm) {
            onConfirm();
        }
        // Don't auto-close, let the parent component handle closing after API success
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div
            className="fixed w-full inset-0 z-50 flex items-center justify-center px-[45px] m:px-0"
            onClick={handleDimClick}
            style={{
                zIndex:2147483647
            }}
        >
            {/* Dim Background */}
            <div
                className={clsx(
                    "absolute inset-0 bg-black transition-opacity duration-300",
                    isOpen ? "opacity-50" : "opacity-0"
                )}
            />

            {/* Modal Content */}
            <div
                className={clsx(
                    "relative flex flex-col gap-y-1 justify-between items-center pt-9 bg-white rounded-[20px] shadow-2xl transition-all duration-300",
                    isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95",
                    `${isMobile?'w-full':'w-[375px]'}`
                )}
            >
                <WarningIcon/>
                <div className={`text-black text-center px-4 ${isMobile?'text-bold-16':'text-bold-24'}`}>
                    이 사용자를 신고할까요?
                </div>
                <div className="text-gray-90 text-med-14 text-center px-4">
                    해당 사용자의 활동이 모두 숨겨집니다
                </div>
                <div className="gap-x-2 w-full flex justify-center px-6 pb-5 pt-4">
                    <button
                        onClick={handleCancel}
                        disabled={isLoading}
                        className={clsx(
                            "text-gray-90 text-semibold-16 bg-gray-20 flex flex-1 rounded-[16px] transition-colors items-center justify-center",
                            isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-30",
                            `${isMobile?'py-3':'py-4'}`
                        )}
                    >
                        취소
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={isLoading}
                        className={clsx(
                            "text-white text-semibold-16 bg-red flex-1 rounded-[16px] transition-colors flex items-center justify-center",
                            isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-red-600",
                            `${isMobile?'py-3':'py-4'}`
                        )}
                    >
                        {isLoading ? (
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                신고 중...
                            </div>
                        ) : (
                            "신고하기"
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}