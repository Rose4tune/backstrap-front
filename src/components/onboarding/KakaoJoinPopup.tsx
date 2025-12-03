import React from "react";
function KakaoJoinPopup() {
    return (
        <div className="flex justify-center">
            <div className="relative">
                {/* 버튼 본체 */}
                <div
                    className="w-fit bg-gray-20 text-gray-90 text-semibold-14 px-3 py-2 rounded-[8px] whitespace-nowrap"
                >
                    {"카카오톡으로 빠르게 가입하기"}
                </div>

                {/* 위쪽 삼각형 */}
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[7px] border-l-transparent border-b-[7px] border-b-gray-20 border-r-[7px] border-r-transparent" />
            </div>
        </div>
    );
}

export default KakaoJoinPopup