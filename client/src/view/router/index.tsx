import { createBrowserRouter, Navigate } from 'react-router-dom';
import Home from '../home';
import CMS from '../cms';
import React, { memo, useEffect } from 'react';
import App from '../app';
import Login from '../login';
import { Router as RemixRouter } from '@remix-run/router/dist/router';
import { useSelector } from 'react-redux'
import { RootState } from '../../store';

interface IProtectedRoute {
  Component: any;
  redirectPath?: string;
}

const ProtectedRoute = memo((props: IProtectedRoute): JSX.Element => {
  const { Component, redirectPath = '/login' } = props;
  
  const isAuthorized: boolean = useSelector((state: RootState) => {
    return state.common.isAuthorized;
  });
  
  return (
    <>
      {isAuthorized
        ? <Component />
        : <Navigate to={redirectPath} replace />
      }
    </>
  )
});

const router: RemixRouter = createBrowserRouter([
  {
    path: '/',
    element: <App/>,
    children: [
      {
        index: true,
        element: <Home/>,
      },
      {
        path: '/home',
        element: <Home/>,
      },
      {
        path: 'cms',
        element: <ProtectedRoute Component={CMS} />,
        // element: ProtectedRoute({ Component: CMS, isAuthorized: true }),
      },
      {
        path: 'login',
        element: <Login />,
      },
    ]
  },
  {
    path: '*',
    element: <div>Page not found</div>,
  }
]);

export default router;