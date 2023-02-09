import { ChangeEvent, ReactElement, SyntheticEvent, useEffect, useState } from 'react';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, setUserData } from '../../store';
import { axiosInstance } from '../../services';
import { AnyAction, Dispatch } from '@reduxjs/toolkit';

interface ILoginData {
  username?: string;
  password?: string;
}

export default function Login(): ReactElement {
  const dispatch: Dispatch<AnyAction> = useDispatch()
  const navigate: NavigateFunction = useNavigate();
  
  const isAuthorized: boolean = useSelector((state: RootState) => state.common.isAuthorized);
  
  const [loginData, handleLoginData] = useState<ILoginData>({});
  
  useEffect((): void => {
    if (isAuthorized) {
      navigate('/cms')
      console.log('redirected from /login');
    }
  }, [isAuthorized]);
  
  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
  
    try {
      const res = await axiosInstance.post(
        '/login',
        {
          ...loginData
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
    
    handleLoginData(prev => ({
      ...prev,
      [id]: value,
    }));
  };
  
  return (
    <div className="login">
      Login page
      <br/>
      <br/>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            id="username"
            placeholder="username"
            value={loginData.username || ''}
            onChange={onFieldChange}
          />
        </div>
        <div>
          <input
            type="password"
            id="password"
            placeholder="password"
            value={loginData.password || ''}
            onChange={onFieldChange}
          />
        </div>
        <button type="submit">{'Login'}</button>
        <p></p>
      </form>
    </div>
  )
}