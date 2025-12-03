const API_BASE_URL = process.env.NEXT_PUBLIC_REST_API_ENDPOINT;

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

  const response = await fetch(`${API_BASE_URL}${path}`, options);

  if (!response.ok) throw new Error(`Failed to fetch careers`);

  return response.json();
};
