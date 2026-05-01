export interface FAQItem {
    question: string;
    answer: string;
}

/**
 * Default FAQ data for the SAU Question Bank homepage.
 * Written in a helpful senior student tone — no marketing fluff.
 */
export const homepageFAQs: FAQItem[] = [
    {
        question: "What is the SAU Question Bank?",
        answer: "It's a free platform built by SAU students to collect and organize previous year exam questions, lecture notes, and study materials across all faculties. Think of it as a shared Google Drive but structured by faculty, level, semester, and course code. You can search, filter, and even ask our AI tutor if you're stuck on a concept."
    },
    {
        question: "Where can I find SAU previous year question papers?",
        answer: "Go to the 'Browse Questions' page, select your faculty (AEC, Agriculture, or ASVM), then pick your level, semester, and course. All uploaded past papers appear instantly. If a specific course is missing, use the upload form to contribute — it takes 2 minutes and helps everyone."
    },
    {
        question: "Which faculties are covered?",
        answer: "We currently cover three faculties: Agricultural Economics (AEC), Agriculture, and Animal Science & Veterinary Medicine (ASVM). Each faculty has its own section with courses mapped to the official SAU curriculum. If you're from another faculty and want to contribute, reach out — we'll add support."
    },
    {
        question: "Is the AI tutor free to use?",
        answer: "Yes, completely free. The AI tutor uses Groq's Llama model and is available 24/7. Click the floating chat button (bottom-right) or the 'Ask AI Tutor' CTA on any page. It knows about SAU courses, so you can ask things like 'Explain supply and demand for AEC-101' or 'Summarize this lecture note.'"
    },
    {
        question: "How do I download SAU question papers as PDF?",
        answer: "Most questions are displayed directly on the page for quick reading. If you need a PDF, use your browser's print function (Ctrl+P / Cmd+P) and select 'Save as PDF.' We're working on native PDF export, but for now, this method preserves formatting and works offline."
    },
    {
        question: "Does this platform cover SAU Agricultural Economics questions?",
        answer: "Yes. The Agricultural Economics (AEC) faculty is fully supported. You'll find questions for all levels and semesters, including core courses like Microeconomics, Macroeconomics, Agricultural Marketing, and Farm Management. Filter by 'AEC' in the faculty dropdown to see only economics-related content."
    }
];
