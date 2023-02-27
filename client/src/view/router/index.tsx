import { createBrowserRouter } from 'react-router-dom';
import React, { lazy } from 'react';
import App from '../app';
import { Router as RemixRouter } from '@remix-run/router/dist/router';
import ProtectedRoute from './components/protectedRoute';

const Home = lazy(() => import('../home'));
const CMS = lazy(() => import('../cms'));
const Login = lazy(() => import('../login'));
const SignUp = lazy(() => import('../sign-up'));

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