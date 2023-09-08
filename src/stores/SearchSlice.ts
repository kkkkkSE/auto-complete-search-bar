import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { apiService } from '../services/ApiService';

import { SickItem } from '../types';

import { MAX_LIST_ITEM } from '../constants/search';
import { CACHE_KEY_SEARCH } from '../constants/cacheKey';

import { setCache } from '../utils/cache';

interface SearchState {
  searchText: string;
  focusIndex: number;
  isFocusSearchInput: boolean;
  isKeyDownActive: boolean;
  searchSuggestionList: SickItem[];
  isLoading: boolean;
  isError: boolean;
}

const initialState: SearchState = {
  searchText: '',
  focusIndex: -1,
  isFocusSearchInput: false,
  isKeyDownActive: false,
  searchSuggestionList: [],
  isLoading: false,
  isError: false,
};

const sliceSickList = (sickList: SickItem[]) => sickList.slice(0, MAX_LIST_ITEM);

export const fetchSickList = createAsyncThunk(
  'search/fetchSickList',
  async (searchText: string, thunkApi) => {
    try {
      const data = await apiService.fetchSickList({ searchText });

      return data;
    } catch (e) {
      if (e instanceof Error) {
        return thunkApi.rejectWithValue(e.message);
      }

      return thunkApi.rejectWithValue('Network Error');
    }
  },
);

export const SearchSlice = createSlice({
  name: 'issueList',
  initialState,
  reducers: {
    setFocusIndex: (state, { payload: index }) => {
      state.focusIndex = index;
    },
    resetFocusIndex: (state) => {
      state.focusIndex = -1;
    },
    setSearchSuggestionList: (state, { payload: sickList }) => {
      state.searchSuggestionList = [...sickList];
    },
    resetSearchSuggestionList: (state) => {
      state.searchSuggestionList = [];
    },
    setIsFocusSearchInput: (state, { payload: isFocus }) => {
      state.isFocusSearchInput = isFocus;
    },
    changeInputByChangeEvent: (state, { payload: searchText }) => {
      state.isKeyDownActive = false;
      state.searchText = searchText;
    },
    changeInputByKeyDownEvent: (state, { payload: searchText }) => {
      state.isKeyDownActive = true;
      state.searchText = searchText;
    },
    focusNextItem: (state) => {
      const { length } = state.searchSuggestionList;

      const maxLength = Math.min(length, MAX_LIST_ITEM);

      const nextIndex = state.focusIndex + 1 < maxLength
        ? state.focusIndex + 1
        : 0;

      state.isKeyDownActive = true;
      state.focusIndex = nextIndex;
    },
    focusPrevItem: (state) => {
      const { length } = state.searchSuggestionList;

      const maxLength = Math.min(length, MAX_LIST_ITEM);

      const prevIndex = state.focusIndex - 1 >= 0
        ? state.focusIndex - 1
        : maxLength - 1;

      state.isKeyDownActive = true;
      state.focusIndex = prevIndex;
    },
    closeSuggestionList: (state) => {
      state.focusIndex = -1;
      state.isFocusSearchInput = false;
      state.isKeyDownActive = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSickList.pending, (state) => {
        state.searchSuggestionList = [];
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(fetchSickList.fulfilled, (state, { payload: sickList }) => {
        const searchSuggestionList = sliceSickList(sickList);

        state.searchSuggestionList = [...searchSuggestionList];
        state.isLoading = false;
        state.isError = false;

        setCache({
          key: CACHE_KEY_SEARCH,
          cacheKey: state.searchText,
          cacheValue: searchSuggestionList,
        });
      })
      .addCase(fetchSickList.rejected, (state) => {
        state.searchSuggestionList = [];
        state.isLoading = false;
        state.isError = true;
      });
  },
});

export const {
  setFocusIndex,
  resetFocusIndex,
  setSearchSuggestionList,
  resetSearchSuggestionList,
  setIsFocusSearchInput,
  changeInputByChangeEvent,
  changeInputByKeyDownEvent,
  focusNextItem,
  focusPrevItem,
  closeSuggestionList,
} = SearchSlice.actions;

export default SearchSlice;
