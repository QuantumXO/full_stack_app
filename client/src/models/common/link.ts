
type IGetLinkReturn = (...args: any) => string;
export type GetLinkType<ListEnum> = {
  [key in ListEnum as string]: IGetLinkReturn;
}
export enum Links {
  ADMIN = 'admin',
  TODO = 'todo',
}
export type LinksType = {
  [key in Links]: IGetLinkReturn;
}