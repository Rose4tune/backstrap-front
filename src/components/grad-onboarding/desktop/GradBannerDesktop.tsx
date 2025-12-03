import { observer } from "mobx-react-lite"
import Image from "next/image"
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import LeftArrowIcon from "src/assets/icons/common/[renewal]LeftArrowIcon.svg"
import RightArrowIcon from "src/assets/icons/common/[renewal]RightArrowIcon.svg"
import { components } from "src/types/api";

type ArticleViewDto = components["schemas"]["ArticleViewDto"]

function GradbannerDesktop({ bannerArticleList }: { bannerArticleList: ArticleViewDto[] | null }) {
    const [current, setCurrent] = useState(0);
    const router = useRouter();

    // 5초마다 자동 슬라이드
    useEffect(() => {
        if (!bannerArticleList || bannerArticleList.length === 0) return;
        const timer = setInterval(() => {
            setCurrent((prev) =>
                prev === bannerArticleList.length - 1 ? 0 : prev + 1
            );
        }, 5000);
        return () => clearInterval(timer);
    }, [bannerArticleList]);

    const nextSlide = () => {
        if (!bannerArticleList) return;
        setCurrent((prev) =>
            prev === bannerArticleList.length - 1 ? 0 : prev + 1
        );
    };

    const prevSlide = () => {
        if (!bannerArticleList) return;
        setCurrent((prev) =>
            prev === 0 ? bannerArticleList.length - 1 : prev - 1
        );
    };

    return (
        <>
            {bannerArticleList?.map((a, idx) => (
                <div
                    key={a.uuid ?? idx}
                    className={`absolute w-full max-w-[1920px] 4xl:h-[520px] 2xl:h-[380px] xl:h-[300px] lg:h-[280px] bg-gray-90 transition-opacity duration-500 ease-in-out cursor-pointer
                        ${idx === current ? "opacity-100 z-10" : "opacity-0 z-0"}`}
                    onClick={() => router.push(`/grad-onboarding/detail/${a.uuid}`)}
                >
                    <Image
                    src={a.imageUrlXL as string}
                    alt="banner"
                    fill
                    className="object-cover object-right"
                    priority={idx === current}
                />
                    <div className="absolute z-20 top-[60px] 2xl:top-[100px] left-[240px] flex flex-col">
                        <div className="text-bold-32 text-white mb-[16px]">{a.title}</div>
                        <div className="text-semibold-22 text-white">{a.smallTitle}</div>
                    </div>

                    <div className="absolute z-20 bottom-[60px] 2xl:bottom-[100px] left-[240px] flex gap-2 items-center">
                        {/* 왼쪽 화살표 버튼 */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                prevSlide();
                            }}
                            className="z-30"
                        >
                            <LeftArrowIcon width={24} height={24} className="text-white" />
                        </button>
                        <span className="text-white text-semibold-22">
                            {(current + 1).toString().padStart(2, "0")} /{" "}
                            {bannerArticleList.length.toString().padStart(2, "0")}
                        </span>
                        {/* 오른쪽 화살표 버튼 */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                nextSlide();
                            }} className="z-30"
                        >
                            <RightArrowIcon width={24} height={24} className="text-white" />
                        </button>
                    </div>
                </div>
            ))}
            <div className="4xl:h-[520px] 2xl:h-[380px] xl:h-[300px] lg:h-[280px]"></div>
        </>
    )
}

export default observer(GradbannerDesktop)