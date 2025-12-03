// Delta와 API 콘텐츠 간 변환 로직
import { DeltaContent, DeltaOperation, ContentTransformer } from './RichTextEditor.types';

class ContentTransformerImpl implements ContentTransformer {
  /**
   * Delta를 API 전송용 JSON 문자열로 변환 (ReactQuill 호환)
   */
  deltaToApi(delta: DeltaContent): string {
    try {
      // ReactQuill Delta ops 구조로 변환
      const quillOps = this.convertToQuillOps(delta);
      return JSON.stringify(quillOps);
    } catch (error) {
      console.error('Delta to API conversion failed:', error);
      return JSON.stringify([{ insert: '' }]);
    }
  }

  /**
   * Community Delta를 ReactQuill Delta ops 구조로 변환
   */
  private convertToQuillOps(delta: DeltaContent): any[] {
    const quillOps: any[] = [];
    
    for (const op of delta) {
      if (typeof op.insert === 'string') {
        // 텍스트 삽입
        const quillOp: any = { insert: op.insert };
        
        // 속성이 있으면 추가
        if (op.attributes) {
          quillOp.attributes = { ...op.attributes };
        }
        
        quillOps.push(quillOp);
      } else if (op.insert && typeof op.insert === 'object') {
        // 이미지나 다른 임베드 요소
        if ('image' in op.insert) {
          const quillOp: any = { insert: { image: op.insert.image } };
          
          // alt 속성이 있으면 추가
          if (op.attributes?.alt) {
            quillOp.attributes = { alt: op.attributes.alt };
          }
          
          quillOps.push(quillOp);
        } else {
          // 다른 임베드 요소들도 그대로 유지
          quillOps.push({ insert: op.insert, attributes: op.attributes });
        }
      }
    }
    
    return quillOps;
  }

  /**
   * API 응답 문자열을 Delta로 변환 (ReactQuill 호환)
   */
  apiToDelta(content: string): DeltaContent {
    try {
      if (!content || content.trim() === '') {
        return [{ insert: '' }];
      }

      // JSON 형태인 경우 파싱
      if (content.startsWith('[') || content.startsWith('{')) {
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed)) {
          // ReactQuill Delta ops 구조를 Community Delta로 변환
          return this.convertFromQuillOps(parsed);
        }
        return [{ insert: content }];
      }

      // 일반 텍스트인 경우 Delta로 변환
      return [{ insert: content }];
    } catch (error) {
      console.error('API to Delta conversion failed:', error);
      // fallback: 일반 텍스트로 처리
      return [{ insert: content || '' }];
    }
  }

  /**
   * ReactQuill Delta ops를 Community Delta 구조로 변환
   */
  private convertFromQuillOps(quillOps: any[]): DeltaContent {
    const delta: DeltaContent = [];
    
    for (const op of quillOps) {
      if (typeof op.insert === 'string') {
        // 텍스트 삽입
        const deltaOp: DeltaOperation = { insert: op.insert };
        
        if (op.attributes) {
          deltaOp.attributes = { ...op.attributes };
        }
        
        delta.push(deltaOp);
      } else if (op.insert && typeof op.insert === 'object') {
        // 이미지나 다른 임베드 요소
        const deltaOp: DeltaOperation = { insert: op.insert };
        
        if (op.attributes) {
          deltaOp.attributes = { ...op.attributes };
        }
        
        delta.push(deltaOp);
      }
    }
    
    return delta;
  }

  /**
   * Delta를 HTML로 변환
   */
  deltaToHtml(delta: DeltaContent): string {
    if (!delta || delta.length === 0) {
      return '';
    }

    let html = '';
    let currentBlock = '';
    let inList = false;
    let listType = '';

    for (const op of delta) {
      if (typeof op.insert === 'string') {
        let text = this.escapeHtml(op.insert);

        // 텍스트 포맷팅 적용
        if (op.attributes) {
          if (op.attributes.bold) text = `<strong>${text}</strong>`;
          if (op.attributes.italic) text = `<em>${text}</em>`;
          if (op.attributes.underline) text = `<u>${text}</u>`;
          if (op.attributes.strike) text = `<s>${text}</s>`;
          if (op.attributes.link) text = `<a href="${this.escapeHtml(op.attributes.link)}" target="_blank" rel="noopener noreferrer">${text}</a>`;
          if (op.attributes.color) text = `<span style="color: ${op.attributes.color}">${text}</span>`;
          if (op.attributes.background) text = `<span style="background-color: ${op.attributes.background}">${text}</span>`;
        }

        // 블록 레벨 요소 처리
        if (op.attributes?.header) {
          const level = op.attributes.header;
          html += `<h${level}>${text}</h${level}>`;
        } else if (op.attributes?.blockquote) {
          html += `<blockquote>${text}</blockquote>`;
        } else if (op.attributes?.['code-block']) {
          html += `<pre><code>${text}</code></pre>`;
        } else if (op.attributes?.list) {
          const newListType = op.attributes.list === 'ordered' ? 'ol' : 'ul';

          if (!inList || listType !== newListType) {
            if (inList) html += `</${listType}>`;
            html += `<${newListType}>`;
            inList = true;
            listType = newListType;
          }
          html += `<li>${text}</li>`;
        } else {
          if (inList) {
            html += `</${listType}>`;
            inList = false;
          }

          // 개행 처리
          if (text.includes('\n')) {
            const lines = text.split('\n');
            for (let i = 0; i < lines.length; i++) {
              if (i > 0) html += '<br>';
              html += lines[i];
            }
          } else {
            html += text;
          }
        }
      } else if (op.insert && typeof op.insert === 'object') {
        if (inList) {
          html += `</${listType}>`;
          inList = false;
        }

        // 이미지 처리
        if ('image' in op.insert) {
          const alt = op.attributes?.alt || '';
          html += `<img src="${this.escapeHtml(op.insert.image)}" alt="${this.escapeHtml(alt)}" />`;
        }
        // 비디오 처리 (향후 확장)
        else if (op.insert.video) {
          html += `<video src="${this.escapeHtml(op.insert.video)}" controls></video>`;
        }
      }
    }

    // 열린 리스트 닫기
    if (inList) {
      html += `</${listType}>`;
    }

    return html.trim();
  }

  /**
   * Delta를 순수 텍스트로 변환
   */
  deltaToText(delta: DeltaContent): string {
    if (!delta || delta.length === 0) {
      return '';
    }

    let text = '';
    for (const op of delta) {
      if (typeof op.insert === 'string') {
        text += op.insert;
      }
      // 이미지나 다른 요소는 텍스트에서 제외하거나 placeholder 추가
      else if (op.insert && typeof op.insert === 'object') {
        if ('image' in op.insert) {
          text += '[이미지]';
        }
      }
    }
    return text.trim();
  }

  /**
   * Delta에서 이미지 URL 추출
   */
  extractImages(delta: DeltaContent): string[] {
    const images: string[] = [];

    for (const op of delta) {
      if (op.insert && typeof op.insert === 'object' && 'image' in op.insert) {
        images.push(op.insert.image);
      }
    }

    return images;
  }

  /**
   * 콘텐츠 유효성 검증
   */
  validateContent(delta: DeltaContent): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!delta || !Array.isArray(delta)) {
      errors.push('올바르지 않은 콘텐츠 형식입니다.');
      return { isValid: false, errors };
    }

    // 빈 콘텐츠 검사
    const text = this.deltaToText(delta);
    if (text.trim().length === 0) {
      errors.push('내용을 입력해주세요.');
    }

    // 최대 길이 검사 (10,000자)
    if (text.length > 10000) {
      errors.push('내용이 너무 깁니다. (최대 10,000자)');
    }

    // 이미지 URL 유효성 검사
    const images = this.extractImages(delta);
    for (const imageUrl of images) {
      if (!this.isValidUrl(imageUrl)) {
        errors.push(`올바르지 않은 이미지 URL입니다: ${imageUrl}`);
      }
    }

    // 링크 유효성 검사
    for (const op of delta) {
      if (op.attributes?.link && !this.isValidUrl(op.attributes.link)) {
        errors.push(`올바르지 않은 링크 URL입니다: ${op.attributes.link}`);
      }
    }

    return { isValid: errors.length === 0, errors };
  }

  /**
   * HTML 이스케이프 처리
   */
  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * URL 유효성 검사
   */
  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Delta 콘텐츠가 비어있는지 확인
   */
  isEmpty(delta: DeltaContent): boolean {
    const text = this.deltaToText(delta);
    const images = this.extractImages(delta);
    return text.trim().length === 0 && images.length === 0;
  }

  /**
   * Delta 콘텐츠의 길이 계산 (텍스트만)
   */
  getLength(delta: DeltaContent): number {
    return this.deltaToText(delta).length;
  }

  /**
   * 기본 Delta 콘텐츠 생성
   */
  createEmptyDelta(): DeltaContent {
    return [{ insert: '' }];
  }

  /**
   * 텍스트를 Delta로 변환
   */
  textToDelta(text: string): DeltaContent {
    return [{ insert: text }];
  }

  /**
   * ReactQuill과 호환되는 Delta ops 구조인지 검증
   */
  validateQuillCompatibility(content: string): boolean {
    try {
      const parsed = JSON.parse(content);
      if (!Array.isArray(parsed)) return false;
      
      // ReactQuill Delta ops의 기본 구조 검증
      for (const op of parsed) {
        if (!op.hasOwnProperty('insert')) return false;
        // insert는 string이거나 object여야 함
        if (typeof op.insert !== 'string' && typeof op.insert !== 'object') return false;
      }
      
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Community Delta와 ReactQuill ops 비교 (디버그용)
   */
  debugCompareWithQuill(communityDelta: DeltaContent): void {
    console.group('🔍 Delta Conversion Debug');
    console.log('1. Original Community Delta:', communityDelta);
    
    const quillOps = this.convertToQuillOps(communityDelta);
    console.log('2. Converted to ReactQuill ops:', quillOps);
    
    const stringified = JSON.stringify(quillOps);
    console.log('3. Stringified (sent to API):', stringified);
    
    const isValid = this.validateQuillCompatibility(stringified);
    console.log('4. ReactQuill compatible:', isValid ? '✅' : '❌');
    
    // 역변환 테스트
    const backConverted = this.convertFromQuillOps(quillOps);
    console.log('5. Back-converted to Community Delta:', backConverted);
    
    console.groupEnd();
  }

  /**
   * 이미지를 Delta에 삽입
   */
  insertImageToDelta(delta: DeltaContent, imageUrl: string, alt?: string): DeltaContent {
    const imageOp: DeltaOperation = {
      insert: { image: imageUrl },
      attributes: alt ? { alt } : undefined
    };

    return [...delta, imageOp, { insert: '\n' }];
  }

  /**
   * 링크를 Delta에 삽입
   */
  insertLinkToDelta(delta: DeltaContent, url: string, text: string): DeltaContent {
    const linkOp: DeltaOperation = {
      insert: text,
      attributes: { link: url }
    };

    return [...delta, linkOp];
  }
}

// 싱글톤 인스턴스 내보내기
export const contentTransformer = new ContentTransformerImpl();
export default contentTransformer;