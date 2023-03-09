import { ReactElement, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@src/store';
import { axiosInstance } from '@services/axios';
import { AxiosResponse } from 'axios';
import { useTranslation } from 'react-i18next';
import { Typography, Box, TextField, Container, Button, FormControl } from '@mui/material';
import { useForm, SubmitHandler, Validate } from 'react-hook-form';
import { get } from 'lodash';

interface IFormData {
  email?: string;
  username?: string;
  password?: string;
  repeatPassword?: string;
}

interface ISignUpArgs {
  username: string;
  email: string;
  password: string;
  repeatPassword: string;
}

export default function SignUp(): ReactElement {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<IFormData>({});
  
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
  
  const repeatPasswordValidate = (value: string | undefined): string | boolean => {
    return watch('password') !== value ? 'Your passwords do no match' : true;
  };
  
  function renderFieldError(field: string): ReactElement {
    return (
      <Typography
        style={{
          display: 'block',
          minHeight: 21,
          marginTop: 0,
          marginBottom: 12,
          color: '#e74c3c',
          fontSize: 14,
      }}
      >
        {get(errors, `${field}.message`)}
      </Typography>
    );
  }
  
  function renderForm(): ReactElement {
    const {
      email: emailError, repeatPassword: repeatPasswordError, password: passwordError, username: usernameError
    } = errors;
    return (
      <Box
        component="form"
        noValidate
        sx={{ mt: 4 }}
        onSubmit={handleSubmit(onSubmit)}
      >
        <TextField
          required
          fullWidth
          id="username"
          margin="none"
          label="Username"
          inputProps={{
            autoComplete: 'off'
          }}
          error={!!usernameError}
          {...register(
            'username',
            {
              required: {
                value: true,
                message: 'Please enter username!'
              },
              pattern: {
                value: /^[a-zA-Z]{3,15}$/gs,
                message: 'Username must be at least 3 and maximum 15 characters and contain only letters of the ' +
                  'Latin alphabet',
              }
            }
          )}
        />
        {renderFieldError('username')}
        <TextField
          fullWidth
          id="email"
          type="email"
          label="Email"
          margin="none"
          error={!!emailError}
          {...register(
            'email',
            {
              required: {
                value: true,
                message: 'Please enter email!'
              },
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: 'Entered value does not match email format'
              }
            }
          )}
        />
        {renderFieldError('email')}
        <TextField
          required
          fullWidth
          id="password"
          margin="none"
          type="password"
          label="Password"
          error={!!passwordError}
          inputProps={{
            autoComplete: 'new-password',
          }}
          {...register(
            'password',
            {
              required: {
                value: true,
                message: 'Please enter password!'
              },
              pattern: {
                value: /^[^`<>{}\[\]()"']{4,10}$/sg,
                message: 'Password must include 4 - 10 symbols and should not contain symbols: ` < > { } [ ] ( ) ".'
              }
            }
          )}
        />
        {renderFieldError('password')}
        <TextField
          required
          fullWidth
          type="password"
          margin="none"
          id="repeatPassword"
          label="Repeat password"
          error={!!repeatPasswordError}
          inputProps={{
            autoComplete: 'off'
          }}
          {...register(
            'repeatPassword',
            {
              required: {
                value: true,
                message: 'Please repeat password!'
              },
              validate: repeatPasswordValidate,
            }
          )}
        />
        {renderFieldError('repeatPassword')}
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
      </Box>
    );
  }
  
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
        {renderForm()}
      </Container>
    </Box>
  );
}