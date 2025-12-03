export default function hasImage(content: string): boolean {
    try {
        // 문자열을 JSON으로 변환
        const delta = JSON.parse(content) as Array<any>;

        // 배열 안에서 image가 있는지 확인
        return delta.some(op => typeof op.insert === "object" && op.insert.image);
    } catch (e) {
        console.error("Failed to parse content", e);
        return false;
    }
}