import { ChangeEvent, FormEvent, ReactElement, useEffect, useState } from 'react';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, setUserData } from '../../store';
import { axiosInstance } from '../../services';
import { Dispatch } from '@reduxjs/toolkit';
import { Box, Button, Container, FormControl, TextField, Typography } from '@mui/material';

interface ILoginData {
  username?: string;
  password?: string;
}

export default function Login(): ReactElement {
  const dispatch: Dispatch = useDispatch()
  const navigate: NavigateFunction = useNavigate();
  
  const isAuthorized: boolean = useSelector((state: RootState) => state.common.isAuthorized);
  
  const [formData, handleFormData] = useState<ILoginData>({});
  
  useEffect((): void => {
    if (isAuthorized) {
      navigate('/cms')
      console.log('redirected from /login');
    }
  }, [isAuthorized]);
  
  
  const handleSubmit = async (e: FormEvent<HTMLFormElement | HTMLButtonElement>): Promise<void> => {
    e.preventDefault();
  
    try {
      const res = await axiosInstance.post(
        '/login',
        {
          ...formData
        }
      );
      
      const { user: userData } = res?.data;
  
      userData && dispatch(setUserData(userData));
    } catch (e) {
      console.log(e);
    }
  };
  
  const onFieldChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { id, value } = e.target;
    
    handleFormData(prev => ({
      ...prev,
      [id]: value,
    }));
  };
  
  return (
    <Box className="sign-up" width="100%" padding="0 24px">
      <Typography
        component="h1"
        variant="h3"
        width="100%"
        align="center"
      >
        Login page
      </Typography>
      <Container
        component="main"
        maxWidth="xs"
      >
        <Box
          component="form"
          noValidate
          sx={{ mt: 1 }}
          onSubmit={handleSubmit}
        >
          <TextField
            required
            fullWidth
            name="username"
            id="username"
            margin="normal"
            label="Username"
            inputProps={{
              autoComplete: 'off'
            }}
            value={formData.username || ''}
            onChange={onFieldChange}
          />
          <TextField
            required
            fullWidth
            name="password"
            id="password"
            margin="normal"
            label="Password"
            type="password"
            inputProps={{
              autoComplete: 'new-password',
            }}
            value={formData.password || ''}
            onChange={onFieldChange}
          />
          <FormControl
            margin="normal"
            style={{ display: 'flex', justifyContent: 'flex-end', flexDirection: 'row' }}
          >
            <Button
              sx={{ marginLeft: '24px' }}
              // type="submit"
              variant="contained"
              onClick={handleSubmit}
            >
              Login
            </Button>
          </FormControl>
          <p></p>
        </Box>
      </Container>
    </Box>
  )
}