import axios, { AxiosInstance, AxiosResponse } from 'axios';

export interface IAxiosRequestArgs {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  url: string;
  data?: unknown;
  headers?: Record<string, string>;
}

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
    const { data: { message, errorName }} = response;
    if (errorName === 'UnauthorizedError') {
      window.location.replace('/login');
    }
    throw error;
  }
);

