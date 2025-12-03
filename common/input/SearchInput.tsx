import { forwardRef } from 'react';

import Search16pxIcon from '@public/icons/search-16px.svg';
import CloseGray from '@public/icons/close-gray.svg';

import {
  SearchInputContainer,
  SearchInputText,
  SearchInputSearchIconContainer,
  SearchInputCloseIconContainer
} from './SearchInput.style';

export interface SearchInputProps
  extends BaseInputProps,
    Pick<
      React.HTMLProps<HTMLInputElement>,
      'type' | 'maxLength' | 'autoComplete' | 'autoFocus'
    > {
  onClear: () => void;
  onSubmit: () => void;
}

const SearchInput = (
  props: SearchInputProps,
  ref?: React.Ref<HTMLInputElement>
): JSX.Element => {
  const {
    name,
    value = '',
    onChange,
    onSubmit,
    onBlur,
    onClear,
    placeholder,
    autoFocus,
    autoComplete,
    maxLength,
    disabled,
    readOnly
  } = props;

  return (
    <SearchInputContainer>
      <SearchInputText
        ref={ref}
        name={name}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        autoComplete={autoComplete}
        autoFocus={autoFocus}
        maxLength={maxLength}
        disabled={disabled}
        readOnly={readOnly}
        onKeyDown={e => {
          if (e.key === 'Enter') {
            e.preventDefault();
            onSubmit();
          }
        }}
      />
      <SearchInputSearchIconContainer onClick={onSubmit}>
        <Search16pxIcon />
      </SearchInputSearchIconContainer>
      <SearchInputCloseIconContainer>
        <CloseGray onClick={onClear} />
      </SearchInputCloseIconContainer>
    </SearchInputContainer>
  );
};

export default forwardRef(SearchInput);
