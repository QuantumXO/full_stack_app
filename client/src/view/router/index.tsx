import { createBrowserRouter, Navigate } from 'react-router-dom';
import Home from '../home';
import CMS from '../cms';
import React, { memo } from 'react';
import App from '../app';
import Login from '../login';
import { Router as RemixRouter } from '@remix-run/router/dist/router';
import { useSelector } from 'react-redux'
import { RootState } from '../../store';
import SignUp from '../sign-up';

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

const router: RemixRouter = createBrowserRouter([
  {
    path: '/',
    element: <App/>,
    children: [
      { index: true, element: <Home/> },
      { path: 'home', element: <Home/> },
      { path: 'cms', element: <ProtectedRoute Component={CMS} /> },
      { path: 'login', element: <Login /> },
      { path: 'sign-up', element: <SignUp /> },
    ]
  },
  {
    path: '*',
    element: <div>Page not found</div>,
  }
]);

export default router;