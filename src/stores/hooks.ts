import { useDispatch as originUseDispatch, useSelector as originUseSelector } from 'react-redux';

import type { TypedUseSelectorHook } from 'react-redux';

import type { RootState, AppDispatch } from '.';

export const useDispatch: () => AppDispatch = originUseDispatch;
export const useSelector: TypedUseSelectorHook<RootState> = originUseSelector;
