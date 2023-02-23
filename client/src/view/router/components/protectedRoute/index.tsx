import React, { memo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import { Navigate } from 'react-router-dom';

interface IProtectedRoute {
  Component: any;
  redirectPath?: string;
}

const ProtectedRoute = memo((props: IProtectedRoute): JSX.Element => {
  const { Component, redirectPath = '/login' } = props;
  const isAuthorized: boolean = useSelector((state: RootState) => state.common.isAuthorized);
  
  return (
    <>
      {isAuthorized
        ? <Component />
        : <Navigate to={redirectPath} replace />
      }
    </>
  )
});

export default ProtectedRoute;