export type ResponseCommonDataType = Record<string, unknown>;

export interface IResponseBody<ResponseData = ResponseCommonDataType> {
  [additionalField: string]: unknown;
  data: ResponseData | ResponseCommonDataType;
}