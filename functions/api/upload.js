// Cloudflare Pages Function: /api/upload
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
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Filename',
    },
  });
}

export async function onRequestPost({ request, env }) {
  const headers = new Headers({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Filename',
  });

  const url = new URL(request.url);
  const r2 = getR2(env);
  const isR2Bound = !!r2;

  try {
    let filename = 'file_' + Date.now();
    let contentType = 'application/octet-stream';
    let fileBuffer = null;
    let folder = 'uploads';

    const cTypeHeader = request.headers.get('content-type') || '';
    if (cTypeHeader.includes('application/json')) {
      const body = await request.json();
      filename = body.filename || ('doc_' + Date.now() + '.pdf');
      contentType = body.contentType || (filename.endsWith('.pdf') ? 'application/pdf' : 'application/octet-stream');
      folder = body.folder || 'applications';
      
      if (body.base64Data) {
        const base64Str = body.base64Data.replace(/^data:[^;]+;base64,/, '');
        const binaryStr = atob(base64Str);
        const len = binaryStr.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryStr.charCodeAt(i);
        }
        fileBuffer = bytes.buffer;
      }
    } else if (cTypeHeader.includes('multipart/form-data')) {
      const formData = await request.formData();
      const file = formData.get('file');
      folder = formData.get('folder') || 'uploads';
      if (file && typeof file.arrayBuffer === 'function') {
        filename = file.name || ('upload_' + Date.now());
        contentType = file.type || 'application/octet-stream';
        fileBuffer = await file.arrayBuffer();
      }
    } else {
      fileBuffer = await request.arrayBuffer();
      filename = request.headers.get('x-filename') || ('file_' + Date.now());
      contentType = cTypeHeader || 'application/octet-stream';
    }

    if (!fileBuffer) {
      return new Response(JSON.stringify({ success: false, error: 'No file buffer provided' }), { headers, status: 400 });
    }

    const cleanName = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
    const datePrefix = new Date().toISOString().slice(0, 10).replace(/-/g, '/');
    const key = folder + '/' + datePrefix + '/' + Date.now() + '_' + cleanName;

    if (isR2Bound) {
      await r2.put(key, fileBuffer, {
        httpMetadata: {
          contentType: contentType
        },
        customMetadata: {
          uploadedAt: new Date().toISOString()
        }
      });

      const origin = url.origin;
      const fileUrl = origin + '/api/files/' + key;

      return new Response(JSON.stringify({
        success: true,
        r2Bound: true,
        key: key,
        filename: cleanName,
        contentType: contentType,
        size: fileBuffer.byteLength,
        fileUrl: fileUrl,
        directDownloadUrl: fileUrl
      }), { headers, status: 200 });
    } else {
      return new Response(JSON.stringify({
        success: true,
        r2Bound: false,
        warning: 'R2 Bucket not bound yet. In Cloudflare Pages Settings -> Functions -> R2 bucket bindings, bind your bucket as R2_BUCKET.',
        filename: cleanName,
        size: fileBuffer.byteLength
      }), { headers, status: 200 });
    }
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.message }), { headers, status: 500 });
  }
}
