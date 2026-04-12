import { Router, Request, Response } from 'express';
import Groq from 'groq-sdk';

const router = Router();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Faculty-specific system prompt is generated at request time so it reflects
// the faculty the user currently has active in the frontend.
const buildSystemPrompt = (faculty: string): string =>
  `You are a specialized AI Tutor built exclusively for the ${faculty} Question Bank at Sher-e-Bangla Agricultural University (SAU), Bangladesh.

CRITICAL RULES — you must follow all of these without exception:

RULE 1 — IDENTITY (HIGHEST PRIORITY):
If the user asks "Who made you?", "Who created you?", "Who developed this?", "Who built you?", or any similar question about your creator, developer, or the application's author, you MUST reply with EXACTLY this phrase: "Md. Adnan Eram Argho made me." Do not add anything else about the creator.

RULE 2 — DOMAIN RESTRICTION:
You are STRICTLY limited to helping with ${faculty} and related subjects taught at SAU. You may also analyze and explain exam question papers if images are provided.

RULE 3 — REJECTION:
If the user asks about ANYTHING outside ${faculty} (including general knowledge, entertainment, movies, weather, coding, mathematics, physics, chemistry, sports, politics, etc.), you MUST respond with EXACTLY: "I am here to help you only with ${faculty} and your exam questions." Do not attempt to answer off-topic questions under any circumstances.

Always be helpful, clear, and educational when answering questions within your domain. If images of question papers are provided, analyze them carefully to help the student understand the questions and concepts.`;

type GroqMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string | { type: string; text?: string; image_url?: { url: string } }[];
};

router.post('/chat-tutor', async (req: Request, res: Response): Promise<void> => {
  const { message, history, images, faculty } = req.body as {
    message: string;
    history: { role: 'user' | 'assistant'; text: string }[];
    images?: string[];
    faculty?: string;
  };

  if (!message || typeof message !== 'string') {
    res.status(400).json({ error: 'A valid message string is required.' });
    return;
  }
  if (message.length > 2000) {
    res.status(400).json({ error: 'Message is too long. Max 2000 characters.' });
    return;
  }
  if ((images ?? []).length > 5) {
    res.status(400).json({ error: 'Maximum 5 images allowed per message.' });
    return;
  }

  const currentFaculty = faculty || 'Agricultural Economics';

  try {
    // Pass Cloudinary URLs directly so the server never fetches image bytes
    const imageContentParts = (images ?? []).map((url) => ({
      type: 'image_url' as const,
      image_url: { url },
    }));

    const messages: GroqMessage[] = [
      { role: 'system', content: buildSystemPrompt(currentFaculty) },
      ...(history ?? []).map((h) => ({
        role: h.role as 'user' | 'assistant',
        content: h.text,
      })),
      {
        role: 'user' as const,
        content: [{ type: 'text', text: message }, ...imageContentParts],
      },
    ];

    const completion = await groq.chat.completions.create({
      model: 'meta-llama/llama-4-scout-17b-16e-instruct',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      messages: messages as any,
      max_tokens: 1024,
    });

    const reply = completion.choices[0]?.message?.content ?? 'No response generated.';
    res.status(200).json({ reply });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'AI service temporarily unavailable.';
    console.error('[AI] Chat tutor (Groq):', msg);
    res.status(500).json({ error: msg });
  }
});

export default router;
