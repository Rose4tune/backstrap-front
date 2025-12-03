import clsx from "clsx";

import BoardSummary, {BoardSummaryProps} from "./BoardSummary";

export interface BoardOverviewSectionProps extends BaseProps {
    freeBoard?: BoardSummaryProps | null;
    secretBoard?: BoardSummaryProps | null;
}

const BoardOverviewSection = (
    props: BoardOverviewSectionProps
): JSX.Element => {
    const {className, freeBoard, secretBoard} = props;

    return (
        <section
            className={clsx(
                "h-fit",
                "grid grid-cols-1 gap-3",
                "md:gap-4",
                "lg:grid-cols-2 lg:gap-x-7 lg:gap-y-5",
                className,
            )}
        >
            {freeBoard && (
                <BoardSummary group={freeBoard.group!} boards={freeBoard.boards}/>
            )}
            {secretBoard && (
                <BoardSummary group={secretBoard.group!} boards={secretBoard.boards}/>
            )}
        </section>
    );
};

export default BoardOverviewSection;
