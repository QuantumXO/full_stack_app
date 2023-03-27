
export default function getJWTPayload(token: string = ''): Record<string, unknown> | undefined {
  if (token.length) {
    const base64Url: string = token.split('.')[1];
    const base64: string = base64Url
      .replace('-', '+')
      .replace('_', '/');
    const jsonPayload: string = decodeURIComponent(window.atob(base64)
      .split('')
      .map((c: string): string => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join(''));
    
    return JSON.parse(jsonPayload);
  }
}