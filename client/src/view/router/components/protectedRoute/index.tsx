import React, { memo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, setUserData } from '@src/store';
import { Navigate } from 'react-router-dom';
import { getResponseData, httpRequest } from '@services/axios';
import { IUser } from '@models/common/users';
import isOkResponse from '@services/is-ok-response';
import { Dispatch } from '@reduxjs/toolkit';

interface IProtectedRoute {
  Component: any;
  redirectPath?: string;
}

function ProtectedRoute (props: IProtectedRoute): JSX.Element {
  const { Component, redirectPath = '/login' } = props;
  const dispatch: Dispatch = useDispatch();
  const isAuthorized: boolean = useSelector((state: RootState) => state.common.isAuthorized);
  const user: IUser | undefined = useSelector((state: RootState) => state.common.user);
  const userId: string | undefined = useSelector((state: RootState) => state.common.userId);
  
  useEffect((): void => {
    (async function() {
      if (isAuthorized && !user && userId) {
        await getUser();
      }
    })();
  }, [isAuthorized, user, userId]);
  
  async function getUser(): Promise<void> {
    try {
      const res = await httpRequest({
        url: `/users/${userId}`,
        method: 'GET',
      });
      
      if (isOkResponse(res)) {
        const { user } = getResponseData(res);
        dispatch(setUserData(user));
      }
    } catch (e) {
      console.error(e);
    }
  }
  
  return (
    <>
      {isAuthorized
        ? <Component />
        : <Navigate to={redirectPath} replace />
      }
    </>
  )
}

export default memo(ProtectedRoute);