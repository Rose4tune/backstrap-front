import { components } from "src/types/api";

type TimeTableTemplate = components["schemas"]["TimeTableTemplate"]
const semesterLabelMap: Record<"FALL" | "SPRING" | "SUMMER" | "WINTER", string> = {
    SPRING: "1학기",
    SUMMER: "여름학기",
    FALL: "2학기",
    WINTER: "겨울학기",
};

export const formatSemesterLabel = (template: TimeTableTemplate) => {
    if (!template?.semester || !template?.year) return "";
    return `${template.year}년 ${semesterLabelMap[template.semester]}`;
};