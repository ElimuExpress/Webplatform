// Cloudflare Pages Function: Universal Catch-All API Router
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

function getR2(e) {
  if (!e) return null;
  if (e.R2_BUCKET && typeof e.R2_BUCKET.put === 'function') return e.R2_BUCKET;
  if (e.MY_BUCKET && typeof e.MY_BUCKET.put === 'function') return e.MY_BUCKET;
  if (e.ELIMU_BUCKET && typeof e.ELIMU_BUCKET.put === 'function') return e.ELIMU_BUCKET;
  if (e.BUCKET && typeof e.BUCKET.put === 'function') return e.BUCKET;
  if (e.MEDIA_BUCKET && typeof e.MEDIA_BUCKET.put === 'function') return e.MEDIA_BUCKET;
  if (e.DOCS_BUCKET && typeof e.DOCS_BUCKET.put === 'function') return e.DOCS_BUCKET;
  if (e.UPLOADS_BUCKET && typeof e.UPLOADS_BUCKET.put === 'function') return e.UPLOADS_BUCKET;
  if (e.FILES_BUCKET && typeof e.FILES_BUCKET.put === 'function') return e.FILES_BUCKET;
  for (const key of Object.keys(e)) {
    if (e[key] && typeof e[key].put === 'function' && typeof e[key].get === 'function') {
      return e[key];
    }
  }
  return null;
}

export async function onRequest({ request, env, params }) {
  const url = new URL(request.url);
  const path = url.pathname;
  const method = request.method;

  const headers = new Headers({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, DELETE',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Filename',
  });

  if (method === 'OPTIONS') {
    return new Response(null, { headers, status: 204 });
  }

  const kv = getKv(env);
  const r2 = getR2(env);
  const isDbBound = !!kv;
  const isR2Bound = !!r2;

  // R2 File Streaming fallback
  if (path.startsWith('/api/files/')) {
    const key = decodeURIComponent(path.replace(/^\/api\/files\//, ''));
    if (isR2Bound && key) {
      const object = await r2.get(key);
      if (!object) {
        return new Response(JSON.stringify({ success: false, error: 'File not found in R2 storage' }), { headers, status: 404 });
      }
      const fileHeaders = new Headers();
      object.writeHttpMetadata(fileHeaders);
      fileHeaders.set('etag', object.httpEtag);
      fileHeaders.set('Access-Control-Allow-Origin', '*');
      fileHeaders.set('Cache-Control', 'public, max-age=31536000, immutable');
      if (!fileHeaders.get('Content-Type')) {
        fileHeaders.set('Content-Type', key.endsWith('.pdf') ? 'application/pdf' : 'application/octet-stream');
      }
      return new Response(object.body, { headers: fileHeaders, status: 200 });
    }
    return new Response(JSON.stringify({ success: false, error: 'R2 storage not bound' }), { headers, status: 404 });
  }

  return new Response(JSON.stringify({
    success: true,
    route: path,
    isDbBound: isDbBound,
    isR2Bound: isR2Bound,
    timestamp: new Date().toISOString()
  }), { headers, status: 200 });
}
