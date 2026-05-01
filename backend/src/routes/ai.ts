import { Router, Request, Response } from 'express';
import Groq from 'groq-sdk';

const router = Router();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Whitelist of valid faculties to prevent prompt injection
const VALID_FACULTIES = [
  'Agricultural Economics',
  'Agriculture',
  'ASVM',
] as const;

type ValidFaculty = typeof VALID_FACULTIES[number];

/**
 * Sanitizes and validates faculty name to prevent prompt injection attacks.
 * Returns the validated faculty or default if invalid.
 */
const sanitizeFaculty = (faculty: unknown): ValidFaculty => {
  if (typeof faculty !== 'string') {
    return 'Agricultural Economics';
  }
  
  const trimmed = faculty.trim();
  
  // Check against whitelist
  if (VALID_FACULTIES.includes(trimmed as ValidFaculty)) {
    return trimmed as ValidFaculty;
  }
  
  // Log suspicious input for monitoring
  console.warn(`[AI] Invalid faculty attempted: "${trimmed}". Defaulting to Agricultural Economics.`);
  return 'Agricultural Economics';
};

// Faculty-specific system prompt is generated at request time so it reflects
// the faculty the user currently has active in the frontend.
const buildSystemPrompt = (faculty: ValidFaculty): string =>
  `You are the embedded AI Assistant living inside the Sher-e-Bangla Agricultural University (SAU) ${faculty} Question Bank website. You literally live inside the website's UI. NEVER say you lack a graphical interface or are just text-based. You ARE part of the website!

CRITICAL RULES:

RULE 1 — WEBSITE NAVIGATION:
If asked how to find questions, view the bank, or see study materials, DO NOT tell them to search Google, go to the official SAU site, or give you text. Tell them EXACTLY:
"You can browse all past questions by clicking the 'Questions' link in the top navigation bar of this website. If you need lecture notes or books, click the 'Study Materials' link. You can filter them by your specific Level and Semester!"

RULE 2 — IDENTITY:
If asked "Who made you?", reply EXACTLY: "Md. Adnan Eram Argho made me."

RULE 3 — CAPABILITIES:
When users ask academic questions about ${faculty}, explain clearly. Analyze question paper images if provided. 

RULE 4 — REJECTION:
If asked about ANYTHING outside ${faculty} or navigating this website, reply EXACTLY: "I am here to help you only with ${faculty}, your exam questions, and navigating this website."

EXAMPLES:
User: "How can I see questions in this website?"
Assistant: "You can browse all past questions by clicking the 'Questions' link in the top navigation bar of this website. If you need lecture notes or books, click the 'Study Materials' link. You can filter them by your specific Level and Semester!"

User: "Where are the previous year questions?"
Assistant: "You can browse all past questions by clicking the 'Questions' link in the top navigation bar of this website. If you need lecture notes or books, click the 'Study Materials' link. You can filter them by your specific Level and Semester!"

User: "Explain demand curve."
Assistant: "[Provide academic explanation]"`;

// 🛡️ Issue #7 Fix: Define proper strict types for Groq SDK
type ContentPart = { type: 'text'; text: string } | { type: 'image_url'; image_url: { url: string } };

type GroqMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string | ContentPart[];
};

router.post('/chat-tutor', async (req: Request, res: Response): Promise<void> => {
  const { message, history, images, faculty } = req.body as {
    message: string;
    history: { role: 'user' | 'assistant' | 'model'; text: string }[];
    images?: string[];
    faculty?: string;
  };

  if (!message || typeof message !== 'string') {
    res.status(400).json({ error: 'A valid message string is required.' });
    return;
  }
  
  // Additional message sanitization to prevent prompt injection
  const sanitizedMessage = message.trim();
  if (sanitizedMessage.length === 0) {
    res.status(400).json({ error: 'Message cannot be empty or whitespace only.' });
    return;
  }
  
  if (sanitizedMessage.length > 2000) {
    res.status(400).json({ error: 'Message is too long. Max 2000 characters.' });
    return;
  }
  
  if ((images ?? []).length > 5) {
    res.status(400).json({ error: 'Maximum 5 images allowed per message.' });
    return;
  }
  
// Validate and sanitize image URLs (Allow both Supabase and legacy Cloudinary URLs for backward compatibility)
const validImages = (images ?? []).filter((url: string) => {
  if (typeof url !== 'string') return false;
  const isSupabase = url.includes('supabase.co/storage/v1/object/public/');
  const isCloudinary = url.startsWith('https://res.cloudinary.com/');
  return isSupabase || isCloudinary;
});

  // Sanitize faculty to prevent prompt injection
  const currentFaculty = sanitizeFaculty(faculty);

  try {
    // Pass Cloudinary URLs directly so the server never fetches image bytes
    const imageContentParts: ContentPart[] = validImages.map((url: string) => ({
      type: 'image_url',
      image_url: { url },
    }));

    const messages: GroqMessage[] = [
      { role: 'system', content: buildSystemPrompt(currentFaculty) },
      ...(history ?? []).map((h) => ({
        role: h.role === 'model' ? 'assistant' : (h.role as 'user' | 'assistant'),
        content: h.text,
      })),
      {
        role: 'user',
        content: [{ type: 'text', text: sanitizedMessage }, ...imageContentParts],
      },
    ];

    const completion = await groq.chat.completions.create({
      model: 'meta-llama/llama-4-scout-17b-16e-instruct',
      messages: messages as any, // Only safely cast at the final handoff if Groq's internal types clash, but our object is now strictly typed above.
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