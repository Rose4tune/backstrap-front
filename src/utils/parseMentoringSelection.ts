interface MentoringTimeSelection {
    date: string; // "2025-06-23"
    time: string; // "14:00:00"
}

interface ParsedTimeInfo {
    formattedDateStr: string; // "2025-06-23"
    formattedDate: string;    // "2025년 6월 23일"
    formattedTime: string;    // "14:00~17:00"
    startTime: string;        // "14:00:00"
    endTime: string;          // "17:00:00"
    duration: number;
}

export function getParsedMentoringSelection(): ParsedTimeInfo | null {
    const raw = sessionStorage.getItem('mentoring-time-selection');
    if (!raw) return null;

    const selections: MentoringTimeSelection[] = JSON.parse(raw);
    if (selections.length === 0) return null;

    const date = selections[0].date;
    const parsedDate = new Date(date);

    const formattedDateStr = date;
    const formattedDate = `${parsedDate.getFullYear()}년 ${parsedDate.getMonth() + 1}월 ${parsedDate.getDate()}일`;

    const sortedTimes = selections
        .map(sel => sel.time)
        .sort((a, b) => a.localeCompare(b));

    const [startHour, startMinute, startSecond] = sortedTimes[0].split(':');
    const [lastHour] = sortedTimes[sortedTimes.length - 1].split(':');
    const endHour = (parseInt(lastHour, 10) + 1).toString().padStart(2, '0');

    const startTime = `${startHour}:${startMinute}:${startSecond}`;
    const endTime = `${endHour}:${startMinute}:${startSecond}`;
    const formattedTime = `${startHour}:${startMinute}~${endHour}:${startMinute}`;

    const duration = parseInt(endHour, 10) - parseInt(startHour, 10); // 정수 차이

    return {
        formattedDateStr,
        formattedDate,
        formattedTime,
        startTime,
        endTime,
        duration,
    };
}
