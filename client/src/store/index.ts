import { configureStore, createSlice } from '@reduxjs/toolkit';
import { Slice } from '@reduxjs/toolkit/src/createSlice';
import jsCookie from 'js-cookie';
import { ACCESS_TOKEN_NAME } from '../constants';
import { IUser } from '@models/common/users';
import getJWTPayload from '@services/get-jwt-payload';

interface ICommonState {
  isAuthorized: boolean;
  user?: IUser;
  userId?: string;
}

const accessToken: string | undefined = jsCookie.get(ACCESS_TOKEN_NAME);

const userId = getJWTPayload(accessToken)?.userId as string | undefined;

const initialState: ICommonState = {
  isAuthorized: !!userId,
  userId,
};

const commonSlice: Slice = createSlice({
  name: 'common',
  initialState,
  reducers: {
    setUserData: (state, action): void => {
      state.user = action.payload;
      state.userId = action.payload?.id;
    },
    setIsAuthorized: (state, action): void => {
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