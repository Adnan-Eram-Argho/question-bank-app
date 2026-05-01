import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import ScrollReveal from './ScrollReveal';
import type { FAQItem } from '../lib/faqData';

interface FAQProps {
    items: FAQItem[];
    title?: string;
}

const FAQ: React.FC<FAQProps> = ({ items, title = "Frequently Asked Questions" }) => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleAccordion = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    // Generate FAQPage JSON-LD schema for Google rich results
    const faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: items.map((item) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: item.answer
            }
        }))
    };

    return (
        <>
            {/* Inject structured data for SEO */}
            <Helmet>
                <script type="application/ld+json">
                    {JSON.stringify(faqSchema)}
                </script>
            </Helmet>

            <ScrollReveal direction="up" delay={0.1}>
                <div className="max-w-4xl mx-auto px-4 py-12 lg:py-16">
                    {/* Section Title */}
                    {title && (
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="text-3xl lg:text-4xl font-bold text-center mb-8 text-gray-900 dark:text-white"
                        >
                            {title}
                        </motion.h2>
                    )}

                    {/* FAQ Accordion */}
                    <div className="space-y-4">
                        {items.map((item, index) => {
                            const isOpen = openIndex === index;
                            const contentId = `faq-answer-${index}`;
                            const buttonId = `faq-question-${index}`;

                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: index * 0.05 }}
                                    className="bg-white dark:bg-[#111827] rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
                                >
                                    {/* Question Button */}
                                    <button
                                        id={buttonId}
                                        aria-expanded={isOpen}
                                        aria-controls={contentId}
                                        onClick={() => toggleAccordion(index)}
                                        className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-inset"
                                    >
                                        <span className="text-lg font-semibold text-gray-900 dark:text-white pr-4">
                                            {item.question}
                                        </span>
                                        <motion.svg
                                            animate={{ rotate: isOpen ? 180 : 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="w-5 h-5 text-gray-500 dark:text-gray-400 flex-shrink-0"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M19 9l-7 7-7-7"
                                            />
                                        </motion.svg>
                                    </button>

                                    {/* Answer Content */}
                                    <AnimatePresence initial={false}>
                                        {isOpen && (
                                            <motion.div
                                                id={contentId}
                                                aria-labelledby={buttonId}
                                                role="region"
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3, ease: 'easeInOut' }}
                                                className="overflow-hidden"
                                            >
                                                <div className="px-6 pb-5 pt-2">
                                                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                                        {item.answer}
                                                    </p>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* AI Tutor CTA - Always visible after FAQ */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="mt-12 text-center"
                    >
                        <p className="text-gray-600 dark:text-gray-400 mb-4 text-lg">
                            Still have questions? Ask our AI Tutor instantly.
                        </p>
                        <Link
                            to="/?ai-tutor=open"
                            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-500 to-amber-500 hover:from-green-600 hover:to-amber-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                        >
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                                />
                            </svg>
                            Ask AI Tutor
                        </Link>
                    </motion.div>
                </div>
            </ScrollReveal>
        </>
    );
};

export default FAQ;
