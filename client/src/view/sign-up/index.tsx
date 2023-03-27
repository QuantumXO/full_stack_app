import { ReactElement, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, setIsAuthorized, setUserData } from '@src/store';
import { getResponseData, httpRequest, IHttpRequestArgs, ResponseType } from '@services/common/axios';
import { useTranslation } from 'react-i18next';
import { Typography, Box, TextField, Container, Button, FormControl } from '@mui/material';
import { useForm, SubmitHandler } from 'react-hook-form';
import { get } from 'lodash';
import isOkResponse from '@services/common/is-ok-response';
import { Dispatch } from '@reduxjs/toolkit';
import link from '@services/link';

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
  const dispatch: Dispatch = useDispatch();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<IFormData>({});
  
  const isAuthorized: boolean = useSelector((state: RootState) => state.common.isAuthorized);
  
  useEffect(() => {
    if (isAuthorized) {
      navigate(link.getUrl.admin());
      console.log('redirected from /sign-up');
    }
  }, [isAuthorized]);
  
  const onSubmit: SubmitHandler<IFormData> = async (formData: IFormData): Promise<void> => {
    try {
  
      const response: ResponseType = await httpRequest<ISignUpArgs>({
        method: 'POST',
        url: '/sign-up',
        data: formData as ISignUpArgs,
      });
  
      if (isOkResponse(response)) {
        const { user } = getResponseData(response);
        dispatch(setUserData(user));
        dispatch(setIsAuthorized(true));
      }
      
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