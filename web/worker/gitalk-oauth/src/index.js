const endpoint = '/oauth/access_token';

function corsHeaders(origin) {
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Accept',
    'Access-Control-Max-Age': '86400',
    'Cache-Control': 'no-store',
    Vary: 'Origin',
  };
}

function jsonResponse(payload, status, origin) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders(origin), 'Content-Type': 'application/json; charset=utf-8' },
  });
}

const worker = {
  async fetch(request, env) {
    const origin = request.headers.get('Origin');
    if (!env.ALLOWED_ORIGIN || origin !== env.ALLOWED_ORIGIN) {
      return new Response('Forbidden', { status: 403, headers: { 'Cache-Control': 'no-store' } });
    }

    const url = new URL(request.url);
    if (url.pathname !== endpoint) return new Response('Not found', { status: 404 });
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }
    if (request.method !== 'POST') {
      return jsonResponse({ error: 'method_not_allowed' }, 405, origin);
    }
    if (!env.GITHUB_CLIENT_ID || !env.GITHUB_CLIENT_SECRET) {
      return jsonResponse({ error: 'oauth_proxy_not_configured' }, 503, origin);
    }

    let input;
    try {
      input = await request.json();
    } catch {
      return jsonResponse({ error: 'invalid_request' }, 400, origin);
    }
    if (input.client_id !== env.GITHUB_CLIENT_ID || typeof input.code !== 'string' || input.code.length > 256) {
      return jsonResponse({ error: 'invalid_request' }, 400, origin);
    }

    let upstream;
    try {
      upstream = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: env.GITHUB_CLIENT_ID,
          client_secret: env.GITHUB_CLIENT_SECRET,
          code: input.code,
        }),
      });
    } catch {
      return jsonResponse({ error: 'oauth_exchange_unavailable' }, 502, origin);
    }

    let result;
    try {
      result = await upstream.json();
    } catch {
      return jsonResponse({ error: 'invalid_oauth_response' }, 502, origin);
    }
    return jsonResponse(result, upstream.status, origin);
  },
};

export default worker;
