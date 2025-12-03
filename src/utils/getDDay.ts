export function getDDay(deadlineDate?: string): string {
  if (!deadlineDate) return '상시채용'; //실제 DB에는 +9999로 들어가있음
  const now = new Date();
  const deadline = new Date(deadlineDate);

  // 시간 차이를 밀리초로 계산 후 일 단위로 변환
  const diffTime = deadline.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // 올림 처리

  if (diffDays < 0) return '채용마감';
  if (deadline.getFullYear() > 999) return '상시채용';

  return `D-${diffDays}`;
}
