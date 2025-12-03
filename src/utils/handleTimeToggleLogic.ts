/**
 * 날짜별 시간 선택을 갱신해주는 함수
 * - 같은 날짜에서 시간 선택 토글
 * - 연속되지 않으면 마지막 시간만 유지
 */
export function handleTimeToggleLogic(
    prev: Record<string, string[]>,
    date: string,
    time: string
): Record<string, string[]> {
    const isDifferentDay = !Object.keys(prev).includes(date);

    if (isDifferentDay) {
        return {
            [date]: [time],
        };
    }

    const currentTimes = prev[date] || [];
    const isAlreadySelected = currentTimes.includes(time);

    const newTimes = isAlreadySelected
        ? currentTimes.filter(t => t !== time)
        : [...currentTimes, time];

    if (newTimes.length === 0) {
        const { [date]: _, ...rest } = prev;
        return rest;
    }

    const sortedTimes = [...newTimes].sort();
    const timeInts = sortedTimes.map(t => parseInt(t.split(':')[0], 10));

    const isConsecutive = timeInts.every((t, i, arr) =>
        i === 0 ? true : t === arr[i - 1] + 1
    );

    const filteredTimes = isConsecutive
        ? sortedTimes
        : [sortedTimes[sortedTimes.length - 1]];

    return {
        ...prev,
        [date]: filteredTimes,
    };
}
