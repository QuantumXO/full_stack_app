import axios, { AxiosInstance, AxiosResponse } from 'axios';

const { REACT_APP_BASE_URL } = process.env;

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: REACT_APP_BASE_URL,
  withCredentials: true,
  validateStatus: function (status: number): boolean {
    return status >= 200 && status < 400
  },
});

const tokenErrors: string[] = ['UnauthorizedError', 'TokenExpiredError'];

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: any) => {
    const { response = {} } = error;
    const { data: { errorName }} = response;
    if (tokenErrors.includes(errorName)) {
      console.log(`${errorName} redirect to /login`);
      window.location.replace('/login');
    }
    throw error;
  }
);