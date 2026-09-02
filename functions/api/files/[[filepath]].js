// Cloudflare Pages Function: /api/files/* (Streaming files from R2)
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

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function onRequestGet({ request, env, params }) {
  const r2 = getR2(env);
  const isR2Bound = !!r2;

  let key = '';
  if (params && params.filepath) {
    key = Array.isArray(params.filepath) ? params.filepath.join('/') : params.filepath;
  } else {
    const url = new URL(request.url);
    key = decodeURIComponent(url.pathname.replace(/^\/api\/files\//, ''));
  }

  if (isR2Bound && key) {
    try {
      const object = await r2.get(key);
      if (!object) {
        return new Response(JSON.stringify({ success: false, error: 'File not found in R2 storage' }), {
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
          status: 404
        });
      }

      const fileHeaders = new Headers();
      object.writeHttpMetadata(fileHeaders);
      fileHeaders.set('etag', object.httpEtag);
      fileHeaders.set('Access-Control-Allow-Origin', '*');
      fileHeaders.set('Cache-Control', 'public, max-age=31536000, immutable');
      if (!fileHeaders.get('Content-Type')) {
        fileHeaders.set('Content-Type', key.endsWith('.pdf') ? 'application/pdf' : 'application/octet-stream');
      }

      return new Response(object.body, {
        headers: fileHeaders,
        status: 200
      });
    } catch (err) {
      return new Response(JSON.stringify({ success: false, error: err.message }), {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        status: 500
      });
    }
  }

  return new Response(JSON.stringify({ success: false, error: 'R2 storage not bound or invalid file key' }), {
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    status: 404
  });
}
