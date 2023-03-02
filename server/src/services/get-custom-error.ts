export default function (name: string, msg: string, isThrow?: boolean): Error {
  const e: Error = new Error(msg);
  if (name) {
    e.name = name;
  }
  
  if (isThrow) {
    throw e;
  } else {
    return e;
  }
}