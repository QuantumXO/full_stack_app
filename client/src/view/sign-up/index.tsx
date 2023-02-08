import { ChangeEvent, ReactElement, SyntheticEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, setUserData } from '../../store';
import { axiosInstance } from '../../services';

interface ILoginData {
  username?: string;
  password?: string;
}

export default function SignUp(): ReactElement {
  const dispatch = useDispatch()
  const navigate = useNavigate();
  
  const isAuthorized: boolean = useSelector((state: RootState) => state.common.isAuthorized);
  
  const [formData, handleFormData] = useState<ILoginData>({});
  
  useEffect(() => {
    if (isAuthorized) {
      navigate('/cms')
      console.log('redirected from /sign-up');
    }
  }, [isAuthorized]);
  
  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
  
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
  
  return (
    <div className="login">
      SignUp page
      <br/>
      <br/>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            id="username"
            placeholder="username"
            value={formData.username || ''}
            onChange={onFieldChange}
          />
        </div>
        <div>
        
        </div>
        <div>
          <input
            type="password"
            id="password"
            placeholder="password"
            value={formData.password || ''}
            onChange={onFieldChange}
          />
        </div>
        <button type="submit">{'SignUp'}</button>
        <p></p>
      </form>
    </div>
  )
}