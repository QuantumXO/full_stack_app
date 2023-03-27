import { ResponseType } from './axios';
import { get } from 'lodash';

export default function isOkResponse(response: ResponseType): boolean {
  let isOK = false;
  const status: number | undefined = get(response, 'status');
  if (status) {
    isOK = status >= 200 && status < 300;
  }
  return isOK;
};