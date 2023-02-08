import React, { ReactElement } from 'react';
import { Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, setIsAuthorized } from '../../store';
import { axiosInstance } from '../../services';
import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

import {
  Box, CssBaseline, AppBar, Toolbar, Link, Button
} from '@mui/material';

function App(): ReactElement {
  const dispatch = useDispatch();
  const isAuthorized: boolean = useSelector((state: RootState) => state.common.isAuthorized);
  
  const onLogout = async (): Promise<void> => {
    try {
      const { data, status } = await axiosInstance.post('/logout');
      
      if (status === 200) {
        dispatch(setIsAuthorized(false));
        toast(data?.message || 'Logout!', { type: 'success' });
      }
    } catch (e) {
      console.error(e);
    }
  };
  
  return (
    <div className="app">
      <Box sx={{ display: 'flex' }}>
        <CssBaseline/>
        <AppBar position="relative">
          <Toolbar
            sx={{
              pr: '24px', // keep right padding when drawer closed
            }}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <nav>
              <Link
                href="/home"
                variant="button"
                color="#fff"
                underline="none"
                sx={{ my: 1, mx: 1.5 }}
              >
                Home
              </Link>
              <Link
                href="/cms"
                variant="button"
                color="#fff"
                underline="none"
                sx={{ my: 1, mx: 1.5 }}
              >
                CMS
              </Link>
            </nav>
            {isAuthorized
              ? (
                <Button
                  style={{
                    color: '#fff',
                  }}
                  onClick={onLogout}
                >
                  Logout
                </Button>
              )
              : (
                <Link
                  href="/login"
                  variant="button"
                  color="#fff"
                  underline="none"
                  sx={{ my: 1, mx: 1.5 }}
                >
                  Login
                </Link>
              )
            }
          </Toolbar>
        </AppBar>
      </Box>
      <ToastContainer/>
      <main style={{ marginTop: '24px' }}>
        <Outlet/>
      </main>
    </div>
  );
}

export default App;