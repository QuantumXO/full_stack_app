import { ChangeEvent, FormEvent, ReactElement, SyntheticEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, setUserData } from '../../store';
import { axiosInstance } from '../../services';
import { Typography, Box, TextField, Container, Button, FormControl } from '@mui/material';

interface IFormData {
  username?: string;
  password?: string;
  location?: string;
}

export default function SignUp(): ReactElement {
  const dispatch = useDispatch()
  const navigate = useNavigate();
  
  const isAuthorized: boolean = useSelector((state: RootState) => state.common.isAuthorized);
  
  const [formData, handleFormData] = useState<IFormData>({});
  
  useEffect(() => {
    if (isAuthorized) {
      navigate('/cms')
      console.log('redirected from /sign-up');
    }
  }, [isAuthorized]);
  
  const handleSubmit = async (e: FormEvent<HTMLFormElement | HTMLButtonElement>): Promise<void> => {
    e.preventDefault();
  
    console.log('e: ', e);
  
    try {
      const res = await axiosInstance.post(
        '/sign-up',
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
  
  const onClearForm = (): void => handleFormData({});
  
  return (
    <Box className="sign-up" width="100%" padding="0 24px">
      <Typography
        component="h1"
        variant="h3"
        width="100%"
        align="center"
      >
        SignUp page
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
            value={formData.username || ''}
            onChange={onFieldChange}
          />
          <TextField
            required
            fullWidth
            name="location"
            id="location"
            margin="normal"
            label="Location"
            type="text"
            value={formData.location || ''}
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
            value={formData.password || ''}
            onChange={onFieldChange}
          />
          <FormControl
            margin="normal"
            style={{ display: 'flex', justifyContent: 'flex-end', flexDirection: 'row' }}
          >
            <Button
              color="inherit"
              type="button"
              variant="outlined"
              onClick={onClearForm}
            >
              Clear
            </Button>
            <Button
              sx={{ marginLeft: '24px' }}
              // type="submit"
              variant="contained"
              onClick={handleSubmit}
            >
              SignUp
            </Button>
          </FormControl>
          <p></p>
        </Box>
      </Container>
    </Box>
  )
}