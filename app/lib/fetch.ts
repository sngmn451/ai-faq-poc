/**
 * Utility fetcher function for service binding (API only)
 */
interface HttpResponse<T> extends Response {
  parsedBody?: T
}
export const timezoneHeaders = {
  "X-Client-Timezone": Intl.DateTimeFormat().resolvedOptions().timeZone,
}
export const defaultFetchHeaders = {
  "Content-Type": "application/json",
}

export async function http<T>(request: Request): Promise<HttpResponse<T>> {
  const response: HttpResponse<T> = await fetch(request)

  response.parsedBody = (await response.json()) as T
  return response
}

export async function Get<T>(
  path: string,
  { headers }: RequestInit = {
    headers: {},
  },
): Promise<HttpResponse<T>> {
  return await http<T>(
    new Request(path, {
      headers: {
        ...headers,
        ...timezoneHeaders,
      },
    }),
  )
}

export async function Post<T>(path: string, body: object, args: RequestInit = {}): Promise<HttpResponse<T>> {
  return await http<T>(
    new Request(path, {
      ...args,
      method: "post",
      body: JSON.stringify(body),
      headers: {
        ...defaultFetchHeaders,
        ...timezoneHeaders,
        ...args.headers,
      },
    }),
  )
}

export async function Put<T>(
  path: string,
  {
    headers = {},
    body = {},
  }: {
    headers?: object
    body?: object
  },
  args: RequestInit = {},
): Promise<HttpResponse<T>> {
  const httpHeaders = {
    ...headers,
    ...defaultFetchHeaders,
    ...timezoneHeaders,
  }
  return await http<T>(
    new Request(path, {
      ...args,
      method: "put",
      body: JSON.stringify(body),
      headers: httpHeaders,
    }),
  )
}

export async function Delete<T>(
  path: string,
  {
    headers,
    body,
  }: {
    headers: object
    body: object
  },
): Promise<HttpResponse<T>> {
  const httpHeaders = {
    ...headers,
    ...defaultFetchHeaders,
    ...timezoneHeaders,
    method: "DELETE",
  }
  return await http<T>(
    new Request(path, {
      headers: httpHeaders,
      body: JSON.stringify(body),
    }),
  )
}
