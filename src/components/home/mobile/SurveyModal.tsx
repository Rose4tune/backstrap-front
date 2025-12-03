import { useEffect } from 'react';

interface SurveyModalProps {
    setNeedSurvey: (val: boolean) => void;
}

const SurveyModal = ({ setNeedSurvey }: SurveyModalProps) => {
    useEffect(() => {
        // body 스크롤 막기
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-center items-start">
            <div className="absolute w-full overflow-y-auto max-w-[450px] top-[120px] bg-white rounded-t-2xl mt-[10vh] shadow-xl flex flex-col overflow-hidden">
                {/* 상단 고정 영역 */}
                <div className="h-[123px] px-5 pt-6 pb-4 bg-white border-b border-gray-40 flex items-start justify-between">
                    <div>
                        <h2 className="text-text-normal text-bold-20 mb-1">
                            나에게 딱 맞는 정보를 추천해드릴게요!
                        </h2>
                        <p className="text-gray-60 text-reg-14">
                            대학원 입학부터 취업까지! 가방끈 더 똑똑하게 써보세요
                        </p>
                    </div>
                    <button onClick={() => setNeedSurvey(false)} className="mt-1">
                        <div className="w-6 h-6 text-gray-60" />
                    </button>
                </div>

                {/* 하단 스크롤 영역 */}
                <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">
                    {/* 현재 진행 중 과정 */}
                    <div>
                        <h3 className="text-bold-16 text-text-normal mb-2">현재 진행 중인 과정이나 마지막 이력</h3>
                        <div className="flex gap-2 flex-wrap">
                            {['학사', '석사', '박사', '포닥'].map((item) => (
                                <button
                                    key={item}
                                    className="px-4 py-2 rounded-full bg-gray-20 text-med-14 text-text-normal"
                                >
                                    {item}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 현재 상태 */}
                    <div>
                        <h3 className="text-bold-16 text-text-normal mb-2">현재 상태</h3>
                        <div className="space-y-2">
                            {[
                                '🤔 대학원 입학 고민 중',
                                '📖 대학원 입학 준비 중',
                                '✏️ 대학원 다니는 중',
                                '💼 대학원 졸업 후 취업 준비 중',
                                '🏃‍♀️ 대학원 졸업 후 회사 다니는 중',
                            ].map((item, idx) => (
                                <div
                                    key={idx}
                                    className="px-4 py-2 bg-gray-20 rounded-xl text-med-14 text-text-normal"
                                >
                                    {item}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 관심 분야 */}
                    <div>
                        <h3 className="text-bold-16 text-text-normal mb-2">관심분야 (중복 선택 가능)</h3>
                        <div className="grid grid-cols-3 gap-2">
                            {['대학원 진학', '취업', '연구실', '대학원 꿀팁', '논문 / 연구', '네트워킹'].map((item) => (
                                <button
                                    key={item}
                                    className="px-3 py-2 rounded-lg bg-gray-20 text-med-12 text-text-normal text-center"
                                >
                                    {item}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 경로 선택 */}
                    <div>
                        <h3 className="text-bold-16 text-text-normal mb-2">가방끈을 알게 된 경로</h3>
                        <select className="w-full px-4 py-2 rounded-md border border-gray-40 text-reg-14">
                            <option>가방끈을 알게 된 경로를 선택해주세요</option>
                            <option>SNS</option>
                            <option>지인 추천</option>
                            <option>기타</option>
                        </select>
                    </div>

                    {/* 제출 버튼 */}
                    <button className="w-full bg-normal text-white text-bold-16 py-3 rounded-xl">
                        가방끈 더 똑똑하게 쓰기!
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SurveyModal;
