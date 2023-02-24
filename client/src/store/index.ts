import { configureStore, createSlice } from '@reduxjs/toolkit';
import { Slice } from '@reduxjs/toolkit/src/createSlice';
import jsCookie from 'js-cookie';

export interface IUser {
  id: number;
  userName: string;
  location?: string;
}

interface ICommonState {
  isAuthorized: boolean;
  user?: IUser;
}

const initialState: ICommonState = {
  isAuthorized: !!jsCookie.get('refresh'),
};

const commonSlice: Slice = createSlice({
  name: 'common',
  initialState,
  reducers: {
    setUserData: (state, action) => {
      state.user = action.payload;
      state.isAuthorized = true;
    },
    setIsAuthorized: (state, action) => {
      state.isAuthorized = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setUserData, setIsAuthorized } = commonSlice.actions;

export const store = configureStore({
  reducer: {
    common: commonSlice.reducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;