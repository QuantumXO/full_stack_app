import { createBrowserRouter } from 'react-router-dom';
import React, { lazy } from 'react';
import { Router as RemixRouter } from '@remix-run/router/dist/router';
import ProtectedRoute from './components/protectedRoute';
import App from '../app';

const Home = lazy(() => import('@view/home'));
const CMS = lazy(() => import('@view/cms'));
const Login = lazy(() => import('@view/login'));
const SignUp = lazy(() => import('@view/sign-up'));

const router: RemixRouter = createBrowserRouter([
  {
    path: '/',
    element: <App/>,
    errorElement: <div>Something went wrong...</div>,
    children: [
      { index: true, element: <Home /> },
      { path: 'home', element: <Home /> },
      { path: 'cms', element: <ProtectedRoute Component={CMS} /> },
      // { path: 'cms', element: <CMS /> },
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