export type TextButtonType = "IF 높은 끈" | "최신순" | "댓글순" | "핫한 투표"
export const ButtonEnumMap = {
    "IF 높은 끈": "MONTHLY_IF_POPULAR",
    "최신순": "RECENT",
    "댓글순": "MONTHLY_COMMENT_POPULAR",
    "핫한 투표": "MONTHLY_VOTE_POPULAR"
} as const