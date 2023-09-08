import { styled } from 'styled-components';

import { getCache } from '../../utils/cache';

import { CACHE_KEY_SEARCH } from '../../constants/cacheKey';

import { useDispatch, useSelector } from '../../stores/hooks';
import {
  setIsKeyDownActive,
} from '../../stores/SearchSlice';
import {
  fetchSickList,
  resetFocusIndex,
  resetSuggestionList,
  setSearchText,
  setSuggestionList,
} from '../../stores/SuggestionListSlice';

import useDebounce from '../../hooks/useDebounce';

import SearchBar from './SearchBar';
import SearchSuggestionList from './SearchSuggestionList';

export default function SearchContainer() {
  const dispatch = useDispatch();

  const { isFocusSearchInput, isKeyDownActive } = useSelector((state) => state.search);
  const { searchText } = useSelector((state) => state.suggestionList);

  const getSuggestionList = async (text: string) => {
    if (!text) {
      dispatch(resetSuggestionList());

      return;
    }

    const cacheData = getCache({
      key: CACHE_KEY_SEARCH,
      cacheKey: text,
    });

    if (cacheData) {
      dispatch(setSuggestionList(cacheData));

      return;
    }

    dispatch(fetchSickList(text));
  };

  const debounceGetSuggestionList = useDebounce({
    delay: 180,
    callback: getSuggestionList,
  });

  const handleChangeSearchInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    dispatch(resetFocusIndex());
    dispatch(setIsKeyDownActive(false));
    dispatch(setSearchText(value));

    if (!isKeyDownActive) {
      debounceGetSuggestionList(value);
    }
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
