import { IResponseBody, ResponseCommonDataType } from '@interfaces/common/api';

type FieldsListType = [string, unknown];

/*{
  data: {
    list: [],
  },
  someTechInfo: 'message',
}*/

export function getNormalizedResponseBody(
  data: ResponseCommonDataType = {},
  optionalBodyInfo?: ResponseCommonDataType
): IResponseBody {
  const fieldsArr: FieldsListType[] = Object.entries(data);
  
  const body: IResponseBody = {
    ...optionalBodyInfo,
    data: { },
  };
  
  if (fieldsArr.length) {
    fieldsArr.forEach(([key, value]: FieldsListType): void => {
      body.data[key] = value;
    });
  }

  return body;
}