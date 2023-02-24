export default function (name: string, msg: string): Error {
  const e: Error = new Error(msg);
  if (name) {
    e.name = name;
  }
  return e;
}