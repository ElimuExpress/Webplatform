export async function onRequest(context) {
  const { request, env } = context;
  const method = request.method;
  const headers = new Headers({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  });

  if (method === 'OPTIONS') return new Response(null, { headers, status: 204 });

  const kv = env && (env.SCHOOLS_KV || env.ELIMU_DB);
  const isDbBound = !!kv;

  try {
    if (method === 'GET') {
      const authHeader = request.headers.get('Authorization') || '';
      if (!authHeader.startsWith('Bearer ')) {
        return new Response(JSON.stringify({ success: false, error: 'Unauthorized' }), { headers, status: 401 });
      }
      let list = [];
      if (isDbBound) {
        const raw = await kv.get('contact_messages_list');
        if (raw) list = JSON.parse(raw);
      }
      return new Response(JSON.stringify({ success: true, data: list }), { headers, status: 200 });
    }

    if (method === 'POST') {
      const authHeader = request.headers.get('Authorization') || '';
      const body = await request.json();
      if (isDbBound) {
        if (authHeader.startsWith('Bearer ')) {
          // Admin bulk overwrite
          await kv.put('contact_messages_list', JSON.stringify(body));
        } else {
          // Public append single message
          let list = [];
          const raw = await kv.get('contact_messages_list');
          if (raw) {
            try {
              list = JSON.parse(raw);
            } catch(e) {}
          }
          list.unshift(body);
          await kv.put('contact_messages_list', JSON.stringify(list));
        }
        return new Response(JSON.stringify({ success: true }), { headers, status: 200 });
      } else {
        return new Response(JSON.stringify({ success: true, warning: 'Saved locally on client' }), { headers, status: 200 });
      }
    }
    return new Response(JSON.stringify({ success: false, error: `Method ${method} not allowed` }), { headers, status: 405 });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.message }), { headers, status: 500 });
  }
}
