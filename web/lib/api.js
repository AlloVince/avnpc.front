export class ApiError extends Error {
  constructor(status) {
    super('内容服务暂时不可用，请稍后重试。');
    this.name = 'ApiError';
    this.status = status;
  }
}

// Imported only by server pages. Never serialize backend configuration or errors.
export async function requestApi(pathname, query = {}, fetcher = fetch) {
  const url = new URL(pathname, process.env.BACKEND_URL || 'http://127.0.0.1:18347');
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== null && value !== '') url.searchParams.set(key, value);
  }
  let response;
  try {
    response = await fetcher(url, { cache: 'no-store', signal: AbortSignal.timeout(10000) });
  } catch {
    throw new ApiError(503);
  }
  if (!response.ok) throw new ApiError(response.status);
  let data;
  try {
    data = await response.json();
  } catch {
    throw new ApiError(502);
  }
  // Legacy upstream caches can return an error envelope with HTTP 200.
  const statusCode = Number(data?.statusCode);
  if (Number.isInteger(statusCode) && statusCode >= 400 && statusCode <= 599) {
    throw new ApiError(statusCode);
  }
  return data;
}

export async function getPost(slug) {
  return requestApi(`/v1/blog/posts/${encodeURIComponent(slug)}`);
}

export function dateLabel(seconds) {
  return new Intl.DateTimeFormat('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Asia/Shanghai' })
    .format(new Date(Number(seconds) * 1000));
}
