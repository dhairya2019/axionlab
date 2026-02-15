
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

  const agencyMsg = {
    to: 'support@axionlab.in',
    from: 'support@axionlab.in',
    replyTo: email,
    subject: `New Axion Lab Inquiry from ${email}`,
    text: message,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
        <h2 style="color: #4f46e5; margin-bottom: 20px;">New Inquiry Received</h2>
        <p style="color: #64748b; font-size: 14px;"><strong>From:</strong> ${email}</p>
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; color: #1e293b; line-height: 1.6;">
          ${message.replace(/\n/g, '<br>')}
        </div>
        <p style="margin-top: 20px; font-size: 12px; color: #94a3b8;">This message was dispatched via Axion Secure SMTP Tunnel.</p>
      </div>
    `,
  };

  const userMsg = {
    to: email,
    from: 'support@axionlab.in',
    subject: 'We received your message - Axion Lab',
    text: `Hello,\n\nThank you for reaching out to Axion Lab. We have received your inquiry and a partner will review it shortly.\n\nRef: ${new Date().getTime()}\n\nBest regards,\nAxion Operations Team`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; text-align: center;">
        <div style="background: linear-gradient(to right, #4f46e5, #9333ea); padding: 2px; border-radius: 50%; width: 60px; height: 60px; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
           <div style="background: white; border-radius: 50%; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-weight: bold; color: #4f46e5;">A</div>
        </div>
        <h1 style="color: #1e1b4b;">Message Received</h1>
        <p style="color: #475569; font-size: 16px;">Thank you for your interest in Axion Lab. Our engineering team has been notified and we will respond to your request within 24 hours.</p>
        <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 30px 0;">
        <p style="color: #94a3b8; font-size: 12px;">Axion Lab | Digital Evolution</p>
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
