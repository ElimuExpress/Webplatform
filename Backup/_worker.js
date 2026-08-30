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

      const isDbBound = env && env.ELIMU_DB;
      const DEFAULT_PASSWORD = "Admin@Elimu2026";

      try {
        // Authentication check
        if (path === '/api/auth' && method === 'POST') {
          const body = await request.json();
          const password = body.password;
          let correctPassword = DEFAULT_PASSWORD;
          if (isDbBound) {
            const storedPwd = await env.ELIMU_DB.get('admin_password');
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
            await env.ELIMU_DB.put('admin_password', newPassword);
            return new Response(JSON.stringify({ success: true }), { headers, status: 200 });
          } else {
            return new Response(JSON.stringify({ success: false, error: 'Database not bound' }), { headers, status: 400 });
          }
        }

        // Institutions Endpoint
        if (path === '/api/institutions') {
          if (method === 'GET') {
            let list = null;
            if (isDbBound) {
              const raw = await env.ELIMU_DB.get('institutions_list');
              if (raw) list = JSON.parse(raw);
            }
            return new Response(JSON.stringify({ 
              success: true, 
              dbMode: isDbBound ? 'cloudflare_kv' : 'local_storage',
              data: list
            }), { headers, status: 200 });
          }
          if (method === 'POST') {
            const authHeader = request.headers.get('Authorization') || '';
            if (!authHeader.startsWith('Bearer ')) {
              return new Response(JSON.stringify({ success: false, error: 'Unauthorized' }), { headers, status: 401 });
            }
            const body = await request.json();
            if (isDbBound) {
              await env.ELIMU_DB.put('institutions_list', JSON.stringify(body.data));
              return new Response(JSON.stringify({ success: true }), { headers, status: 200 });
            } else {
              return new Response(JSON.stringify({ success: false, error: 'Database not bound' }), { headers, status: 400 });
            }
          }
        }

        // Pricing Packages Endpoint
        if (path === '/api/pricing') {
          if (method === 'GET') {
            let pricing = null;
            if (isDbBound) {
              const raw = await env.ELIMU_DB.get('pricing_packages');
              if (raw) pricing = JSON.parse(raw);
            }
            return new Response(JSON.stringify({ 
              success: true, 
              dbMode: isDbBound ? 'cloudflare_kv' : 'local_storage',
              data: pricing
            }), { headers, status: 200 });
          }
          if (method === 'POST') {
            const authHeader = request.headers.get('Authorization') || '';
            if (!authHeader.startsWith('Bearer ')) {
              return new Response(JSON.stringify({ success: false, error: 'Unauthorized' }), { headers, status: 401 });
            }
            const body = await request.json();
            if (isDbBound) {
              await env.ELIMU_DB.put('pricing_packages', JSON.stringify(body.data));
              return new Response(JSON.stringify({ success: true }), { headers, status: 200 });
            } else {
              return new Response(JSON.stringify({ success: false, error: 'Database not bound' }), { headers, status: 400 });
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
