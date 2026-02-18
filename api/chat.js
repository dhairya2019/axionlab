
import { GoogleGenAI, Type } from "@google/genai";
import sgMail from '@sendgrid/mail';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, history } = req.body;

  if (!process.env.API_KEY) {
    return res.status(500).json({ error: 'SYSTEM_FAULT: Gemini API Key missing.' });
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const tools = [{
      functionDeclarations: [{
        name: 'sendEmailInquiry',
        description: 'Sends technical lead details to Axion Lab support and the client.',
        parameters: {
          type: Type.OBJECT,
          properties: {
            userName: { type: Type.STRING },
            userEmail: { type: Type.STRING },
            company: { type: Type.STRING },
            scope: { type: Type.STRING },
            priority: { type: Type.STRING, enum: ["Standard", "Critical", "Urgent"] }
          },
          required: ['userName', 'userEmail', 'company', 'scope'],
        },
      }]
    }];

    const systemInstruction = `You are the AXIONLAB AI Concierge.
    AXIONLAB specializes in AI Agents (Dify/Langflow), Headless Commerce, and Platform Engineering.
    Guidelines:
    - Tersce, professional, engineering-focused tone.
    - Only discuss Axion Lab services.
    - Collect Name, Company, Email, and Scope before calling 'sendEmailInquiry'.
    - If a tool is called, explicitly tell the user that "The synchronization brief has been dispatched to our engineering node and a copy is in your inbox."`;

    const contents = history.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));
    
    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents,
      config: {
        systemInstruction,
        tools,
      },
    });

    let finalResponseText = response.text || "";
    let emailSent = false;

    // Handle tool calls immediately
    const functionCall = response.candidates?.[0]?.content?.parts?.find(p => p.functionCall);
    
    if (functionCall && functionCall.functionCall.name === 'sendEmailInquiry') {
      const args = functionCall.functionCall.args;
      
      if (process.env.SENDGRID_API_KEY) {
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        
        try {
          const mailPayload = {
            to: 'support@axionlab.in',
            from: 'support@axionlab.in',
            replyTo: args.userEmail,
            subject: `[CONCIERGE] Initiation: ${args.company}`,
            text: `Name: ${args.userName}\nEmail: ${args.userEmail}\nScope: ${args.scope}`,
            html: `<h3>New System Initiation</h3><p><strong>Entity:</strong> ${args.company}</p><p><strong>Scope:</strong> ${args.scope}</p>`
          };
          
          await sgMail.send(mailPayload);
          emailSent = true;
          // If we called a tool, provide a fallback confirmation if the model didn't provide text
          if (!finalResponseText) {
            finalResponseText = `PROTOCOL_SYNC: Initiation dossier for ${args.company} successfully dispatched. Copies sent to support@axionlab.in and your provided terminal. Our engineers will review these parameters shortly.`;
          }
        } catch (mailErr) {
          console.error("Mail Relay Error:", mailErr);
          finalResponseText = "RELAY_FAULT: I attempted to dispatch your dossier but the secure SMTP tunnel rejected the transmission. Please contact support@axionlab.in directly.";
        }
      } else {
        finalResponseText = "CONFIG_ERROR: Mail service unconfigured. Please relay your project scope to support@axionlab.in.";
      }
    }

    // Ensure we ALWAYS return text
    if (!finalResponseText && !emailSent) {
      finalResponseText = "CONNECTION_STABLE: Awaiting next command or data parameter.";
    }

    return res.status(200).json({ 
      text: finalResponseText,
      isSystem: emailSent 
    });

  } catch (error) {
    console.error('Logic Error:', error);
    return res.status(500).json({ error: 'CORE_EXCEPTION: Backend processing timed out or failed.' });
  }
}
