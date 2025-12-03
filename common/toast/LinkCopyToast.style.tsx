import styled from '@emotion/styled';
import { emotionTheme } from '@styles/themes/theme-new';

export const LinkCopyToastContainer = styled.div<{ isVisible: boolean }>`
  label: link-copy-toast-container;
  position: fixed;
  bottom: 20px;
  left: 50%;
  z-index: 9999;
  transform: translate(-50%, -50%) ${({ isVisible }) => (isVisible ? 'scale(1)' : 'scale(0.8)')};

  /* 모던한 디자인 */
  border-radius: 16px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);

  /* 그림자 효과 */
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04),
    0 0 0 1px rgba(255, 255, 255, 0.05);

  /* 패딩 및 텍스트 */
  padding: 20px 32px;
  font-size: 15px;
  font-weight: 600;
  color: #1f2937;
  letter-spacing: -0.025em;
  white-space: nowrap;

  /* 애니메이션 */
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  opacity: ${({ isVisible }) => (isVisible ? 1 : 0)};

  /* 포인터 이벤트 비활성화 */
  pointer-events: none;
  user-select: none;

  /* 체크 아이콘 추가 */
  display: flex;
  align-items: center;
  gap: 12px;

  &::before {
    content: '✓';
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: white;
    font-size: 14px;
    font-weight: 700;
    flex-shrink: 0;
  }

  /* 다크모드 지원 */
  @media (prefers-color-scheme: dark) {
    background: linear-gradient(135deg, rgba(31, 41, 55, 0.95) 0%, rgba(17, 24, 39, 0.9) 100%);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: #f9fafb;
    box-shadow:
      0 20px 25px -5px rgba(0, 0, 0, 0.4),
      0 10px 10px -5px rgba(0, 0, 0, 0.2),
      0 0 0 1px rgba(255, 255, 255, 0.05);
  }

  /* 모바일 최적화 */
  @media (max-width: 550px) {
    padding: 18px 28px;
    font-size: 14px;
    border-radius: 14px;
  }
`;
