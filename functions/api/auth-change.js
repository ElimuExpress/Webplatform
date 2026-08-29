export async function onRequest(context) {
  const { request, env } = context;
  const method = request.method;
  const headers = new Headers({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  });

  if (method === 'OPTIONS') return new Response(null, { headers, status: 204 });

  const kv = env && (env.SCHOOLS_KV || env.ELIMU_DB);
  const isDbBound = !!kv;

  try {
    if (method === 'POST') {
      const authHeader = request.headers.get('Authorization') || '';
      if (!authHeader.startsWith('Bearer ')) {
        return new Response(JSON.stringify({ success: false, error: 'Unauthorized' }), { headers, status: 401 });
      }
      const body = await request.json();
      const newPassword = body.newPassword;
      if (!newPassword || newPassword.length < 4) {
        return new Response(JSON.stringify({ success: false, error: 'Password too short' }), { headers, status: 400 });
      }
      if (isDbBound) {
        await kv.put('admin_password', newPassword);
        return new Response(JSON.stringify({ success: true }), { headers, status: 200 });
      } else {
        return new Response(JSON.stringify({ success: false, error: 'Database not bound' }), { headers, status: 400 });
      }
    }
    return new Response(JSON.stringify({ success: false, error: `Method ${method} not allowed` }), { headers, status: 405 });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.message }), { headers, status: 500 });
  }
}
