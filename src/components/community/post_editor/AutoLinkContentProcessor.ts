// 자동 링크 감지 및 Delta 변환 처리기
import { DeltaContent, DeltaOperation } from './RichTextEditor.types';

export class AutoLinkContentProcessor {
  private static readonly URL_REGEX = /(https?:\/\/[^\s]+)/g;
  private static readonly IMAGE_URL_REGEX = /(https?:\/\/[^\s]+\.(jpg|jpeg|png|gif|webp|svg))/gi;

  /**
   * 텍스트를 분석하여 자동으로 링크를 감지하고 Delta 형식으로 변환
   */
  static textToDelta(text: string): DeltaContent {
    if (!text.trim()) {
      return [{ insert: '' }];
    }

    const delta: DeltaContent = [];
    const lines = text.split('\n');

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (line.trim() === '') {
        // 빈 줄 처리
        delta.push({ insert: '\n' });
        continue;
      }

      // 한 줄씩 URL 감지 및 변환
      this.processLineForLinks(line, delta);

      // 마지막 줄이 아니면 개행 추가
      if (i < lines.length - 1) {
        delta.push({ insert: '\n' });
      }
    }

    return delta.length > 0 ? delta : [{ insert: '' }];
  }

  /**
   * 한 줄에서 URL을 감지하고 Delta 작업으로 변환
   */
  private static processLineForLinks(line: string, delta: DeltaContent): void {
    let lastIndex = 0;
    let match;

    // 이미지 URL 먼저 처리 (더 구체적인 패턴)
    const imageMatches = [...line.matchAll(this.IMAGE_URL_REGEX)];

    if (imageMatches.length > 0) {
      // 이미지가 있는 경우 이미지 처리
      for (const imageMatch of imageMatches) {
        const beforeText = line.substring(lastIndex, imageMatch.index);
        if (beforeText) {
          this.processTextForRegularLinks(beforeText, delta);
        }

        // 이미지 삽입
        delta.push({
          insert: { image: imageMatch[0] },
          attributes: { alt: 'Uploaded Image' }
        });

        lastIndex = (imageMatch.index || 0) + imageMatch[0].length;
      }

      // 남은 텍스트 처리
      const remainingText = line.substring(lastIndex);
      if (remainingText) {
        this.processTextForRegularLinks(remainingText, delta);
      }
    } else {
      // 일반 링크만 처리
      this.processTextForRegularLinks(line, delta);
    }
  }

  /**
   * 텍스트에서 일반 링크(비이미지) 감지 및 처리
   */
  private static processTextForRegularLinks(text: string, delta: DeltaContent): void {
    let lastIndex = 0;
    let match;

    const urlRegex = new RegExp(this.URL_REGEX);

    while ((match = urlRegex.exec(text)) !== null) {
      // 이미지 URL은 제외
      if (this.IMAGE_URL_REGEX.test(match[0])) {
        continue;
      }

      // URL 앞의 텍스트 추가
      const beforeText = text.substring(lastIndex, match.index);
      if (beforeText) {
        delta.push({ insert: beforeText });
      }

      // 링크 추가
      delta.push({
        insert: match[0],
        attributes: { link: match[0] }
      });

      lastIndex = (match.index || 0) + match[0].length;
    }

    // 남은 텍스트 추가
    const remainingText = text.substring(lastIndex);
    if (remainingText) {
      delta.push({ insert: remainingText });
    }
  }

  /**
   * Delta를 표시용 텍스트로 변환
   * 이미지는 textarea에 표시하지 않음 (ImageUploadComponent에서만 표시)
   */
  static deltaToDisplayText(delta: DeltaContent): string {
    if (!delta || delta.length === 0) {
      return '';
    }

    let text = '';

    for (const op of delta) {
      if (typeof op.insert === 'string') {
        text += op.insert;
      } else if (op.insert && typeof op.insert === 'object') {
        // 이미지는 textarea에 표시하지 않음 (ImageUploadComponent에서 처리)
      }
    }

    return text;
  }

  /**
   * URL이 이미지인지 확인
   */
  static isImageUrl(url: string): boolean {
    return this.IMAGE_URL_REGEX.test(url);
  }

  /**
   * URL이 유효한지 확인
   */
  static isValidUrl(text: string): boolean {
    try {
      new URL(text);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * 텍스트에서 링크 개수 계산
   */
  static countLinks(text: string): number {
    const matches = text.match(this.URL_REGEX);
    return matches ? matches.length : 0;
  }

  /**
   * 텍스트에서 이미지 개수 계산
   */
  static countImages(text: string): number {
    const matches = text.match(this.IMAGE_URL_REGEX);
    return matches ? matches.length : 0;
  }

  /**
   * Delta에서 모든 링크 URL 추출
   */
  static extractLinks(delta: DeltaContent): string[] {
    const links: string[] = [];

    for (const op of delta) {
      if (op.attributes?.link) {
        links.push(op.attributes.link);
      }
    }

    return links;
  }

  /**
   * Delta에서 모든 이미지 URL 추출
   */
  static extractImages(delta: DeltaContent): string[] {
    const images: string[] = [];

    for (const op of delta) {
      if (op.insert && typeof op.insert === 'object' && 'image' in op.insert) {
        images.push(op.insert.image);
      }
    }

    return images;
  }

  /**
   * 실시간 입력 처리 - 커서 위치 고려한 스마트 변환
   */
  static processRealtimeInput(
    text: string,
    cursorPosition: number
  ): { delta: DeltaContent; newCursorPosition: number } {
    const delta = this.textToDelta(text);

    // 간단한 커서 위치 유지 (실제로는 더 정교한 로직 필요)
    let newCursorPosition = cursorPosition;

    return { delta, newCursorPosition };
  }

  /**
   * 테스트용 예시 텍스트 → Delta 변환 결과 로깅
   */
  static testExampleContent(): void {
    const exampleText = `1. 스터디 방식
- 온라인 (Zoom) 진행 / 주 1회 1시간
- 그룹당 2~3명 소규모 + 숙련된 리더 1명
- New York Times / BBC 등 공신력 있는 기사 기반으로 토론 주제 제공 (예시: https://bit.ly/spker_g10)
- 레벨별 그룹 결성 (왕초보/초급/중급/상급/원어민)
- 현재 총 34개 그룹 운영 중 / 누적 참여자 수 184명 / 연장률: 89.9%

2. 차별화된 AI 피드백 시스템
- Otter.AI 통해 각 세션 음성 녹음 및 전사
- Gemini 2.5 Pro 이용해 참가자별 어휘/문법/발음 정밀 분석
- 개인별 맞춤 스피킹 리포트 제공 (예시: https://bit.ly/spker_yule)
- 피드백 리포트를 통해 취약 부분 객관 점검 및 학습 방향 설정 가능

프리 세션 (무료 체험) 신청서: https://bit.ly/spker_form

https://resource.bagstrap.team/api/v1/files/action/download/ebbabdd3-0eec-41e3-9902-5d340b4da3a6.jpg`;

    const delta = this.textToDelta(exampleText);
    console.log('Generated Delta:', JSON.stringify(delta, null, 2));

    return;
  }
}

export default AutoLinkContentProcessor;