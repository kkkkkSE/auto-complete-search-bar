/* eslint-disable jsx-a11y/no-autofocus */
import { styled } from 'styled-components';

import { useDispatch, useSelector } from '../../stores/hooks';

import {
  setIsFocusSearchInput,
  setIsKeyDownActive,
} from '../../stores/SearchSlice';
import { resetFocusIndex, setFocusIndex, setSearchText } from '../../stores/SuggestionListSlice';

import { MAX_LIST_ITEM } from '../../constants/search';

import SearchButton from './SerachButton';

interface SearchBarProps {
  onChangeSearchInput: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function SearchBar({ onChangeSearchInput }: SearchBarProps) {
  const dispatch = useDispatch();

  const { searchText } = useSelector((state) => state.suggestionList);
  const { focusIndex, suggestionList } = useSelector(
    (state) => state.suggestionList,
  );

  const getKeyword = (index: number) => {
    if (index < 0) return '';

    return suggestionList[index].sickNm;
  };

  const focusSearchInput = () => {
    dispatch(setIsFocusSearchInput(true));
  };

  const blurSearchInput = () => {
    dispatch(setIsFocusSearchInput(false));
    dispatch(resetFocusIndex());
    dispatch(setIsKeyDownActive(false));
  };

  const handleKeydownInput = (event: React.KeyboardEvent) => {
    if (event.nativeEvent.isComposing) return;

    const listLength = suggestionList.length;

    const maxLength = Math.min(listLength, MAX_LIST_ITEM);

    if (maxLength > 0) {
      if (event.key === 'ArrowDown') {
        event.preventDefault();

        const nextIndex = focusIndex + 1 < maxLength
          ? focusIndex + 1
          : 0;

        const keyword = getKeyword(nextIndex);

        dispatch(setIsKeyDownActive(true));
        dispatch(setFocusIndex(nextIndex));
        dispatch(setSearchText(keyword));
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault();

        const prevIndex = focusIndex - 1 >= 0
          ? focusIndex - 1
          : maxLength - 1;

        const keyword = getKeyword(prevIndex);

        dispatch(setIsKeyDownActive(true));
        dispatch(setFocusIndex(prevIndex));
        dispatch(setSearchText(keyword));
      }
    }

    if (event.key === 'Escape') {
      event.preventDefault();

      dispatch(setIsFocusSearchInput(false));
      dispatch(resetFocusIndex());
      dispatch(setIsKeyDownActive(false));
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
        onChange={onChangeSearchInput}
        onFocus={focusSearchInput}
        onBlur={blurSearchInput}
        onKeyDown={handleKeydownInput}
        autoFocus
        autoComplete="off"
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
