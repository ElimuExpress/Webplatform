// Cloudflare Pages Function: /api/applications (Admissions Data Capture & WhatsApp/Email Pipeline)
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

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function onRequestGet({ request, env }) {
  const headers = new Headers({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  });

  const authHeader = request.headers.get('Authorization') || '';
  if (!authHeader.startsWith('Bearer ')) {
    return new Response(JSON.stringify({ success: false, error: 'Unauthorized' }), { headers, status: 401 });
  }

  const kv = getKv(env);
  const r2 = getR2(env);
  let list = [];

  if (kv) {
    const raw = await kv.get('applications_list');
    if (raw) {
      try { list = JSON.parse(raw); } catch (e) {}
    }
  }

  return new Response(JSON.stringify({
    success: true,
    count: list.length,
    isR2Bound: !!r2,
    isDbBound: !!kv,
    data: list
  }), { headers, status: 200 });
}

export async function onRequestPost({ request, env }) {
  const headers = new Headers({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  });

  const url = new URL(request.url);
  const kv = getKv(env);
  const r2 = getR2(env);
  const isDbBound = !!kv;
  const isR2Bound = !!r2;

  try {
    const body = await request.json();
    const refNo = 'ELIMU-' + new Date().getFullYear() + '-' + Math.floor(100000 + Math.random() * 900000);
    const submittedAt = new Date().toISOString();

    let pdfUrl = null;
    let r2Key = null;

    // Save PDF directly to R2 if base64 passed
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
        r2Key = 'applications/' + schoolSlug + '/' + refNo + '.pdf';

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

        pdfUrl = url.origin + '/api/files/' + r2Key;
      } catch (pdfErr) {
        console.error("Failed saving PDF to R2", pdfErr);
      }
    }

    const applicationRecord = {
      id: 'app_' + Date.now(),
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

    if (isDbBound) {
      let appsList = [];
      const rawApps = await kv.get('applications_list');
      if (rawApps) {
        try { appsList = JSON.parse(rawApps); } catch (e) {}
      }
      appsList.unshift(applicationRecord);
      await kv.put('applications_list', JSON.stringify(appsList.slice(0, 1000)));
      await kv.put('app_' + refNo, JSON.stringify(applicationRecord));
    }

    const targetPhone = (body.schoolPhone || '').replace(/[^0-9]/g, '');
    const targetEmail = body.schoolEmail || '';

    const whatsappMessageText = (body.lang === 'sw')
      ? '*FOMU YA USAJILI MPYA - ' + (body.schoolName || '').toUpperCase() + '*\n' +
        'Namba ya Maombi: *' + refNo + '*\n' +
        'Mwanafunzi: *' + (body.studentName || '') + '*\n' +
        'Darasa/Kozi: *' + (body.classLevel || '') + '*\n' +
        'Mzazi/Mlezi: *' + (body.parentName || '') + '* (' + (body.parentPhone || '') + ')\n' +
        (pdfUrl ? ('\n📄 *Pakua Fomu ya PDF:* ' + pdfUrl + '\n') : '') +
        '\n_Imetumwa kidijitali kupitia Elimu Express Portal_'
      : '*NEW ADMISSION APPLICATION - ' + (body.schoolName || '').toUpperCase() + '*\n' +
        'Ref Number: *' + refNo + '*\n' +
        'Applicant: *' + (body.studentName || '') + '*\n' +
        'Class/Program: *' + (body.classLevel || '') + '*\n' +
        'Parent/Guardian: *' + (body.parentName || '') + '* (' + (body.parentPhone || '') + ')\n' +
        (pdfUrl ? ('\n📄 *Download PDF Form:* ' + pdfUrl + '\n') : '') +
        '\n_Dispatched via Elimu Express Portal_';

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
        directUrl: 'https://wa.me/' + targetPhone + '?text=' + encodeURIComponent(whatsappMessageText),
        apiPayload: {
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to: targetPhone,
          type: pdfUrl ? "document" : "text",
          ...(pdfUrl ? {
            document: {
              link: pdfUrl,
              filename: 'Admission_' + (body.studentName || 'Student').replace(/\s+/g, '_') + '_' + refNo + '.pdf',
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
        subject: 'New Admission Application: ' + body.studentName + ' (' + body.classLevel + ') - ' + body.schoolName,
        pdfAttachmentUrl: pdfUrl,
        mailToLink: 'mailto:' + targetEmail + '?subject=' + encodeURIComponent('Admission: ' + (body.studentName || '') + ' - ' + refNo) + '&body=' + encodeURIComponent(whatsappMessageText)
      }
    };

    return new Response(JSON.stringify(responsePayload), { headers, status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.message }), { headers, status: 500 });
  }
}
