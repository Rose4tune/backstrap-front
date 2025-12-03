import React from 'react';
import clsx from 'clsx';
import DeleteIcon from '@assets/icons/community/delete.svg';
import { useMediaQuery } from '@mui/material';

interface PostDeleteProps {
    isOpen?: boolean;
    onClose?: () => void;
    onConfirm?: () => void;
    isLoading?: boolean;
    postTitle?: string;
}

export default function PostDelete({
    isOpen = true,
    onClose,
    onConfirm,
    isLoading = false,
    postTitle
}: PostDeleteProps) {
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
            className="fixed inset-0 z-50 flex items-center justify-center px-[45px] m:px-0"
            onClick={handleDimClick}
            style={{
                zIndex:2147483647
            }}
        >
            {/* Dim Background */}
            <div
                className={clsx(
                    "absolute inset-0 bg-black transition-opacity duration-300",
                    isOpen ? "opacity-50" : "opacity-0",
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
                <DeleteIcon/>
                <div className={`text-black text-center px-4 ${isMobile?'text-bold-16':'text-bold-24'}`}>
                    {postTitle ? `"${postTitle}"\n끈을 삭제하시겠습니까?` : '끈을 삭제하시겠습니까?'}
                </div>
                <div className="text-gray-90 text-med-14 text-center px-4">
                    한번 삭제한 끈은 되돌릴 수 없습니다
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
                                삭제 중...
                            </div>
                        ) : (
                            "삭제하기"
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}