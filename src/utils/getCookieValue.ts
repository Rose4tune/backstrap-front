export default function getCookieValue(key: string): string | null {
  const cookies = document.cookie.split('; ');
  const target = cookies.find(row => row.startsWith(`${key}=`));
  return target ? decodeURIComponent(target.split('=')[1]) : null;
}
