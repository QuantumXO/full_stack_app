import { AppBar, Box, Button, CssBaseline, Link, Toolbar } from '@mui/material';
import React, { ReactElement } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, setIsAuthorized } from '@src/store';
import { axiosInstance } from '@services/axios';
import { Dispatch } from '@reduxjs/toolkit';
import { Link as RouterLink } from 'react-router-dom';
import Notifications from './components/notifications';

export function Header(): ReactElement {
  const dispatch: Dispatch = useDispatch();
  const isAuthorized: boolean = useSelector((state: RootState) => state.common.isAuthorized);
  
  const onLogout = async (): Promise<void> => {
    try {
      const { status } = await axiosInstance.post('/logout');
      if (status === 200) {
        dispatch(setIsAuthorized(false));
      }
    } catch (e) {
      console.error(e);
    }
  };
  
  const renderAuthButtons = (): ReactElement => {
    let layout: ReactElement;
    
    if (isAuthorized) {
      layout = (
        <>
          <Button
            style={{
              color: '#fff',
            }}
            onClick={onLogout}
          >
            Logout
          </Button>
        </>
      );
    } else {
      layout = (
        <div>
          <Link
            to="/login"
            variant="button"
            color="#fff"
            underline="none"
            sx={{ my: 1, mx: 1.5 }}
            component={RouterLink}
          >
            Login
          </Link>
          <Link
            to="/sign-up"
            variant="button"
            color="#fff"
            underline="none"
            sx={{ my: 1, mx: 1.5 }}
            component={RouterLink}
          >
            Sign up
          </Link>
        </div>
      );
    }
    
    return layout;
  };
  
  return (
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
            justifyContent: 'flex-end',
          }}
        >
          <Notifications />
          <nav>
            <Link
              to="/home"
              variant="button"
              color="#fff"
              underline="none"
              sx={{ my: 1, mx: 1.5 }}
              component={RouterLink}
            >
              Home
            </Link>
            <Link
              to="/cms"
              variant="button"
              color="#fff"
              underline="none"
              sx={{ my: 1, mx: 1.5 }}
              component={RouterLink}
            >
              CMS
            </Link>
          </nav>
          {renderAuthButtons()}
        </Toolbar>
      </AppBar>
    </Box>
  )
}