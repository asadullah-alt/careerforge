export function getCfAuthCookie(): string | null {
  if (typeof document === 'undefined') return null;
  
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'cf_auth') {
      return decodeURIComponent(value);
    }
  }
  return null;
}