
import { GoogleGenAI, Type } from "@google/genai";
import sgMail from '@sendgrid/mail';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, history } = req.body;

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ error: 'GEMINI_API_KEY is not configured on the server.' });
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    const tools = [{
      functionDeclarations: [{
        name: 'sendEmailInquiry',
        description: 'Sends a formal inquiry to Axion Lab and CCs the user.',
        parameters: {
          type: Type.OBJECT,
          properties: {
            userName: { type: Type.STRING },
            userEmail: { type: Type.STRING },
            message: { type: Type.STRING },
            inquiryType: { type: Type.STRING, enum: ["Scheduling", "Support", "General"] }
          },
          required: ['userName', 'userEmail', 'message', 'inquiryType'],
        },
      }]
    }];

    const systemInstruction = `You are the Axion Lab AI Concierge. 
    1. ONLY answer questions about Axion Lab services (Web/App Dev, AI, DevOps) and locations.
    2. REJECT off-topic questions politely.
    3. To contact us or schedule, you MUST call 'sendEmailInquiry'.
    4. Confirm that a copy is sent to both support@axionlab.in and the user's provided email.`;

    const contents = history.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));
    
    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    let response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents,
      config: {
        systemInstruction,
        tools,
      },
    });

    let finalResponseText = response.text;
    let emailSent = false;

    if (response.functionCalls && response.functionCalls.length > 0) {
      const fc = response.functionCalls[0];
      if (fc.name === 'sendEmailInquiry' && process.env.SENDGRID_API_KEY) {
        const { userName, userEmail, message: inquiryMsg, inquiryType } = fc.args;
        
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        
        const mailContent = {
          to: 'support@axionlab.in',
          from: 'support@axionlab.in',
          replyTo: userEmail,
          subject: `AI Concierge: ${inquiryType} Inquiry from ${userName}`,
          text: inquiryMsg,
          html: `<p><strong>Name:</strong> ${userName}</p><p><strong>Type:</strong> ${inquiryType}</p><p>${inquiryMsg}</p>`
        };

        try {
          await sgMail.send(mailContent);
          emailSent = true;

          const toolResponse = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: [
              ...contents,
              { role: 'model', parts: response.candidates[0].content.parts },
              { role: 'user', parts: [{ text: `SYSTEM_SIGNAL: Email dispatched successfully. Confirmed with user.` }] }
            ],
            config: { systemInstruction }
          });
          
          finalResponseText = toolResponse.text;
        } catch (sgError) {
          console.error("SendGrid Tool Error:", sgError);
        }
      }
    }

    return res.status(200).json({ 
      text: finalResponseText,
      isSystem: emailSent 
    });

  } catch (error) {
    console.error('Gemini API Error:', error);
    return res.status(500).json({ error: 'Internal server error processing chat.' });
  }
}
