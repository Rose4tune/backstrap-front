interface LoaderProps {
    iconSize?: number;
    text?: string;
    textClassName?: string;
    heightFit?: boolean;
    widthFit?: boolean;
}

export default function Loader(props: LoaderProps) {
    const { iconSize, text, textClassName, heightFit, widthFit } = props
    return (
        <div className={`flex items-center justify-center ${widthFit ? 'w-fit' : 'w-full'} ${heightFit ? 'h-fit' : 'h-full'} gap-2`}>
            <img src="/assets/loading.gif" alt="로딩" className={iconSize ? `w-${iconSize} h-${iconSize}` : 'w-7 h-7'} />
            <div className={textClassName ? textClassName : "text-med-14 text-gray-60"}>{text ? text : '로딩 중..'}</div>
        </div>
    )
}