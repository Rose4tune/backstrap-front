import React, { useMemo } from "react";

/** 입력 데이터: x축 라벨과 학기 평균값 */
export type SemesterPoint = {
    /** 예: "23년 1학기", "24년 1학기" */
    label: string;
    /** 학기 평균 평점 (숫자) */
    value: number | null;
};

type Props = {
    data: SemesterPoint[];           // 차트에 찍을 점들
    scale: 4.0 | 4.3 | 4.5;          // 총점 스케일
    className?: string;              // 추가 스타일(옵션)
};

// ====== 헬퍼: grade 리스트 & 스케일 테이블은 네 기존 값 사용 ======
// GRADE_ORDER, SCALE_TABLE 그대로 사용

// 1) 가장 가까운 "위쪽(>=v)" grade (없으면 최상단 A+를 반환)
function ceilGrade(scale: 4.0 | 4.3 | 4.5, v: number): GradeKey {
    const map = SCALE_TABLE[scale];
    for (const g of GRADE_ORDER) {
        if (map[g] >= v) return g;
    }
    return GRADE_ORDER[0]; // A+
}

// 2) 가장 가까운 "아래쪽(<=v)" grade (없으면 최하단 F를 반환)
function floorGrade(scale: 4.0 | 4.3 | 4.5, v: number): GradeKey {
    const map = SCALE_TABLE[scale];
    for (const g of GRADE_ORDER) {       // A+ → F
        if (map[g] <= v) return g;
    }
    return "F"; // v가 0보다 작아도 F로 클램프
}

function compute4Ticks(scale: 4.0 | 4.3 | 4.5, values: number[] | undefined): GradeKey[] {
    const map = SCALE_TABLE[scale];

    //타입 가드

    // 값이 없으면 기본(A+~B+) 반환
    if (!values || values.length === 0) return ["A+", "A0", "A-", "B+"];

    const maxVal = Math.max(...values);
    const minValRaw = Math.min(...values);

    const hasBelowBplus = values.some(v => v < map["B+"]);
    const minVal = hasBelowBplus ? minValRaw : map["B+"];
    // anchor
    const topG = ceilGrade(scale, maxVal);
    const botG = floorGrade(scale, minVal);
    let topIdx = GRADE_ORDER.indexOf(topG);
    let botIdx = GRADE_ORDER.indexOf(botG);
    if (topIdx > botIdx) [topIdx, botIdx] = [botIdx, topIdx];

    const inRange = GRADE_ORDER.slice(topIdx, botIdx + 1);

    // 4개 이상이면 균등 샘플링
    if (inRange.length >= 4) {
        const n = inRange.length;
        const idxs = [0, Math.round((n - 1) / 3), Math.round(((n - 1) * 2) / 3), n - 1];
        const uniqIdx = Array.from(new Set(idxs)).sort((a, b) => a - b);

        while (uniqIdx.length < 4) {
            const cand = uniqIdx[uniqIdx.length - 1] - 1;
            if (cand > 0 && !uniqIdx.includes(cand)) uniqIdx.splice(uniqIdx.length - 1, 0, cand);
            else break;
        }
        return uniqIdx.slice(0, 4).map(i => inRange[i]);
    }

    // 4개 미만이면 위/아래로 확장
    const ticks = [...inRange];
    let up = topIdx - 1;
    let down = botIdx + 1;
    while (ticks.length < 4 && (up >= 0 || down < GRADE_ORDER.length)) {
        if (up >= 0) { ticks.unshift(GRADE_ORDER[up]); up--; }
        if (ticks.length >= 4) break;
        if (down < GRADE_ORDER.length) { ticks.push(GRADE_ORDER[down]); down++; }
    }
    while (ticks.length < 4) ticks.push(ticks[ticks.length - 1]);

    return ticks.slice(0, 4);
}



const GRADE_ORDER = ["A+", "A0", "A-", "B+", "B0", "B-", "C+", "C0", "C-", "D+", "D0", "D-", "F"] as const;
type GradeKey = typeof GRADE_ORDER[number];

const SCALE_TABLE: Record<4.0 | 4.3 | 4.5, Record<GradeKey, number>> = {
    4.5: {
        "A+": 4.5, "A0": 4.0, "A-": 3.7,
        "B+": 3.5, "B0": 3.0, "B-": 2.7,
        "C+": 2.5, "C0": 2.0, "C-": 1.7,
        "D+": 1.5, "D0": 1.0, "D-": 0.7,
        "F": 0,
    },
    4.3: {
        "A+": 4.3, "A0": 4.0, "A-": 3.7,
        "B+": 3.3, "B0": 3.0, "B-": 2.7,
        "C+": 2.3, "C0": 2.0, "C-": 1.7,
        "D+": 1.3, "D0": 1.0, "D-": 0.7,
        "F": 0,
    },
    4.0: {
        // 4.0 스케일은 A+을 별도 가산 없이 4.0으로 취급
        "A+": 4.0, "A0": 4.0, "A-": 3.7,
        "B+": 3.3, "B0": 3.0, "B-": 2.7,
        "C+": 2.3, "C0": 2.0, "C-": 1.7,
        "D+": 1.3, "D0": 1.0, "D-": 0.7,
        "F": 0,
    },
};
export default function GradeLineChart({ data, scale, className }: Props) {
    // === (A) x축: 셀 중앙 배치 (끝 잘림 방지) ===

    const VB_W = 600, VB_H = 160;
    const Y_LABEL_GUTTER = 40, X_LABEL_GUTTER = 24;
    const x0 = Y_LABEL_GUTTER, y0 = 8;
    const plotW = VB_W - Y_LABEL_GUTTER - 8;
    const plotH = VB_H - X_LABEL_GUTTER - 8; // <- TOP_GUTTER 반영
    const xCells = Math.max(1, data.length);
    const xStep = plotW / xCells;                         // 셀 폭
    const toX = (i: number) => x0 + (i + 0.5) * xStep;    // 셀 중앙

    // === (B) y축: 모든 단계 표기 + 필요시 아래 확장 ===
    const GRADE_ORDER = ["A+", "A0", "A-", "B+", "B0", "B-", "C+", "C0", "C-", "D+", "D0", "D-", "F"] as const;
    type GradeKey = typeof GRADE_ORDER[number];

    const isValid = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);

    // 데이터 최소값 (유효값만)
    const values = useMemo(
        () =>
            data
                .map(d => (Number.isFinite(d.value as number) ? (d.value as number) : undefined))
                .filter((v): v is number => v !== undefined),
        [data]
    );

    if (values.length === 0) {
        return <div className={`w-full min-h-[124px] ${className ?? ""}`} />;
    }

    // (새) 딱 4개의 y축 눈금(상→하)
    const gridGrades: GradeKey[] = compute4Ticks(scale, values);

    // 스케일 범위는 "선택된 4눈금의 최상/최하"로
    const topVal = SCALE_TABLE[scale][gridGrades[0]];
    const botVal = SCALE_TABLE[scale][gridGrades[gridGrades.length - 1]];
    const valueRange = Math.max(1e-4, topVal - botVal);
    const toY = (v: number) => y0 + plotH - ((v - botVal) / valueRange) * plotH;

    // === (C) 라인: 결측 구간은 끊기 ===
    const segments: { x: number; y: number }[][] = [];
    let cur: { x: number; y: number }[] = [];
    data.forEach((d, i) => {
        const v = d.value;
        if (Number.isFinite(v as number)) {
            cur.push({ x: toX(i), y: toY(v as number) });
        } else {
            if (cur.length > 0) segments.push(cur);
            cur = [];
        }
    });
    if (cur.length > 0) segments.push(cur);

    // === 렌더 ===
    return (
        <div className={`relative w-full min-h-[124px] ${className ?? ""} mt-1`}>
            <svg className="w-full h-full" viewBox={`0 0 ${VB_W} ${VB_H}`} preserveAspectRatio="none">
                {/* y 그리드: 모든 단계 라인 + 각 셀 중앙 점수 텍스트 */}
                {/* y 그리드: 각 '선' 위에 점수 라벨 표시 */}
                {gridGrades.map((g) => {
                    const curV = SCALE_TABLE[scale][g];
                    const yTop = toY(curV);
                    return (
                        <g key={g}>
                            {/* 수평 라인 */}
                            <line
                                x1={x0}
                                y1={yTop}
                                x2={x0 + plotW}
                                y2={yTop}
                                className="stroke-gray-200"
                                strokeWidth={1}
                            />
                            {/* 라인 '자체'에 라벨(가운데) */}
                            <text
                                x={Y_LABEL_GUTTER / 2}        // 좌측 거터 중앙
                                y={yTop}                      // 라인의 y좌표 그대로
                                className="fill-gray-500 text-med-12"
                                textAnchor="middle"
                                dominantBaseline="middle"     // 세로 중앙 정렬
                            >
                                {curV.toFixed(1)}
                            </text>
                        </g>
                    );
                })}

                {/* x축 라벨: 셀 중앙 */}
                {data.map((d, i) => {
                    if (!isValid(d.value)) return null; // <- null/undefined/NaN 전부 제외
                    const cx = toX(i), cy = toY(d.value);
                    return (
                        <g key={`pt-${i}`}>
                            <circle cx={cx} cy={cy} r={3.5} className="fill-[#EBFCFB]" />
                            <circle cx={cx} cy={cy} r={2} className="fill-[#10E4D5]" />
                        </g>
                    );
                })}

                {/* x축 라벨: 셀 중앙 */}
                {data.map((d, i) => (
                    <text
                        key={`xlabel-${i}`}
                        x={toX(i)}
                        y={y0 + plotH + 18}          // 바닥보다 살짝 여유
                        className="fill-gray-500 text-med-12"
                        textAnchor="middle"
                    >
                        {d.label}
                    </text>
                ))}

                {/* 선: 결측마다 끊어서 렌더 */}
                {segments.map((seg, si) => (
                    <path
                        key={`seg-${si}`}
                        d={seg.map((p, idx) => `${idx ? "L" : "M"} ${p.x} ${p.y}`).join(" ")}
                        fill="none"
                        className="text-normal"
                        stroke="currentColor"
                        strokeWidth={1}
                    />
                ))}

                {/* 점: 유효값만 렌더 */}
                {data.map((d, i) => {
                    if (!Number.isFinite(d.value as number)) return null;
                    const cx = toX(i), cy = toY(d.value as number);
                    return (
                        <g key={`pt-${i}`}>
                            <circle cx={cx} cy={cy} r={3.5} className="fill-[#EBFCFB]" />
                            <circle cx={cx} cy={cy} r={2} className="fill-[#10E4D5]" />
                        </g>
                    );
                })}
            </svg>
        </div >
    );
}