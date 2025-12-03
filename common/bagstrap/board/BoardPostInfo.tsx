import clsx from "clsx";

import {BoardSummaryFragment} from "@generated/graphql";

export interface BoardPostInfoProps
    extends Pick<BoardSummaryFragment,
        "elapsedCreatedDate" | "likeCount" | "reviewCount"> {
    categoryName?: string;

    responsive?: boolean;
}

const BoardPostInfo = (props: BoardPostInfoProps): JSX.Element => {
    const {
        categoryName,
        elapsedCreatedDate,
        likeCount = 0,
        reviewCount = 0,
        responsive = true,
    } = props;

    return (
        <div
            className={clsx(
                "shrink-0",
                "typo-body5 leading-none",
                responsive && "md:typo-body5"
            )}
        >
            {categoryName && (
                <span className="text-point-blue font-bold">{categoryName}</span>
            )}
            {categoryName && elapsedCreatedDate && (
                <span className="text-grey4 font-medium"> | </span>
            )}
            {elapsedCreatedDate && (
                <span className="text-grey5 font-bold">{elapsedCreatedDate}</span>
            )}
            {elapsedCreatedDate && (
                <span className="text-grey4 font-medium"> | </span>
            )}
            <span className="text-grey4 font-medium">
        (♡) {likeCount} (···) {reviewCount}
      </span>
        </div>
    );
};

export default BoardPostInfo;
