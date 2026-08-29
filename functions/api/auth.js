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
        return new Response(JSON.stringify({ success: true, token }), { headers, status: 200 });
      } else {
        return new Response(JSON.stringify({ success: false, error: 'Incorrect Password' }), { headers, status: 401 });
      }
    }
    return new Response(JSON.stringify({ success: false, error: `Method ${method} not allowed` }), { headers, status: 405 });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.message }), { headers, status: 500 });
  }
}
