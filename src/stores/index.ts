import { configureStore } from '@reduxjs/toolkit';

import SearchSlice from './SearchSlice';
import SuggestionListSlice from './SuggestionListSlice';

const store = configureStore({
  reducer: {
    search: SearchSlice.reducer,
    suggestionList: SuggestionListSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
