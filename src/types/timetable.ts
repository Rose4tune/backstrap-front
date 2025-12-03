// 최종 목표 객체의 타입 구조
export interface Major {
    uuid: string;
    name: string;
}

export interface College {
    uuid: string;
    name: string;
    major: Major[]; // 전공 목록을 배열로 가집니다.
}

export interface Campus {
    uuid: string;
    name: string;
    college: College[]; // 단과대학 목록을 배열로 가집니다.
}

export interface SchoolCourseType {
    uuid: string;
    name: string;
    campus: Campus[]; // 캠퍼스 목록을 배열로 가집니다.
}

// getListByCategory API가 반환하는 개별 아이템의 타입이라고 가정합니다.
export interface CategoryItem {
    uuid: string;
    name: string;
    // API 응답에 다른 속성이 있다면 여기에 추가할 수 있습니다.
}

export type GradeTotalType = 'FOUR' | 'FOURFIVE' | 'FOURTHREE'


////////////////GradeType/////////////////

// 1) 내부 코드 타입 (API용)
export type GradeCode =
    | "A" | "AM" | "AP"
    | "B" | "BM" | "BP"
    | "C" | "CM" | "CP"
    | "D" | "DM" | "DP"
    | "F" | undefined;

// 2) 화면 표시용 라벨 타입 (Dropdown 옵션)
export type GradeLabel =
    | "A+" | "A0" | "A-"
    | "B+" | "B0" | "B-"
    | "C+" | "C0" | "C-"
    | "D+" | "D0" | "D-"
    | "F";

// 3) 코드 ↔ 라벨 매핑
export const gradeCodeToLabel: Record<Exclude<GradeCode, undefined>, GradeLabel> = {
    AP: "A+",
    A: "A0",
    AM: "A-",
    BP: "B+",
    B: "B0",
    BM: "B-",
    CP: "C+",
    C: "C0",
    CM: "C-",
    DP: "D+",
    D: "D0",
    DM: "D-",
    F: "F",
};

export const gradeLabelToCode: Record<GradeLabel, Exclude<GradeCode, undefined>> = {
    "A+": "AP",
    "A0": "A",
    "A-": "AM",
    "B+": "BP",
    "B0": "B",
    "B-": "BM",
    "C+": "CP",
    "C0": "C",
    "C-": "CM",
    "D+": "DP",
    "D0": "D",
    "D-": "DM",
    "F": "F",
};

// 4) 드롭다운 옵션(문자열 배열)
export const gradeLabelOptions: GradeLabel[] = [
    "A+", "A0", "A-",
    "B+", "B0", "B-",
    "C+", "C0", "C-",
    "D+", "D0", "D-",
    "F",
];