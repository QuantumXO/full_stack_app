import { createBrowserRouter } from 'react-router-dom';
import React, { lazy } from 'react';
import { Router as RemixRouter } from '@remix-run/router/dist/router';
import ProtectedRoute from './components/protectedRoute';
import App from '../app';
import link from '@services/link';

const Home = lazy(() => import('@view/home'));
const Admin = lazy(() => import('@view/admin'));
const Login = lazy(() => import('@view/login'));
const SignUp = lazy(() => import('@view/sign-up'));
const Todo = lazy(() => import('@view/todo'));

const router: RemixRouter = createBrowserRouter([
  {
    path: '/',
    element: <App/>,
    errorElement: <div>Something went wrong...</div>,
    children: [
      { index: true, element: <Home /> },
      { path: 'home', element: <Home /> },
      { path: link.getUrl.admin(), element: <ProtectedRoute Component={Admin} /> },
      // { path: 'cms', element: <CMS /> },
      { path: 'login', element: <Login /> },
      { path: 'sign-up', element: <SignUp /> },
      { path: 'todo', element: <Todo /> },
    ]
  },
  {
    path: '*',
    element: <div>Page not found</div>,
  }
]);

export default router;