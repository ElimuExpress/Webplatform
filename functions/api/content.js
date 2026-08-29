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

  const kv = env && (env.MY_KV_NAMESPACE || env.SCHOOLS_KV || env.ELIMU_DB);
  const isDbBound = !!kv;

  try {
    if (method === "GET") {
      let data = null;
      if (isDbBound) {
        data = await kv.get("site_data");
      }
      return new Response(data || "{}", {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
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
        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      } else {
        return new Response(JSON.stringify({ success: false, error: 'Database not bound (MY_KV_NAMESPACE, SCHOOLS_KV, or ELIMU_DB)' }), {
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
