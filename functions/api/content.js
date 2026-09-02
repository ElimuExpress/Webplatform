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

  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

  if (method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }

  const kv = getKv(env);
  const isDbBound = !!kv;

  try {
    if (method === "GET") {
      if (isDbBound) {
        const raw = await kv.get("site_data");
        let dataObj = {};
        if (raw) {
          try { dataObj = JSON.parse(raw); } catch (e) {}
        }
        dataObj.dbMode = 'cloudflare_kv';
        dataObj.isDbBound = true;
        return new Response(JSON.stringify(dataObj), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200
        });
      } else {
        return new Response(JSON.stringify({
          dbMode: 'local_storage',
          isDbBound: false,
          warning: 'No KV Database namespace bound yet in Cloudflare.'
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200
        });
      }
    }

    if (method === "POST") {
      const authHeader = request.headers.get('Authorization') || '';
      if (authHeader && !authHeader.startsWith('Bearer ')) {
        return new Response(JSON.stringify({ success: false, error: 'Unauthorized' }), { 
          headers: { ...corsHeaders, "Content-Type": "application/json" }, 
          status: 401 
        });
      }

      const body = await request.text();
      if (isDbBound) {
        await kv.put("site_data", body);
        return new Response(JSON.stringify({ success: true, dbMode: 'cloudflare_kv' }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200
        });
      } else {
        return new Response(JSON.stringify({ 
          success: false, 
          dbMode: 'local_storage',
          error: 'Database not bound. In Cloudflare Pages Settings -> Functions -> KV namespace bindings, bind your KV namespace.' 
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400
        });
      }
    }

    return new Response("Method not allowed", { headers: corsHeaders, status: 405 });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500
    });
  }
}
