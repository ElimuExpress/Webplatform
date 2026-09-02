// Cloudflare Pages Function: /api/dispatch (Direct WhatsApp & Email Push Gateway)
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

export async function onRequestPost({ request, env }) {
  const headers = new Headers({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  });

  try {
    const body = await request.json();
    const { channel, target, refNo, studentName, pdfUrl, message } = body;

    // Check if custom WhatsApp API token or Email API token is present in environment
    const whatsappApiToken = env.WHATSAPP_API_TOKEN || env.WA_TOKEN || null;
    const whatsappPhoneId = env.WHATSAPP_PHONE_NUMBER_ID || env.WA_PHONE_ID || null;
    const resendApiKey = env.RESEND_API_KEY || env.EMAIL_API_KEY || null;

    if (channel === 'whatsapp') {
      if (whatsappApiToken && whatsappPhoneId && target) {
        // Direct Cloud API dispatch
        const waRes = await fetch('https://graph.facebook.com/v19.0/' + whatsappPhoneId + '/messages', {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer ' + whatsappApiToken,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            messaging_product: 'whatsapp',
            recipient_type: 'individual',
            to: target.replace(/[^0-9]/g, ''),
            type: pdfUrl ? 'document' : 'text',
            ...(pdfUrl ? {
              document: {
                link: pdfUrl,
                filename: 'Admission_' + (studentName || 'Form').replace(/\s+/g, '_') + '.pdf',
                caption: message || ('New Admission Application for ' + studentName + ' (Ref: ' + refNo + ')')
              }
            } : {
              text: { body: message }
            })
          })
        });

        const waData = await waRes.json();
        return new Response(JSON.stringify({
          success: true,
          channel: 'whatsapp',
          mode: 'cloud_api_direct',
          gatewayResponse: waData
        }), { headers, status: 200 });
      } else {
        // Standard Webhook / App Link Dispatch
        return new Response(JSON.stringify({
          success: true,
          channel: 'whatsapp',
          mode: 'direct_url_ready',
          directUrl: 'https://wa.me/' + (target || '').replace(/[^0-9]/g, '') + '?text=' + encodeURIComponent(message || ''),
          note: 'To enable 100% automated direct background WhatsApp delivery without opening WhatsApp client, set WHATSAPP_API_TOKEN and WHATSAPP_PHONE_NUMBER_ID in Cloudflare environment.'
        }), { headers, status: 200 });
      }
    }

    if (channel === 'email') {
      if (resendApiKey && target) {
        const emailRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer ' + resendApiKey,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: 'Elimu Express <admissions@elimu-express.co.tz>',
            to: [target],
            subject: 'New Student Admission Application: ' + (studentName || 'Applicant') + ' (Ref: ' + refNo + ')',
            html: '<p>' + (message || '').replace(/\n/g, '<br>') + '</p>' + (pdfUrl ? ('<p><a href="' + pdfUrl + '">Download Official Admission Form (PDF)</a></p>') : '')
          })
        });
        const emailData = await emailRes.json();
        return new Response(JSON.stringify({
          success: true,
          channel: 'email',
          mode: 'api_direct',
          gatewayResponse: emailData
        }), { headers, status: 200 });
      } else {
        return new Response(JSON.stringify({
          success: true,
          channel: 'email',
          mode: 'mailto_ready',
          mailToLink: 'mailto:' + target + '?subject=' + encodeURIComponent('Admission Form - ' + refNo) + '&body=' + encodeURIComponent(message || ''),
          note: 'To enable 100% automated background email delivery with attached PDF, set RESEND_API_KEY in Cloudflare environment.'
        }), { headers, status: 200 });
      }
    }

    return new Response(JSON.stringify({ success: false, error: 'Invalid channel specified' }), { headers, status: 400 });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.message }), { headers, status: 500 });
  }
}
