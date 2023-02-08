import { ChangeEvent, ReactElement, SyntheticEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { IUser, RootState, setUserData } from '../../store';
import { axiosInstance } from '../../services';

interface ILoginData {
  username?: string;
  password?: string;
}

export default function Login(): ReactElement {
  const dispatch = useDispatch()
  const navigate = useNavigate();
  
  const isAuthorized: boolean = useSelector((state: RootState) => state.common.isAuthorized);
  
  const [loginData, handleLoginData] = useState<ILoginData>({});
  
  useEffect(() => {
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
  
      console.log('userData: ', userData);
  
      userData && dispatch(setUserData(userData));
    } catch (e) {
      console.log(e);
    }
    
    console.log('login! ');
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