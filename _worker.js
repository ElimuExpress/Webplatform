export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    // 1. Intercept and handle serverless API routes
    if (path.startsWith('/api/')) {
      const headers = new Headers({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, DELETE',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      });

      if (method === 'OPTIONS') {
        return new Response(null, { headers, status: 204 });
      }

      // Check all possible KV bindings
      const kv = env && (env.MY_KV_NAMESPACE || env.SCHOOLS_KV || env.ELIMU_DB);
      const isDbBound = !!kv;
      const DEFAULT_PASSWORD = "Admin@Elimu2026";

      try {
        // Authentication verify
        if (path === '/api/auth' && method === 'POST') {
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

        // Change Admin Password
        if (path === '/api/auth-change' && method === 'POST') {
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

        // Site Content API
        if (path === '/api/content') {
          if (method === 'GET') {
            let data = null;
            if (isDbBound) {
              data = await kv.get('site_data');
            }
            return new Response(data || '{}', {
              headers: headers,
              status: 200
            });
          }
          if (method === 'POST') {
            const authHeader = request.headers.get('Authorization') || '';
            if (authHeader && !authHeader.startsWith('Bearer ')) {
              return new Response(JSON.stringify({ success: false, error: 'Unauthorized' }), { headers, status: 401 });
            }
            const body = await request.text();
            if (isDbBound) {
              await kv.put('site_data', body);
              return new Response(JSON.stringify({ success: true }), { headers, status: 200 });
            } else {
              return new Response(JSON.stringify({ success: false, error: 'Database not bound' }), { headers, status: 400 });
            }
          }
        }

        // Contact Messages API
        if (path === '/api/contacts') {
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
        }

        return new Response(JSON.stringify({ success: false, error: `Not found: ${path}` }), { headers, status: 404 });
      } catch (err) {
        return new Response(JSON.stringify({ success: false, error: err.message }), { headers, status: 500 });
      }
    }

    // 2. Otherwise, serve static files directly using the built-in ASSETS binding
    return env.ASSETS.fetch(request);
  }
};
