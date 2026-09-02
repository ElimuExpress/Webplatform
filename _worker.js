export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

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

    // Helper to dynamically resolve any R2 Bucket bound in Cloudflare
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

      const kv = getKv(env);
      const r2 = getR2(env);
      const isDbBound = !!kv;
      const isR2Bound = !!r2;
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
            return new Response(JSON.stringify({ success: true, token, isDbBound, isR2Bound }), { headers, status: 200 });
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

        // Site Content API (Global state for schools, pricing, public contents, custom blocks, chatbot settings & knowledge)
        if (path === '/api/content') {
          if (method === 'GET') {
            if (isDbBound) {
              const raw = await kv.get('site_data');
              let dataObj = {};
              if (raw) {
                try { dataObj = JSON.parse(raw); } catch (e) {}
              }
              dataObj.dbMode = 'cloudflare_kv';
              dataObj.isDbBound = true;
              dataObj.isR2Bound = isR2Bound;
              return new Response(JSON.stringify(dataObj), {
                headers: headers,
                status: 200
              });
            } else {
              return new Response(JSON.stringify({
                dbMode: 'local_storage',
                isDbBound: false,
                isR2Bound: isR2Bound,
                warning: 'No KV Database namespace bound yet in Cloudflare.'
              }), {
                headers: headers,
                status: 200
              });
            }
          }
          if (method === 'POST') {
            const authHeader = request.headers.get('Authorization') || '';
            if (authHeader && !authHeader.startsWith('Bearer ')) {
              return new Response(JSON.stringify({ success: false, error: 'Unauthorized' }), { headers, status: 401 });
            }
            const body = await request.text();
            if (isDbBound) {
              await kv.put('site_data', body);
              return new Response(JSON.stringify({ success: true, dbMode: 'cloudflare_kv', isR2Bound }), { headers, status: 200 });
            } else {
              return new Response(JSON.stringify({ 
                success: false, 
                dbMode: 'local_storage',
                error: 'Database not bound. In Cloudflare Pages Settings -> Functions -> KV namespace bindings, bind your KV namespace.' 
              }), { headers, status: 400 });
            }
          }
        }

        // 2. R2 FILE UPLOAD PIPELINE (/api/upload)
        if (path === '/api/upload' && method === 'POST') {
          let filename = `file_${Date.now()}`;
          let contentType = 'application/octet-stream';
          let fileBuffer = null;
          let folder = 'uploads';

          const cTypeHeader = request.headers.get('content-type') || '';
          if (cTypeHeader.includes('application/json')) {
            const body = await request.json();
            filename = body.filename || `doc_${Date.now()}.pdf`;
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
              filename = file.name || `upload_${Date.now()}`;
              contentType = file.type || 'application/octet-stream';
              fileBuffer = await file.arrayBuffer();
            }
          } else {
            fileBuffer = await request.arrayBuffer();
            filename = request.headers.get('x-filename') || `file_${Date.now()}`;
            contentType = cTypeHeader || 'application/octet-stream';
          }

          if (!fileBuffer) {
            return new Response(JSON.stringify({ success: false, error: 'No file buffer provided' }), { headers, status: 400 });
          }

          // Clean key name
          const cleanName = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
          const datePrefix = new Date().toISOString().slice(0, 10).replace(/-/g, '/');
          const key = `${folder}/${datePrefix}/${Date.now()}_${cleanName}`;

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
            const fileUrl = `${origin}/api/files/${key}`;

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
            // Fallback when R2 bucket is not yet attached in dashboard
            return new Response(JSON.stringify({
              success: true,
              r2Bound: false,
              warning: 'R2 Bucket not bound yet. File processed in memory.',
              filename: cleanName,
              size: fileBuffer.byteLength
            }), { headers, status: 200 });
          }
        }

        // 3. R2 FILE STREAMING & DOWNLOAD (/api/files/*)
        if (path.startsWith('/api/files/') && method === 'GET') {
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

            return new Response(object.body, {
              headers: fileHeaders,
              status: 200
            });
          } else {
            return new Response(JSON.stringify({ success: false, error: 'File storage not bound or invalid file key' }), { headers, status: 404 });
          }
        }

        // 4. ADMISSION APPLICATION DATA CAPTURE & DISPATCH PIPELINE (/api/applications/submit)
        if ((path === '/api/applications/submit' || path === '/api/applications') && method === 'POST') {
          const body = await request.json();
          const refNo = `ELIMU-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
          const submittedAt = new Date().toISOString();

          let pdfUrl = null;
          let r2Key = null;

          // If client passed generated PDF Base64, save directly to R2 bucket
          if (body.pdfBase64 && isR2Bound) {
            try {
              const base64Str = body.pdfBase64.replace(/^data:[^;]+;base64,/, '');
              const binaryStr = atob(base64Str);
              const len = binaryStr.length;
              const bytes = new Uint8Array(len);
              for (let i = 0; i < len; i++) {
                bytes[i] = binaryStr.charCodeAt(i);
              }
              const schoolSlug = (body.schoolId || 'general').replace(/[^a-zA-Z0-9_-]/g, '');
              r2Key = `applications/${schoolSlug}/${refNo}.pdf`;
              
              await r2.put(r2Key, bytes.buffer, {
                httpMetadata: { contentType: 'application/pdf' },
                customMetadata: {
                  refNo: refNo,
                  studentName: body.studentName || '',
                  schoolName: body.schoolName || '',
                  parentPhone: body.parentPhone || '',
                  submittedAt: submittedAt
                }
              });

              pdfUrl = `${url.origin}/api/files/${r2Key}`;
            } catch (pdfErr) {
              console.error("Failed saving PDF to R2", pdfErr);
            }
          }

          // Build full Application Record
          const applicationRecord = {
            id: `app_${Date.now()}`,
            refNo: refNo,
            submittedAt: submittedAt,
            schoolId: body.schoolId || '',
            schoolName: body.schoolName || '',
            schoolPhone: body.schoolPhone || '',
            schoolEmail: body.schoolEmail || '',
            studentName: body.studentName || '',
            gender: body.gender || '',
            dob: body.dob || '',
            classLevel: body.classLevel || '',
            ritaNo: body.ritaNo || '',
            location: body.location || '',
            parentName: body.parentName || '',
            parentPhone: body.parentPhone || '',
            parentLocation: body.parentLocation || '',
            parentNida: body.parentNida || '',
            studentNida: body.studentNida || '',
            healthInfo: body.healthInfo || '',
            pdfUrl: pdfUrl,
            r2Key: r2Key,
            status: 'submitted',
            formData: body.formData || {}
          };

          // Store application in KV for tracking & institution portal
          if (isDbBound) {
            let appsList = [];
            const rawApps = await kv.get('applications_list');
            if (rawApps) {
              try { appsList = JSON.parse(rawApps); } catch (e) {}
            }
            appsList.unshift(applicationRecord);
            await kv.put('applications_list', JSON.stringify(appsList.slice(0, 1000))); // Keep last 1000 applications
            await kv.put(`app_${refNo}`, JSON.stringify(applicationRecord));
          }

          // Format WhatsApp API and Email Dispatch payloads
          const targetPhone = (body.schoolPhone || '').replace(/[^0-9]/g, '');
          const targetEmail = body.schoolEmail || '';

          const whatsappMessageText = (body.lang === 'sw')
            ? `*FOMU YA USAJILI MPYA - ${body.schoolName?.toUpperCase()}*\n` +
              `Namba ya Maombi: *${refNo}*\n` +
              `Mwanafunzi: *${body.studentName}*\n` +
              `Darasa/Kozi: *${body.classLevel}*\n` +
              `Mzazi/Mlezi: *${body.parentName}* (${body.parentPhone})\n` +
              (pdfUrl ? `\n📄 *Pakua Fomu ya PDF:* ${pdfUrl}\n` : '') +
              `\n_Imetumwa kidijitali kupitia Elimu Express Portal_`
            : `*NEW ADMISSION APPLICATION - ${body.schoolName?.toUpperCase()}*\n` +
              `Ref Number: *${refNo}*\n` +
              `Applicant: *${body.studentName}*\n` +
              `Class/Program: *${body.classLevel}*\n` +
              `Parent/Guardian: *${body.parentName}* (${body.parentPhone})\n` +
              (pdfUrl ? `\n📄 *Download PDF Form:* ${pdfUrl}\n` : '') +
              `\n_Dispatched via Elimu Express Portal_`;

          const responsePayload = {
            success: true,
            refNo: refNo,
            applicationId: applicationRecord.id,
            pdfUrl: pdfUrl,
            r2Key: r2Key,
            isR2Bound: isR2Bound,
            isDbBound: isDbBound,
            whatsappDispatch: {
              status: "ready",
              targetPhone: targetPhone,
              directUrl: `https://wa.me/${targetPhone}?text=${encodeURIComponent(whatsappMessageText)}`,
              apiPayload: {
                messaging_product: "whatsapp",
                recipient_type: "individual",
                to: targetPhone,
                type: pdfUrl ? "document" : "text",
                ...(pdfUrl ? {
                  document: {
                    link: pdfUrl,
                    filename: `Admission_${(body.studentName || 'Student').replace(/\s+/g, '_')}_${refNo}.pdf`,
                    caption: whatsappMessageText
                  }
                } : {
                  text: { body: whatsappMessageText }
                })
              }
            },
            emailDispatch: {
              status: "ready",
              targetEmail: targetEmail,
              subject: `New Admission Application: ${body.studentName} (${body.classLevel}) - ${body.schoolName}`,
              pdfAttachmentUrl: pdfUrl,
              mailToLink: `mailto:${targetEmail}?subject=${encodeURIComponent(`Admission: ${body.studentName} - ${refNo}`)}&body=${encodeURIComponent(whatsappMessageText)}`
            }
          };

          return new Response(JSON.stringify(responsePayload), { headers, status: 200 });
        }

        // 5. GET APPLICATIONS LIST (/api/applications)
        if (path === '/api/applications' && method === 'GET') {
          const authHeader = request.headers.get('Authorization') || '';
          if (!authHeader.startsWith('Bearer ')) {
            return new Response(JSON.stringify({ success: false, error: 'Unauthorized' }), { headers, status: 401 });
          }
          let list = [];
          if (isDbBound) {
            const raw = await kv.get('applications_list');
            if (raw) list = JSON.parse(raw);
          }
          return new Response(JSON.stringify({ success: true, count: list.length, isR2Bound, data: list }), { headers, status: 200 });
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
