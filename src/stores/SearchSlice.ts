import { createSlice } from '@reduxjs/toolkit';

interface SearchState {
  isFocusSearchInput: boolean;
  isKeyDownActive: boolean;

}

const initialState: SearchState = {
  isFocusSearchInput: false,
  isKeyDownActive: false,
};

export const SearchSlice = createSlice({
  name: 'issueList',
  initialState,
  reducers: {

    setIsFocusSearchInput: (state, { payload: isFocus }) => {
      state.isFocusSearchInput = isFocus;
    },
    setIsKeyDownActive: (state, { payload: isActive }) => {
      state.isKeyDownActive = isActive;
    },
  },
});

export const {

  setIsFocusSearchInput,
  setIsKeyDownActive,
} = SearchSlice.actions;

export default SearchSlice;
