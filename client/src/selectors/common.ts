import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

export const storeSelector = createSelector((s: RootState) => s, s => s);

const isAuthorized = createSelector(
  storeSelector,
    data => data.common.isAuthorized,
);

export default {
  isAuthorized,
}