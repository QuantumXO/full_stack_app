import { AppBar, Box, Button, CssBaseline, Link, Toolbar } from '@mui/material';
import React, { ReactElement } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, setIsAuthorized } from '../../../../store';
import { axiosInstance } from '../../../../services';
import { toast } from 'react-toastify';

export default function Header() {
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
            href="/login"
            variant="button"
            color="#fff"
            underline="none"
            sx={{ my: 1, mx: 1.5 }}
          >
            Login
          </Link>
          <Link
            href="/sign-up"
            variant="button"
            color="#fff"
            underline="none"
            sx={{ my: 1, mx: 1.5 }}
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
          {renderAuthButtons()}
        </Toolbar>
      </AppBar>
    </Box>
  )
}