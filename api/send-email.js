import sgMail from '@sendgrid/mail';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, message } = req.body;

  if (!email || !message) {
    return res.status(400).json({ error: 'Email and message are required.' });
  }

  if (!process.env.SENDGRID_API_KEY) {
    console.error('ERROR: SENDGRID_API_KEY is not defined in environment variables.');
    return res.status(500).json({ error: 'Mail server is currently unconfigured.' });
  }

  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  // Email to the agency (Support)
  const agencyMsg = {
    to: 'support@axionlab.in',
    from: 'support@axionlab.in',
    replyTo: email,
    subject: `New Axion Lab Inquiry from ${email}`,
    text: message,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 0px;">
        <h2 style="color: #ff1f3d; margin-bottom: 20px; font-weight: 900; text-transform: uppercase; letter-spacing: -0.04em;">New System Initiation</h2>
        <p style="color: #64748b; font-size: 14px;"><strong>Source Node:</strong> ${email}</p>
        <div style="background-color: #0e0e0e; padding: 25px; color: #ffffff; line-height: 1.6; border-left: 4px solid #ff1f3d;">
          <pre style="white-space: pre-wrap; font-family: monospace; margin: 0;">${message}</pre>
        </div>
        <p style="margin-top: 20px; font-size: 11px; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.1em;">Transmission Route: Axion Secure SMTP Tunnel v2.0</p>
      </div>
    `,
  };

  // Email copy to the user (Client)
  const userMsg = {
    to: email,
    from: 'support@axionlab.in',
    subject: 'Initiation Brief Copy - Axion Lab',
    text: `Your system initiation request has been received.\n\nTECHNICAL BRIEF COPY:\n\n${message}\n\nWe will respond to this dossier within 24 hours.\n\nAXIONLAB Engineering`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 0px;">
        <div style="background: #0e0e0e; padding: 30px; text-align: center; border-bottom: 1px solid #ff1f3d;">
           <h1 style="color: #ffffff; margin: 0; font-weight: 900; letter-spacing: -0.05em; font-size: 24px;">AXIONLAB</h1>
        </div>
        <div style="padding: 30px;">
          <h2 style="color: #0e0e0e; margin-bottom: 10px; font-weight: 800; text-transform: uppercase; font-size: 18px;">Brief Received.</h2>
          <p style="color: #475569; font-size: 16px; line-height: 1.5;">Your system architecture brief has been logged. Our engineering team is reviewing the parameters. You will receive a response within 24 hours.</p>
          
          <div style="margin: 30px 0; padding: 20px; background: #f8fafc; border: 1px solid #e2e8f0;">
            <h3 style="font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.2em; color: #ff1f3d; margin-bottom: 15px;">Technical Brief Record</h3>
            <pre style="font-family: monospace; font-size: 13px; color: #1e293b; white-space: pre-wrap; margin: 0;">${message}</pre>
          </div>
          
          <p style="color: #94a3b8; font-size: 12px; font-style: italic;">Note: This is an automated record of your transmission. Our partners will reach out shortly for the next synchronization phase.</p>
        </div>
        <div style="background: #f1f5f9; padding: 20px; text-align: center;">
          <p style="color: #64748b; font-size: 11px; margin: 0; text-transform: uppercase; letter-spacing: 0.1em;">AXIONLAB | Systems Engineering For The Obsessed</p>
        </div>
      </div>
    `
  };

  try {
    await Promise.all([
      sgMail.send(agencyMsg),
      sgMail.send(userMsg)
    ]);

    return res.status(200).json({ success: true, message: 'Emails dispatched successfully' });
  } catch (error) {
    console.error('SendGrid Error:', error.response?.body || error);
    return res.status(500).json({ error: 'Failed to dispatch email. Please try again later.' });
  }
}