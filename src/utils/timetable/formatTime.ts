export function formatTime(time: string) {
    // 이미 : 들어있으면 그대로 반환
    if (time.includes(":")) return time;
    if (time.length === 4) {
        return `${time.slice(0, 2)}:${time.slice(2)}`;
    }
    return time;
}