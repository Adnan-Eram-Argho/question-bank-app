import { useState, useRef, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useFaculty } from '../context/FacultyContext';

interface Message {
    id: number;
    role: 'user' | 'model';
    text: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'https://question-bank-app.onrender.com';

// Sparkle / brain icon for the floating button
const SparkleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
        <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
    </svg>
);

const SendIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
    </svg>
);

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
    </svg>
);

// Typing indicator dots
const TypingIndicator = () => (
    <div className="flex items-center gap-1 px-4 py-3">
        <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
        <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
        <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" />
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
    const { activeFaculty } = useFaculty();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const messageIdRef = useRef(1);

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

            const res = await fetch(`${API_URL}/api/chat-tutor`, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    message: trimmed,
                    history: buildHistory(),
                    images: [], // extend here to pass question image URLs if needed
                    faculty: activeFaculty,
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
        } catch (err: any) {
            const detail = err?.message || 'Unknown error';
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
                    bg-white dark:bg-[#111827]
                    rounded-2xl shadow-2xl shadow-black/20 dark:shadow-black/60
                    border border-gray-200 dark:border-gray-700/60
                    overflow-hidden
                `}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white flex-shrink-0">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                            <SparkleIcon />
                        </div>
                        <div>
                            <p className="font-semibold text-sm leading-tight">SAU AI Tutor</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
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
                                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white text-xs font-bold mr-2 flex-shrink-0 mt-0.5">
                                    AI
                                </div>
                            )}
                            <div
                                className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap
                                    ${msg.role === 'user'
                                        ? 'bg-emerald-600 text-white rounded-tr-sm'
                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-sm border border-gray-200 dark:border-gray-700/50'
                                    }
                                `}
                            >
                                {renderText(msg.text)}
                            </div>
                        </div>
                    ))}

                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white text-xs font-bold mr-2 flex-shrink-0 mt-0.5">
                                AI
                            </div>
                            <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-tl-sm border border-gray-200 dark:border-gray-700/50">
                                <TypingIndicator />
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input area */}
                <div className="px-3 py-3 border-t border-gray-200 dark:border-gray-700/60 bg-white dark:bg-[#111827] flex-shrink-0">
                    <div className="flex items-end gap-2 bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2">
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
                            className="flex-1 bg-transparent text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 resize-none focus:outline-none max-h-28 overflow-y-auto disabled:opacity-50"
                            style={{ minHeight: '24px' }}
                        />
                        <button
                            onClick={handleSend}
                            disabled={!input.trim() || isLoading}
                            id="ai-tutor-send-btn"
                            className="flex-shrink-0 w-8 h-8 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white rounded-lg flex items-center justify-center transition-colors disabled:cursor-not-allowed"
                            aria-label="Send message"
                        >
                            <SendIcon />
                        </button>
                    </div>
                    <p className="text-center text-[10px] text-gray-400 dark:text-gray-600 mt-1.5">
                        Faculty-specific answers · History clears on refresh
                    </p>
                </div>
            </div>

            {/* ── Floating Bubble Button ── */}
            <button
                onClick={() => setIsOpen((prev) => !prev)}
                id="ai-tutor-toggle-btn"
                aria-label={isOpen ? 'Close AI Tutor' : 'Open AI Tutor'}
                className={`fixed bottom-5 right-4 sm:right-6 z-50 w-14 h-14 rounded-full shadow-lg shadow-emerald-500/30
                    bg-gradient-to-br from-emerald-500 to-teal-600
                    text-white flex items-center justify-center
                    hover:scale-110 active:scale-95
                    transition-all duration-200
                    ${isOpen ? 'rotate-0' : 'rotate-0'}
                `}
            >
                {isOpen ? (
                    <CloseIcon />
                ) : (
                    <SparkleIcon />
                )}
                {/* Pulse ring when closed */}
                {!isOpen && (
                    <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-20 pointer-events-none" />
                )}
            </button>
        </>
    );
};

export default FloatingAITutor;
