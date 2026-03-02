import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from '@/store';

/** Pre-typed dispatch hook — avoids importing AppDispatch everywhere */
export const useAppDispatch: () => AppDispatch = useDispatch;

/** Pre-typed selector hook — avoids importing RootState everywhere */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
