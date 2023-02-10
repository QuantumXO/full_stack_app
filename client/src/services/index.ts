import axios, { AxiosInstance, AxiosResponse } from 'axios';

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: 'http://localhost:3001',
  withCredentials: true,
  validateStatus: function (status: number): boolean {
    return status >= 200 && status < 400
  },
});

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: any) => {
    const { response = {} } = error;
    const { data: { errorName }} = response;
    if (errorName === 'UnauthorizedError') {
      console.log('UnauthorizedError redirect to /login');
      window.location.replace('/login');
    }
    throw error;
  }
);

