// Helper to dynamically resolve any KV namespace bound in Cloudflare
function getKv(e) {
  if (!e) return null;
  if (e.MY_KV_NAMESPACE && typeof e.MY_KV_NAMESPACE.get === 'function') return e.MY_KV_NAMESPACE;
  if (e.SCHOOLS_KV && typeof e.SCHOOLS_KV.get === 'function') return e.SCHOOLS_KV;
  if (e.ELIMU_DB && typeof e.ELIMU_DB.get === 'function') return e.ELIMU_DB;
  if (e.ELIMU_KV && typeof e.ELIMU_KV.get === 'function') return e.ELIMU_KV;
  if (e.ELIMU_DATA && typeof e.ELIMU_DATA.get === 'function') return e.ELIMU_DATA;
  if (e.KV_NAMESPACE && typeof e.KV_NAMESPACE.get === 'function') return e.KV_NAMESPACE;
  if (e.DB && typeof e.DB.get === 'function') return e.DB;
  if (e.KV && typeof e.KV.get === 'function') return e.KV;
  for (const key of Object.keys(e)) {
    if (e[key] && typeof e[key].get === 'function' && typeof e[key].put === 'function') {
      return e[key];
    }
  }
  return null;
}

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

  const kv = getKv(env);
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
