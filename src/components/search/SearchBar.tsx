/* eslint-disable jsx-a11y/no-autofocus */
import { useEffect, useRef } from 'react';

import { styled } from 'styled-components';

import { useDispatch, useSelector } from '../../stores/hooks';
import {
  focusNextItem,
  focusPrevItem,
  closeSuggestionList,
  changeInputByKeyDownEvent,
  changeInputByChangeEvent,
  setIsFocusSearchInput,
} from '../../stores/SearchSlice';

import SearchButton from './SerachButton';

export default function SearchBar() {
  const inputRef = useRef<HTMLInputElement>(null);

  const dispatch = useDispatch();

  const { searchText, focusIndex, searchSuggestionList } = useSelector((state) => state.search);

  useEffect(() => {
    if (focusIndex >= 0 && inputRef.current) {
      const keyword = searchSuggestionList[focusIndex].sickNm;

      dispatch(changeInputByKeyDownEvent(keyword));

      inputRef.current.selectionStart = keyword.length;
      inputRef.current.selectionEnd = keyword.length;
    }
  }, [focusIndex]);

  const changeSearchText = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    dispatch(changeInputByChangeEvent(value));
  };

  const focusSearchInput = () => {
    dispatch(setIsFocusSearchInput(true));
  };

  const blurSearchInput = () => {
    dispatch(setIsFocusSearchInput(false));
    dispatch(closeSuggestionList());
  };

  const handleKeydownInInput = (event: React.KeyboardEvent) => {
    if (event.nativeEvent.isComposing) return;

    if (event.key === 'ArrowDown') {
      dispatch(focusNextItem());
    }

    if (event.key === 'ArrowUp') {
      dispatch(focusPrevItem());
    }

    if (event.key === 'Escape') {
      event.preventDefault();

      dispatch(closeSuggestionList());
    }

    if (event.key === 'Enter') {
      // TODO : 검색 로직 추가
    }
  };

  return (
    <Container>
      <input
        type="search"
        name="search-sick"
        placeholder="질환명을 입력해 주세요."
        value={searchText}
        onChange={changeSearchText}
        onFocus={focusSearchInput}
        onBlur={blurSearchInput}
        onKeyDown={handleKeydownInInput}
        autoFocus
        autoComplete="off"
        ref={inputRef}
      />
      <SearchButton />
    </Container>
  );
}

const Container = styled.div`
  position: relative;

  input {
    padding: 2rem 5rem 2rem 2rem;
    border-radius: 99rem;
    border: none;
    width: 100%;

    &:focus {
      outline: 2px solid ${({ theme }) => theme.colors.main};
    }

    &::placeholder {
      color: ${({ theme }) => theme.colors.gray500};
    }
  }
`;
