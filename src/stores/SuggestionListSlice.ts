import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { apiService } from '../services/ApiService';

import { SickItem } from '../types';

import { MAX_LIST_ITEM } from '../constants/search';
import { CACHE_KEY_SEARCH } from '../constants/cacheKey';

import { setCache } from '../utils/cache';

interface SuggestionListState {
  searchText: string;
  focusIndex: number;
  suggestionList: SickItem[];
  isLoading: boolean;
  isError: boolean;
}

const initialState: SuggestionListState = {
  searchText: '',
  focusIndex: -1,
  suggestionList: [],
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

export const SuggestionListSlice = createSlice({
  name: 'issueList',
  initialState,
  reducers: {
    setSearchText: (state, { payload: text }) => {
      state.searchText = text;
    },
    resetSearctText: (state) => {
      state.searchText = initialState.searchText;
    },
    setFocusIndex: (state, { payload: index }) => {
      state.focusIndex = index;
    },
    resetFocusIndex: (state) => {
      state.focusIndex = initialState.focusIndex;
    },
    setSuggestionList: (state, { payload: sickList }) => {
      state.suggestionList = [...sickList];
    },
    resetSuggestionList: (state) => {
      state.suggestionList = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSickList.pending, (state) => {
        state.suggestionList = [];
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(fetchSickList.fulfilled, (state, action) => {
        const suggestionList = sliceSickList(action.payload);

        state.suggestionList = [...suggestionList];
        state.isLoading = false;
        state.isError = false;

        setCache({
          key: CACHE_KEY_SEARCH,
          cacheKey: state.searchText,
          cacheValue: suggestionList,
        });
      })
      .addCase(fetchSickList.rejected, (state) => {
        state.suggestionList = [];
        state.isLoading = false;
        state.isError = true;
      });
  },
});

export const {
  setSearchText,
  resetSearctText,
  setFocusIndex,
  resetFocusIndex,
  setSuggestionList,
  resetSuggestionList,
} = SuggestionListSlice.actions;

export default SuggestionListSlice;
