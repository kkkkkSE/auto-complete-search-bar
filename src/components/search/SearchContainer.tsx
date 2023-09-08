import { styled } from 'styled-components';

import { getCache } from '../../utils/cache';

import { CACHE_KEY_SEARCH } from '../../constants/cacheKey';

import { useDispatch, useSelector } from '../../stores/hooks';
import {
  fetchSickList,
  setSearchSuggestionList,
  resetSearchSuggestionList,
  resetFocusIndex,
  changeInputByChangeEvent,
} from '../../stores/SearchSlice';

import useDebounce from '../../hooks/useDebounce';

import SearchBar from './SearchBar';
import SearchSuggestionList from './SearchSuggestionList';

export default function SearchContainer() {
  const dispatch = useDispatch();

  const { searchText, isFocusSearchInput, isKeyDownActive } = useSelector((state) => state.search);

  const getSuggestionList = async (text: string) => {
    if (isKeyDownActive) {
      return;
    }

    if (!text) {
      dispatch(resetSearchSuggestionList());

      return;
    }

    dispatch(resetFocusIndex());

    const cacheData = getCache({
      key: CACHE_KEY_SEARCH,
      cacheKey: text,
    });

    if (cacheData) {
      dispatch(setSearchSuggestionList(cacheData));

      return;
    }

    dispatch(fetchSickList(text));
  };

  const getDebounceSuggestionList = useDebounce({
    delay: 180,
    callback: getSuggestionList,
  });

  const handleChangeSearchInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    dispatch(changeInputByChangeEvent(value));

    getDebounceSuggestionList(value);
  };

  return (
    <Container>
      <SearchBar onChangeSearchInput={handleChangeSearchInput} />
      {searchText && isFocusSearchInput && (
        <SearchSuggestionList />
      )}
    </Container>
  );
}

const Container = styled.div`
  width: 36rem;
  max-width: 100vw;
`;
