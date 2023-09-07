import { styled } from 'styled-components';

import useDebounce from '../../hooks/useDebounce';

import { getCache } from '../../utils/cache';

import { CACHE_KEY_SEARCH } from '../../constants/cacheKey';

import { useDispatch, useSelector } from '../../stores/hooks';
import {
  fetchSickList, setSearchSuggestionList, resetSearchSuggestionList, resetFocusIndex,
} from '../../stores/SearchSlice';

import SearchBar from './SearchBar';
import SearchSuggestionList from './SearchSuggestionList';

export default function SearchContainer() {
  const dispatch = useDispatch();

  const { searchText, isFocusSearchInput, isKeyDownActive } = useSelector((state) => state.search);

  const getSearchSuggestionList = async () => {
    if (isKeyDownActive) {
      return;
    }

    if (!searchText) {
      dispatch(resetSearchSuggestionList());

      return;
    }

    dispatch(resetFocusIndex());

    const cacheData = getCache({
      key: CACHE_KEY_SEARCH,
      cacheKey: searchText,
    });

    if (cacheData) {
      dispatch(setSearchSuggestionList(cacheData));

      return;
    }

    dispatch(fetchSickList(searchText));
  };

  useDebounce({
    delay: 180,
    callback: getSearchSuggestionList,
    trigger: searchText,
  });

  return (
    <Container>
      <SearchBar />
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
