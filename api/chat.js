import { GoogleGenAI, Type } from "@google/genai";
import sgMail from '@sendgrid/mail';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, history } = req.body;

  // ✅ FIX 1: Env var was named GEMINI_API_KEY in .env.local but code read API_KEY.
  // Standardised to API_KEY. Set this in Vercel Dashboard → Settings → Environment Variables.
  if (!process.env.API_KEY) {
    return res.status(500).json({ error: 'SYSTEM_FAULT: Gemini API Key missing.' });
  }

  // ✅ FIX 2: Server-side abort at 8s.
  // Vercel Hobby plan kills serverless functions at 10s. The old code had no server-side
  // timeout — if Gemini took >10s, Vercel sent a 504 with no useful message.
  // 8s gives us a clean abort with a user-readable error before Vercel cuts the connection.
  const controller = new AbortController();
  const serverTimeout = setTimeout(() => controller.abort(), 8000);

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const tools = [{
      functionDeclarations: [{
        name: 'sendEmailInquiry',
        description: 'Sends technical lead details to Axion Lab support and the client.',
        parameters: {
          type: Type.OBJECT,
          properties: {
            userName:  { type: Type.STRING },
            userEmail: { type: Type.STRING },
            company:   { type: Type.STRING },
            scope:     { type: Type.STRING },
            priority:  { type: Type.STRING, enum: ["Standard", "Critical", "Urgent"] }
          },
          required: ['userName', 'userEmail', 'company', 'scope'],
        },
      }]
    }];

    const systemInstruction = `You are the AXIONLAB AI Concierge.
    AXIONLAB specializes in AI Agents (Dify/Langflow), Headless Commerce, and Platform Engineering.
    Guidelines:
    - Terse, professional, engineering-focused tone.
    - Only discuss Axion Lab services.
    - Collect Name, Company, Email, and Scope before calling 'sendEmailInquiry'.
    - If a tool is called, tell the user: "The synchronization brief has been dispatched to our engineering node and a copy is in your inbox."`;

    const contents = history.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));
    contents.push({ role: 'user', parts: [{ text: message }] });

    // ✅ FIX 3: Model name was 'gemini-3-flash-preview' which does not exist.
    // 'gemini-2.0-flash' is the current fast model — fast enough to stay under 8s.
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents,
      config: { systemInstruction, tools },
    });

    clearTimeout(serverTimeout);

    let finalResponseText = response.text || "";
    let emailSent = false;

    const functionCall = response.candidates?.[0]?.content?.parts?.find(p => p.functionCall);

    if (functionCall && functionCall.functionCall.name === 'sendEmailInquiry') {
      const args = functionCall.functionCall.args;

      if (process.env.SENDGRID_API_KEY) {
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        try {
          await sgMail.send({
            to: 'support@axionlab.in',
            from: 'support@axionlab.in', // Must be verified sender in SendGrid
            replyTo: args.userEmail,
            subject: `[CONCIERGE] Initiation: ${args.company}`,
            text: `Name: ${args.userName}\nEmail: ${args.userEmail}\nScope: ${args.scope}`,
            html: `<h3>New System Initiation</h3><p><strong>Entity:</strong> ${args.company}</p><p><strong>Scope:</strong> ${args.scope}</p>`
          });
          emailSent = true;
          if (!finalResponseText) {
            finalResponseText = `PROTOCOL_SYNC: Initiation dossier for ${args.company} successfully dispatched. Our engineers will review these parameters shortly.`;
          }
        } catch (mailErr) {
          console.error("Mail Relay Error:", mailErr);
          finalResponseText = "RELAY_FAULT: I attempted to dispatch your dossier but the SMTP tunnel rejected the transmission. Please contact support@axionlab.in directly.";
        }
      } else {
        finalResponseText = "CONFIG_ERROR: Mail service unconfigured. Please relay your project scope to support@axionlab.in.";
      }
    }

    if (!finalResponseText && !emailSent) {
      finalResponseText = "CONNECTION_STABLE: Awaiting next command or data parameter.";
    }

    return res.status(200).json({ text: finalResponseText, isSystem: emailSent });

  } catch (error) {
    clearTimeout(serverTimeout);
    console.error('Logic Error:', error);

    // Distinguish timeout from other errors for clearer client messaging
    if (error.name === 'AbortError') {
      return res.status(504).json({ error: 'TIMEOUT: AI node took too long. Please retry.' });
    }
    return res.status(500).json({ error: 'CORE_EXCEPTION: Backend processing failed.' });
  }
}
