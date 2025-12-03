import html2canvas from "html2canvas";

type DownloadOpts = {
    isMobile?: boolean; // true면 16:9, false면 9:16
};

export function downloadElementAsImage(
    element: HTMLElement,
    name: string,
    opts: DownloadOpts = {}
) {
    // 1) 래퍼 생성
    const wrapper = document.createElement("div");
    wrapper.style.padding = "14px";
    wrapper.style.backgroundColor = "white";
    wrapper.style.display = "block";
    wrapper.style.position = "fixed";
    wrapper.style.top = "-99999px";
    wrapper.style.left = "0";
    wrapper.style.boxSizing = "border-box"; // padding 포함 폭 계산

    // 2) element 복사해서 wrapper에 넣기
    const clone = element.cloneNode(true) as HTMLElement;
    clone.style.width = "100%";
    clone.style.height = "auto";
    wrapper.appendChild(clone);
    document.body.appendChild(wrapper);

    // 3) 크기 결정
    let targetWidth: number;
    let targetHeight: number;

    if (opts.isMobile) {
        // 9:16 세로형
        targetWidth = 450;
        targetHeight = Math.round((16 / 9) * targetWidth); 
    } else {
        // 16:9 가로형
        targetWidth = 1440;
        targetHeight = Math.round((9 / 16) * targetWidth); 
    }

    wrapper.style.width = `${targetWidth}px`;
    wrapper.style.height = `${targetHeight}px`;
    wrapper.style.overflow = "hidden"; // 넘치면 크롭

    // 4) 캡처 실행
    html2canvas(wrapper, {
        backgroundColor: "white",
        useCORS: true,
        scale: 2,
        width: targetWidth,
        height: targetHeight,
        windowWidth: targetWidth,
        windowHeight: targetHeight,
    })
        .then((canvas) => {
            const url = canvas.toDataURL("image/jpeg", 1.0);
            const link = document.createElement("a");
            link.href = url;
            link.download = `${name}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        })
        .finally(() => {
            // 5) wrapper 제거
            document.body.removeChild(wrapper);
        });
}
