import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import ScrollReveal from '../components/ScrollReveal';
import FAQ from '../components/FAQ';
import type { FAQItem } from '../lib/faqData';

const pdfFAQs: FAQItem[] = [
    {
        question: "Can I download all SAU question papers as a single PDF?",
        answer: "Not currently as one file. Each course's questions are displayed individually on the platform. To save them, use your browser's print function (Ctrl+P) and select 'Save as PDF' for each course. We're working on bulk PDF export, but for now this method gives you clean, printable files."
    },
    {
        question: "Are the question papers in PDF format or just web pages?",
        answer: "They're optimized web pages designed to look like clean documents. This makes them searchable, accessible on mobile, and faster to load than actual PDFs. If you need offline access, use your browser's 'Save as PDF' feature — it preserves formatting and works without internet."
    },
    {
        question: "How recent are the question papers available?",
        answer: "We prioritize the most recent 3-5 years of exams for each course. Older papers are added when students contribute them. The upload form lets you share any year you have — even a single semester's paper helps others. Check individual course pages for specific year availability."
    },
    {
        question: "Is there a difference between viewing online vs downloading PDF?",
        answer: "Online viewing is faster and lets you search within questions. Downloaded PDFs work offline and are easier to print or share via WhatsApp/email. Both show the same content — choose based on whether you need internet access or portability."
    }
];

const SAUQuestionBankPDF = () => {
    return (
        <>
            <SEO
                title="SAU Question Bank PDF 2026 | All Subjects Free Download"
                description="Download SAU previous year question papers as PDF for Agricultural Economics, Agriculture and ASVM. Free access for all students."
                keywords="SAU question bank PDF, SAU previous year questions PDF, Sher-e-Bangla Agricultural University question papers"
                canonicalPath="/sau-question-bank-pdf"
            />

            {/* Hero Section - Above the Fold */}
            <ScrollReveal direction="up">
                <div className="max-w-4xl mx-auto px-4 py-12 lg:py-16 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4"
                    >
                        SAU Question Bank PDF — All Subjects (2026)
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto mb-8 leading-relaxed"
                    >
                        Access previous year exam papers for all SAU faculties. Browse by course, filter by semester, and save as PDF for offline study. No registration required.
                    </motion.p>

                    {/* Primary CTA */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="mb-6"
                    >
                        <Link
                            to="/questions"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-green-500 to-amber-500 hover:from-green-600 hover:to-amber-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            Browse Question Papers
                        </Link>
                    </motion.div>

                    {/* Trust Signals */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="flex flex-wrap justify-center gap-6 text-sm text-gray-600 dark:text-gray-400"
                    >
                        <div className="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>160+ courses</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            <span>3 faculties</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>Free access</span>
                        </div>
                    </motion.div>

                    {/* AI Tutor Inline Prompt */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="mt-6 text-sm"
                    >
                        <Link to="/?ai-tutor=open" className="text-green-600 dark:text-green-400 hover:underline inline-flex items-center gap-1">
                            Stuck on a topic? Ask AI →
                        </Link>
                    </motion.div>
                </div>
            </ScrollReveal>

            {/* Available Faculties Section */}
            <ScrollReveal direction="up" delay={0.1}>
                <div className="max-w-4xl mx-auto px-4 py-12">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
                        Available Faculties
                    </h2>

                    <div className="grid md:grid-cols-3 gap-6">
                        {/* Agricultural Economics */}
                        <Link
                            to="/questions?faculty=AEC"
                            className="group block p-6 bg-white dark:bg-[#111827] rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-200"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 group-hover:text-green-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                Agricultural Economics
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                50+ courses covering microeconomics, macroeconomics, agricultural marketing, and farm management.
                            </p>
                        </Link>

                        {/* Agriculture */}
                        <Link
                            to="/questions?faculty=Agriculture"
                            className="group block p-6 bg-white dark:bg-[#111827] rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-200"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 group-hover:text-amber-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                Agriculture
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                60+ courses including crop science, soil management, agronomy, and agricultural extension.
                            </p>
                        </Link>

                        {/* ASVM */}
                        <Link
                            to="/questions?faculty=ASVM"
                            className="group block p-6 bg-white dark:bg-[#111827] rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-200"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                </div>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                Animal Science & Veterinary Medicine
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                50+ courses covering animal nutrition, veterinary pathology, livestock management, and dairy science.
                            </p>
                        </Link>
                    </div>

                    {/* AI Tutor Inline Prompt */}
                    <div className="mt-6 text-center text-sm">
                        <Link to="/?ai-tutor=open" className="text-green-600 dark:text-green-400 hover:underline inline-flex items-center gap-1">
                            Need help choosing courses? Ask AI →
                        </Link>
                    </div>
                </div>
            </ScrollReveal>

            {/* How to Access Section */}
            <ScrollReveal direction="up" delay={0.1}>
                <div className="max-w-4xl mx-auto px-4 py-12">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
                        How to Access Question Papers
                    </h2>

                    <div className="grid md:grid-cols-3 gap-6">
                        {/* Step 1 */}
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
                                <span className="text-xl font-bold text-green-600 dark:text-green-400">1</span>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                Select Faculty
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                                Choose your faculty from the dropdown: AEC, Agriculture, or ASVM.
                            </p>
                        </div>

                        {/* Step 2 */}
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-full mb-4">
                                <span className="text-xl font-bold text-amber-600 dark:text-amber-400">2</span>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                Filter by Course
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                                Pick your level, semester, and specific course code to narrow results.
                            </p>
                        </div>

                        {/* Step 3 */}
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
                                <span className="text-xl font-bold text-blue-600 dark:text-blue-400">3</span>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                View & Save
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                                Browse questions online or use Ctrl+P to save as PDF for offline study.
                            </p>
                        </div>
                    </div>

                    {/* AI Tutor Inline Prompt */}
                    <div className="mt-6 text-center text-sm">
                        <Link to="/?ai-tutor=open" className="text-green-600 dark:text-green-400 hover:underline inline-flex items-center gap-1">
                            Confused about filtering? Ask AI →
                        </Link>
                    </div>
                </div>
            </ScrollReveal>

            {/* Why SAU Students Use This Platform */}
            <ScrollReveal direction="up" delay={0.1}>
                <div className="max-w-4xl mx-auto px-4 py-12">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
                        Why SAU Students Use This Platform
                    </h2>

                    <div className="bg-white dark:bg-[#111827] rounded-xl border border-gray-200 dark:border-gray-700 p-8">
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <div>
                                    <strong className="text-gray-900 dark:text-white">Exam pattern recognition:</strong>
                                    <span className="text-gray-700 dark:text-gray-300 ml-1">See which topics repeat yearly and focus your study time accordingly.</span>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <div>
                                    <strong className="text-gray-900 dark:text-white">No scattered Telegram groups:</strong>
                                    <span className="text-gray-700 dark:text-gray-300 ml-1">Everything organized by faculty and course in one searchable place.</span>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <div>
                                    <strong className="text-gray-900 dark:text-white">Instant doubt clearing:</strong>
                                    <span className="text-gray-700 dark:text-gray-300 ml-1">Stuck on a question concept? Ask the AI tutor instead of waiting for classmates.</span>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <div>
                                    <strong className="text-gray-900 dark:text-white">Contribution rewards:</strong>
                                    <span className="text-gray-700 dark:text-gray-300 ml-1">Upload your old papers and help juniors — builds your reputation in the SAU community.</span>
                                </div>
                            </li>
                        </ul>
                    </div>

                    {/* AI Tutor Inline Prompt */}
                    <div className="mt-6 text-center text-sm">
                        <Link to="/?ai-tutor=open" className="text-green-600 dark:text-green-400 hover:underline inline-flex items-center gap-1">
                            Want study tips? Ask AI →
                        </Link>
                    </div>
                </div>
            </ScrollReveal>

            {/* FAQ Section */}
            <FAQ items={pdfFAQs} title="Common Questions About PDF Access" />

            {/* Related Resources Section */}
            <ScrollReveal direction="up" delay={0.1}>
                <div className="max-w-4xl mx-auto px-4 py-12">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
                        Related Resources
                    </h2>

                    <div className="grid md:grid-cols-3 gap-6">
                        {/* Study Materials */}
                        <Link
                            to="/study-materials"
                            className="group block p-6 bg-white dark:bg-[#111827] rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-200"
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                                    Study Materials
                                </h3>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Lecture notes, textbooks, and reference materials for all SAU courses.
                            </p>
                        </Link>

                        {/* AI Tutor */}
                        <Link
                            to="/?ai-tutor=open"
                            className="group block p-6 bg-white dark:bg-[#111827] rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-200"
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                                    AI Tutor
                                </h3>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Get instant explanations for difficult concepts from past exam questions.
                            </p>
                        </Link>

                        {/* Economics Questions */}
                        <Link
                            to="/sau-economics-question"
                            className="group block p-6 bg-white dark:bg-[#111827] rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-200"
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                    Economics Questions
                                </h3>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Dedicated page for Agricultural Economics faculty exam preparation.
                            </p>
                        </Link>
                    </div>
                </div>
            </ScrollReveal>
        </>
    );
};

export default SAUQuestionBankPDF;
