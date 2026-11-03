import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useFaculty } from '../context/FacultyContext';
import { SparkleIcon, SendIcon, CloseIcon } from './icons';
import { courseData } from '../data';

interface Message {
    id: number;
    role: 'user' | 'model';
    text: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'https://question-bank-app.onrender.com';

// Valid faculties whitelist (must match backend)
const VALID_FACULTIES = Object.keys(courseData);


// Typing indicator dots
const TypingIndicator = () => (
    <div className="flex items-center gap-1 px-4 py-3">
        <span className="w-2 h-2 bg-brand-primary rounded-full" />
        <span className="w-2 h-2 bg-brand-primary rounded-full" />
        <span className="w-2 h-2 bg-brand-primary rounded-full" />
    </div>
);

// Render markdown-like bold text (**text**)
const renderText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) =>
        part.startsWith('**') && part.endsWith('**')
            ? <strong key={i}>{part.slice(2, -2)}</strong>
            : <span key={i}>{part}</span>
    );
};

const WELCOME_MESSAGE: Message = {
    id: 0,
    role: 'model',
    text: `Hello! I'm your AI Tutor for SAU. Ask me anything about your courses, concepts, or exam questions. I'm here to help! 🌾`,
};

const FloatingAITutor = () => {
    const location = useLocation();
    const { activeFaculty } = useFaculty();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const messageIdRef = useRef(1);

    // Auto-open AI Tutor when URL has ?ai-tutor=open query parameter
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        if (searchParams.get('ai-tutor') === 'open') {
            setIsOpen(true);
            // Clean up the URL after opening
            window.history.replaceState({}, '', window.location.pathname);
        }
    }, [location.search]);

    // Auto-scroll to bottom on new messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    // Focus input when chat opens
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 150);
        }
    }, [isOpen]);

    // Build Groq-compatible history (OpenAI format: role + text)
    const buildHistory = (): { role: 'user' | 'assistant'; text: string }[] => {
        return messages
            .filter((m) => m.id !== 0) // skip static welcome message
            .map((m) => ({
                role: m.role === 'model' ? 'assistant' : 'user' as 'user' | 'assistant',
                text: m.text,
            }));
    };

    /**
     * Validates faculty against whitelist before sending to backend.
     * Prevents prompt injection through manipulated faculty context.
     */
    const validateFaculty = (faculty: string): string => {
        if (VALID_FACULTIES.includes(faculty)) {
            return faculty;
        }
        console.warn(`[AI Tutor] Invalid faculty detected: "${faculty}". Defaulting to Agricultural Economics.`);
        return 'Agricultural Economics';
    };

    const handleSend = async () => {
        const trimmed = input.trim();
        if (!trimmed || isLoading) return;

        const userMessage: Message = {
            id: messageIdRef.current++,
            role: 'user',
            text: trimmed,
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const { data: sessionData } = await supabase.auth.getSession();
            const accessToken = sessionData.session?.access_token;

            const headers: Record<string, string> = {
                'Content-Type': 'application/json',
            };
            if (accessToken) {
                headers['Authorization'] = `Bearer ${accessToken}`;
            }

            // Validate faculty before sending to prevent injection
            const validatedFaculty = validateFaculty(activeFaculty);

            const res = await fetch(`${API_URL}/api/chat-tutor`, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    message: trimmed,
                    history: buildHistory(),
                    images: [], // extend here to pass question image URLs if needed
                    faculty: validatedFaculty,
                }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'AI response failed');

            const aiMessage: Message = {
                id: messageIdRef.current++,
                role: 'model',
                text: data.reply,
            };
            setMessages((prev) => [...prev, aiMessage]);
        } catch (err: unknown) {
            const detail = err instanceof Error ? err.message : 'Unknown error';
            const isNetworkError = detail === 'Failed to fetch'; // Actual network failure vs API rejection
            const errorMessage: Message = {
                id: messageIdRef.current++,
                role: 'model',
                text: isNetworkError
                    ? `⚠️ Network error. Please check your internet connection.`
                    : `⚠️ ${detail}`,
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <>
            {/* ── Chat Panel ── */}
            <div
                className={`fixed bottom-24 right-4 sm:right-6 z-50 flex flex-col transition-all duration-300 ease-out origin-bottom-right
                    ${isOpen
                        ? 'opacity-100 scale-100 pointer-events-auto'
                        : 'opacity-0 scale-90 pointer-events-none'
                    }
                    w-[calc(100vw-2rem)] sm:w-[380px] max-w-md
                    h-[70vh] sm:h-[520px] max-h-[600px]
                    bg-surface-card
                    rounded-lg
                    border border-border-subtle
                    overflow-hidden
                `}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 bg-brand-primary text-white flex-shrink-0">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-surface-card/20 rounded-full flex items-center justify-center">
                            <SparkleIcon />
                        </div>
                        <div>
                            <p className="font-semibold text-sm leading-tight">SAU AI Tutor</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md hover:bg-surface-card/20 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
                        aria-label="Close AI Tutor"
                        id="ai-tutor-close-btn"
                    >
                        <CloseIcon />
                    </button>
                </div>

                {/* Messages area */}
                <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 scroll-smooth">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            {msg.role === 'model' && (
                                <div className="w-7 h-7 rounded-full bg-brand-primary flex items-center justify-center text-white text-xs font-semibold mr-2 flex-shrink-0 mt-0.5">
                                    AI
                                </div>
                            )}
                            <div
                            className={`max-w-[80%] px-3.5 py-2.5 rounded-lg text-sm leading-relaxed whitespace-pre-wrap
                                    ${msg.role === 'user'
                                        ? 'bg-brand-primary text-white rounded-tr-md'
                                        : 'bg-surface-canvas bg-surface-card text-text-primary rounded-tl-sm border border-border-subtle/50'
                                    }
                                `}
                            >
                                {renderText(msg.text)}
                            </div>
                        </div>
                    ))}

                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="w-7 h-7 rounded-full bg-brand-primary flex items-center justify-center text-white text-xs font-semibold mr-2 flex-shrink-0 mt-0.5">
                                AI
                            </div>
                            <div className="bg-surface-canvas rounded-lg border border-border-subtle">
                                <TypingIndicator />
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input area */}
                <div className="px-3 py-3 border-t border-border-subtle bg-surface-card flex-shrink-0">
                    <div className="flex items-end gap-2 bg-surface-canvas border border-border-subtle rounded-md px-3 py-2">
                        <textarea
                            ref={inputRef}
                            id="ai-tutor-input"
                            rows={1}
                            value={input}
                            onChange={(e) => {
                                setInput(e.target.value);
                                e.target.style.height = 'auto';
                                e.target.style.height = `${Math.min(e.target.scrollHeight, 112)}px`; // 112px matches max-h-28
                            }}
                            onKeyDown={handleKeyDown}
                            placeholder="Ask about your courses..."
                            disabled={isLoading}
                            className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-muted dark:placeholder:text-text-muted resize-none focus:outline-none max-h-28 overflow-y-auto disabled:opacity-50"
                            style={{ minHeight: '24px' }}
                        />
                        <button
                            onClick={handleSend}
                            disabled={!input.trim() || isLoading}
                            id="ai-tutor-send-btn"
                            className="flex-shrink-0 min-h-11 min-w-11 bg-brand-primary hover:opacity-90 disabled:bg-text-muted text-white rounded-md flex items-center justify-center transition-colors disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
                            aria-label="Send message"
                        >
                            <SendIcon />
                        </button>
                    </div>
                    <p className="text-center text-[10px] text-text-muted dark:text-text-muted mt-1.5">
                        Faculty-specific answers · History clears on refresh
                    </p>
                </div>
            </div>

            {/* ── Floating Bubble Button ── */}
            <button
                onClick={() => setIsOpen((prev) => !prev)}
                id="ai-tutor-toggle-btn"
                aria-label={isOpen ? 'Close AI Tutor' : 'Open AI Tutor'}
                className={`fixed bottom-16 sm:bottom-16 right-4 sm:right-6 z-50 w-14 h-14 rounded-full border border-brand-primary bg-brand-primary
                    text-white flex items-center justify-center
                    transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2
                    ${isOpen ? 'rotate-0' : 'rotate-0'}
                `}
            >
                {isOpen ? (
                    <CloseIcon />
                ) : (
                    <SparkleIcon />
                )}
            </button>
        </>
    );
};

export default FloatingAITutor;
