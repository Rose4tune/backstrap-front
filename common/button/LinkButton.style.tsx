import styled from '@emotion/styled';
import { emotionTheme } from '@styles/themes/theme-new';

const getLinkButtonContainerColorStyle = (
  isDestructive?: boolean | undefined,
  disabled?: boolean
) => {
  if (!disabled) {
    if (isDestructive) {
      return emotionTheme.color.error[600];
    } else {
      return emotionTheme.color.turqoise[600];
    }
  } else if (disabled) {
    return emotionTheme.color.gray[500];
  }
};

const getLinkButtonContainerFontStyle = (size: 'lg' | 'md' | 'sm' | 'xs') => {
  if (size === 'lg') {
    return { fontSize: '16px', lineHeight: '24px' };
  }
  if (size === 'md') {
    return { fontSize: '14px', lineHeight: '20px' };
  }
  if (size === 'sm') {
    return { fontSize: '12px', lineHeight: '16px' };
  }
  if (size === 'xs') {
    return { fontSize: '10px', lineHeight: '12px' };
  }
  return {};
};

export const LinkButtonContainer = styled.a<{
  size: 'lg' | 'md' | 'sm' | 'xs';
  isDestructive?: boolean;
  disabled?: boolean;
}>`
  font-weight: 600;
  color: ${({ isDestructive, disabled }) =>
    getLinkButtonContainerColorStyle(isDestructive, disabled)};
  ${({ size }) => {
    const { fontSize, lineHeight } = getLinkButtonContainerFontStyle(size);
    return `
      font-size: ${fontSize};
      line-height: ${lineHeight};
    `;
  }}
  cursor:  ${({ disabled }) => disabled && 'default'};
`;
