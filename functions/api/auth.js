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
  const DEFAULT_PASSWORD = "Admin@Elimu2026";

  try {
    if (method === 'POST') {
      const body = await request.json();
      const password = body.password;
      let correctPassword = DEFAULT_PASSWORD;
      if (isDbBound) {
        const storedPwd = await kv.get('admin_password');
        if (storedPwd) correctPassword = storedPwd;
      }
      if (password === correctPassword) {
        const token = btoa(JSON.stringify({ user: 'admin', exp: Date.now() + 24 * 60 * 60 * 1000 }));
        return new Response(JSON.stringify({ success: true, token, isDbBound }), { headers, status: 200 });
      } else {
        return new Response(JSON.stringify({ success: false, error: 'Incorrect Password' }), { headers, status: 401 });
      }
    }
    return new Response(JSON.stringify({ success: false, error: `Method ${method} not allowed` }), { headers, status: 405 });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.message }), { headers, status: 500 });
  }
}
