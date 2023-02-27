import { ReactElement, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { axiosInstance } from '../../services/axios';
import { AxiosResponse } from 'axios';
import { useTranslation } from 'react-i18next';
import { Typography, Box, TextField, Container, Button, FormControl } from '@mui/material';
import { useForm, SubmitHandler } from 'react-hook-form';

interface IFormData {
  username?: string;
  password?: string;
  location?: string;
}

interface ISignUpArgs {
  username: string;
  password: string;
  location?: string;
}

export default function SignUp(): ReactElement {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, reset } = useForm<IFormData>();
  
  const isAuthorized: boolean = useSelector((state: RootState) => state.common.isAuthorized);
  
  useEffect(() => {
    if (isAuthorized) {
      navigate('/cms');
      console.log('redirected from /sign-up');
    }
  }, [isAuthorized]);
  
  const onSubmit: SubmitHandler<IFormData> = async (formData: IFormData): Promise<void> => {
    try {
      const res: AxiosResponse = await axiosInstance.post(
        '/sign-up',
        formData as ISignUpArgs
      );
  
      console.log('res: ', res);
    } catch (e) {
      console.log(e);
    }
  };
  
  const onClearForm = (): void => reset();
  
  return (
    <Box className="sign-up" width="100%" padding="0 24px">
      <Typography
        component="h1"
        variant="h3"
        width="100%"
        align="center"
      >
        {t('SignUp page')}
      </Typography>
      <Container
        component="main"
        maxWidth="xs"
      >
        <Box
          component="form"
          noValidate
          sx={{ mt: 1 }}
          onSubmit={handleSubmit(onSubmit)}
        >
          <TextField
            required
            fullWidth
            id="username"
            margin="normal"
            label="Username"
            inputProps={{
              autoComplete: 'off'
            }}
            error={!!errors.username}
            // value={formData.username || ''}
            {...register('username', { required: true })}
          />
          <TextField
            fullWidth
            id="location"
            margin="normal"
            label="Location"
            type="text"
            // value={formData.location || ''}
            {...register('location')}
          />
          <TextField
            required
            fullWidth
            id="password"
            margin="normal"
            label="Password"
            type="password"
            error={!!errors.password}
            inputProps={{
              autoComplete: 'new-password',
            }}
            // helperText={'This field is required'}
            // value={formData.password || ''}
            {...register('password', { required: true })}
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
              type="submit"
              variant="contained"
            >
              SignUp
            </Button>
          </FormControl>
          <p></p>
        </Box>
      </Container>
    </Box>
  );
}