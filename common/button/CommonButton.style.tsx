import styled from '@emotion/styled';
import { emotionTheme } from '@styles/themes/theme-new';

const getCommonButtonContainerBorderColor = (
  emphasis: 'primary' | 'secondary' | 'tertiary' | 'quaternary',
  isDestructive?: boolean | undefined,
  type: 'default' | 'disabled' = 'default'
) => {
  if (type === 'default') {
    if (isDestructive) {
      if (emphasis === 'secondary') return emotionTheme.color.error[600];
      return 'transparent';
    } else {
      if (emphasis === 'secondary') return emotionTheme.color.turqoise[600];
      return 'transparent';
    }
  } else if (type === 'disabled') {
    if (emphasis === 'secondary') return emotionTheme.color.gray[500];
    return 'transparent';
  }
};

const getCommonButtonContainerBackgroundColor = (
  emphasis: 'primary' | 'secondary' | 'tertiary' | 'quaternary',
  isDestructive?: boolean | undefined,
  type: 'default' | 'hover' | 'active' | 'disabled' = 'default'
) => {
  if (isDestructive) {
    if (type === 'default') {
      if (emphasis === 'primary') return emotionTheme.color.error[600];
      if (emphasis === 'secondary') return emotionTheme.color.white;
      if (emphasis === 'tertiary') return emotionTheme.color.error[100];
      if (emphasis === 'quaternary') return emotionTheme.color.white;
    } else if (type === 'hover') {
      if (emphasis === 'primary') return emotionTheme.color.error[500];
      return emotionTheme.color.error[200];
    } else if (type === 'active') {
      if (emphasis === 'primary') return emotionTheme.color.error[800];
      return emotionTheme.color.error[300];
    } else if (type === 'disabled') {
      if (emphasis === 'primary') return emotionTheme.color.gray[200];
      if (emphasis === 'secondary') return emotionTheme.color.white;
      if (emphasis === 'tertiary') return emotionTheme.color.gray[200];
      if (emphasis === 'quaternary') return emotionTheme.color.white;
    }
  } else {
    if (type === 'default') {
      if (emphasis === 'primary') return emotionTheme.color.turqoise[600];
      return emotionTheme.color.white;
    } else if (type === 'hover') {
      if (emphasis === 'primary') return emotionTheme.color.turqoise[500];
      if (emphasis === 'secondary') return emotionTheme.color.turqoise[100];
      if (emphasis === 'tertiary') return emotionTheme.color.turqoise[200];
      if (emphasis === 'quaternary') return emotionTheme.color.black2;
    } else if (type === 'active') {
      if (emphasis === 'primary') return emotionTheme.color.turqoise[700];
      if (emphasis === 'secondary') return emotionTheme.color.turqoise[200];
      if (emphasis === 'tertiary') return emotionTheme.color.turqoise[300];
      if (emphasis === 'quaternary') return emotionTheme.color.black3;
    } else if (type === 'disabled') {
      if (emphasis === 'primary') return emotionTheme.color.gray[200];
      if (emphasis === 'secondary') return emotionTheme.color.white;
      if (emphasis === 'tertiary') return emotionTheme.color.gray[200];
      if (emphasis === 'quaternary') return emotionTheme.color.white;
    }
  }
};

const getCommonButtonContainerSizeStyle = (size: 'full' | 'lg' | 'md' | 'sm' | 'xs') => {
  if (size === 'full') {
    return { height: '48px', gap: '10px', padding: '12px 20px', borderRadius: '12px' };
  }
  if (size === 'lg') {
    return { height: '48px', gap: '10px', padding: '12px 20px', borderRadius: '12px' };
  }
  if (size === 'md') {
    return { height: '40px', gap: '8px', padding: '10px 16px', borderRadius: '8px' };
  }
  if (size === 'sm') {
    return { height: '32px', gap: '6px', padding: '8px 12px', borderRadius: '8px' };
  }
  if (size === 'xs') {
    return { height: '24px', gap: '6px', padding: '4px 8px', borderRadius: '4px' };
  }
  return {};
};

export const CommonButtonContainer = styled.button<{
  size: 'full' | 'lg' | 'md' | 'sm' | 'xs';
  emphasis: 'primary' | 'secondary' | 'tertiary' | 'quaternary';
  isDestructive?: boolean;
}>`
  width: ${({ size }) => size === 'full' && '100%'};
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid
    ${({ emphasis, isDestructive }) =>
      getCommonButtonContainerBorderColor(emphasis, isDestructive)};
  background-color: ${({ emphasis, isDestructive }) =>
    getCommonButtonContainerBackgroundColor(emphasis, isDestructive)};
  ${({ size }) => {
    const { height, gap, padding, borderRadius } =
      getCommonButtonContainerSizeStyle(size);
    return `
      height: ${height};
      gap: ${gap};
      padding: ${padding};
      border-radius: ${borderRadius};
    `;
  }}
  &:hover {
    border: 1px solid
      ${({ emphasis, isDestructive }) =>
        getCommonButtonContainerBorderColor(emphasis, isDestructive)};
    background-color: ${({ emphasis, isDestructive }) =>
      getCommonButtonContainerBackgroundColor(emphasis, isDestructive, 'hover')};
  }
  &:active {
    border: 1px solid
      ${({ emphasis, isDestructive }) =>
        getCommonButtonContainerBorderColor(emphasis, isDestructive)};
    background-color: ${({ emphasis, isDestructive }) =>
      getCommonButtonContainerBackgroundColor(emphasis, isDestructive, 'active')};
  }
  &:disabled {
    border: 1px solid
      ${({ emphasis, isDestructive }) =>
        getCommonButtonContainerBorderColor(emphasis, isDestructive, 'disabled')};
    background-color: ${({ emphasis, isDestructive }) =>
      getCommonButtonContainerBackgroundColor(emphasis, isDestructive, 'disabled')};
  }
`;

const getCommonButtonTextColor = (
  emphasis: 'primary' | 'secondary' | 'tertiary' | 'quaternary',
  isDestructive?: boolean | undefined,
  type: 'default' | 'disabled' = 'default'
) => {
  if (type === 'default') {
    if (isDestructive) {
      if (emphasis === 'primary') return emotionTheme.color.white;
      return emotionTheme.color.error[600];
    } else {
      if (emphasis === 'primary') return emotionTheme.color.white;
      if (emphasis === 'secondary') return emotionTheme.color.turqoise[600];
      if (emphasis === 'tertiary') return emotionTheme.color.turqoise[600];
      if (emphasis === 'quaternary') return emotionTheme.color.gray[700];
    }
  } else if (type === 'disabled') {
    return emotionTheme.color.gray[500];
  }
};

const getCommonButtonTextSizeStyle = (size: 'full' | 'lg' | 'md' | 'sm' | 'xs') => {
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

export const CommonButtonText = styled.span<{
  size: 'full' | 'lg' | 'md' | 'sm' | 'xs';
  emphasis: 'primary' | 'secondary' | 'tertiary' | 'quaternary';
  isDestructive?: boolean;
  disabled?: boolean;
}>`
  white-space: nowrap;
  font-weight: 600;
  color: ${({ emphasis, isDestructive, disabled }) =>
    getCommonButtonTextColor(emphasis, isDestructive, disabled ? 'disabled' : undefined)};
  ${({ size }) => {
    const { fontSize, lineHeight } = getCommonButtonTextSizeStyle(size);
    return `
      font-size: ${fontSize};
      line-height: ${lineHeight};
    `;
  }}
`;
