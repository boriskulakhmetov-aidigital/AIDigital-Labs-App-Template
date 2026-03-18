import type { Context } from '@netlify/functions';
import { verifyAuth } from './_shared/auth.ts';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export default async (req: Request, _context: Context) => {
  try {
    const userId = await verifyAuth(req.headers.get('authorization'));
    const { message } = await req.json();

    // TODO: Implement your chat orchestration logic
    // This is a streaming SSE endpoint — return a ReadableStream

    const model = ai.models.generateContentStream({
      model: 'gemini-2.0-flash',
      contents: message,
    });

    // Placeholder: return a simple JSON response
    return Response.json({ reply: `Echo: ${message}` });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
};
