import { IResponseBody, ResponseCommonDataType } from '@interfaces/common/api';

type FieldsListType = [string, unknown];

/*{
  data: {
    list: [],
  },
  error: 'Some error message',
  someTechInfo: 'message',
}*/

export function normalizeResponseBody(
  data: ResponseCommonDataType,
  optionalBodyInfo?: ResponseCommonDataType
): IResponseBody {
  const body: IResponseBody = {
    ...optionalBodyInfo,
  };
  
  if (data) {
    const fieldsArr: FieldsListType[] = Object.entries(data);
    body.data = {};
    
    if (fieldsArr.length) {
      fieldsArr.forEach(([key, value]: FieldsListType): void => {
        body.data[key] = value;
      });
    }
  }

  return body;
}

export function responseBodyWithError(error: string, data?: ResponseCommonDataType): IResponseBody {
  return normalizeResponseBody(data, { error });
}