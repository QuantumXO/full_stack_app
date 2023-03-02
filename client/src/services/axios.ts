import axios, { AxiosInstance, AxiosResponse, AxiosError, AxiosRequestConfig } from 'axios';
import isOkResponse from './is-ok-response';
import { get } from 'lodash';

type HttpMethodType = | 'GET' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS'; // 'PATCH'
export interface IHttpRequestArgs {
  url: string,
  method: HttpMethodType,
  data?: Record<string, unknown> | null,
  customInit?: Record<string, string>,
  isPublic?: boolean,
}
export interface IHttpRequestError {
  error: Error | AxiosError;
}
export type ResponseType = AxiosResponse | IHttpRequestError;

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

export const httpRequest = async (args: IHttpRequestArgs): Promise<ResponseType> => {
  const { url, method, data = null, customInit = {}, isPublic = false } = args;
  let urlWithParams: string = url;
  let init: AxiosRequestConfig = {};
  let request: Promise<AxiosResponse> | undefined;
  
  if (!isPublic) {
    init.headers = {};
  }
  
  init = { ...init, ...customInit };
  
  switch (method) {
    case 'GET':
      request = axiosInstance.get(urlWithParams, init);
      break;
    case 'POST':
      request = axiosInstance.post(urlWithParams, data, init);
      break;
    case 'PUT':
      request = axiosInstance.put(urlWithParams, data, init);
      break;
    case 'DELETE':
      request = axiosInstance.delete(urlWithParams, init);
      break;
  }
  
  if (!request) {
    throw new Error('Request method error!');
  } else {
    return request
      .then((response: AxiosResponse): AxiosResponse => response)
      .catch((error: Error | AxiosError) => ({ error }));
  }
};

export const getResponseData = (res: ResponseType): Record<string, unknown> => get(res, 'data.data', {});