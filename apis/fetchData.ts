export interface RequestOptions<T, B = undefined> {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  body?: B;
  contentType?: string;
  headers?: HeadersInit;
}

export const fetchData = async <T, B = undefined>({
  method,
  path,
  body,
  token,
  contentType = 'application/json',
  headers = {}
}: RequestOptions<T, B> & { token?: string }): Promise<T> => {
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': contentType,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers
    },
    ...(body !== undefined && { body: JSON.stringify(body) })
  };

  // 상대 경로를 사용하여 Next.js rewrites가 작동하도록 함
  // rewrites가 /api/* 경로를 실제 REST API로 프록시함
  const response = await fetch(path, options);

  if (!response.ok) throw new Error(`Failed to fetch careers`);

  return response.json();
};
