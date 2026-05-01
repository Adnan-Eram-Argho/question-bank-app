import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import ScrollReveal from '../components/ScrollReveal';
import FAQ from '../components/FAQ';
import RelatedPages from '../components/RelatedPages';
import Breadcrumb from '../components/Breadcrumb';
import type { FAQItem } from '../lib/faqData';

const notesFAQs: FAQItem[] = [
    {
        question: "What types of study materials are available in the notes section?",
        answer: "You'll find lecture notes, textbook summaries, reference PDFs, lab manuals, and exam preparation guides across all three faculties (Agricultural Economics, Agriculture, and ASVM). Materials are organized by course code and semester for easy navigation."
    },
    {
        question: "Can I download these notes for offline study?",
        answer: "Yes! Most notes are available as downloadable PDFs. Click on any note to view details and download options. Some materials may be view-only if they're linked from external sources like Google Drive or university portals."
    },
    {
        question: "How do I contribute my own lecture notes or study materials?",
        answer: "Use the Upload form (requires login as Collector or Admin). You can upload PDFs directly or share links to Google Drive/OneDrive folders. Uploaded materials are reviewed within 24-48 hours and credited to your profile on the Contributors page."
    },
    {
        question: "Are the notes updated regularly with current syllabus?",
        answer: "We prioritize recent materials from the last 2-3 academic years. Older notes are kept for reference but marked accordingly. If you find outdated content, please report it via the contact form so we can update or remove it."
    }
];

const SAUNotes = () => {
    return (
        <>
            <SEO
                title="SAU Lecture Notes & Study Materials 2026 | All Faculties"
                description="Access comprehensive lecture notes, textbooks, and study resources for SAU Agricultural Economics, Agriculture, and ASVM faculties. Free downloads for all students."
                keywords="SAU lecture notes, SAU study materials, Sher-e-Bangla Agricultural University notes, SAU textbooks PDF, AEC notes, Agriculture notes, ASVM notes"
                canonicalPath="/sau-notes"
            />

            {/* Breadcrumb */}
            <Breadcrumb
                items={[
                    { label: 'Home', href: '/' },
                    { label: 'Resources' },
                    { label: 'Lecture Notes' }
                ]}
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
                        SAU Lecture Notes & Study Materials (2026)
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto mb-8 leading-relaxed"
                    >
                        Access comprehensive lecture notes, textbook summaries, and reference materials for all SAU faculties. Download PDFs, browse by course, and supplement your exam preparation with quality study resources.
                    </motion.p>

                    {/* Primary CTA */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="mb-6"
                    >
                        <Link
                            to="/study-materials"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-green-500 to-amber-500 hover:from-green-600 hover:to-amber-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            Browse Study Materials
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
                            <span>500+ study materials</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                            <span>PDF downloads</span>
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
                            Need help understanding a topic? Ask AI →
                        </Link>
                    </motion.div>
                </div>
            </ScrollReveal>

            {/* Material Categories Section */}
            <ScrollReveal direction="up" delay={0.1}>
                <div className="max-w-4xl mx-auto px-4 py-12">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
                        Types of Study Materials
                    </h2>

                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            {
                                title: 'Lecture Notes',
                                description: 'Class notes, summaries, and key points from professors.',
                                icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
                                type: 'note',
                                iconBg: 'bg-green-100 dark:bg-green-900/30',
                                iconText: 'text-green-600 dark:text-green-400'
                            },
                            {
                                title: 'Textbook PDFs',
                                description: 'Reference books, e-books, and recommended readings.',
                                icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
                                type: 'book',
                                iconBg: 'bg-amber-100 dark:bg-amber-900/30',
                                iconText: 'text-amber-600 dark:text-amber-400'
                            },
                            {
                                title: 'General PDFs',
                                description: 'Practical guides, experiment procedures, and viva prep.',
                                icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z',
                                type: 'pdf',
                                iconBg: 'bg-blue-100 dark:bg-blue-900/30',
                                iconText: 'text-blue-600 dark:text-blue-400'
                            }
                        ].map((item, index) => (
                            <Link
                                key={index}
                                to={`/study-materials?type=${item.type}`}
                                className="group block p-6 bg-white dark:bg-[#111827] rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-200"
                            >
                                <div className={`p-3 ${item.iconBg} rounded-lg mb-4 inline-block`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${item.iconText}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                    {item.title}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {item.description}
                                </p>
                            </Link>
                        ))}
                    </div>

                    {/* AI Tutor Inline Prompt */}
                    <div className="mt-6 text-center text-sm">
                        <Link to="/?ai-tutor=open" className="text-green-600 dark:text-green-400 hover:underline inline-flex items-center gap-1">
                            Confused about which material to use? Ask AI →
                        </Link>
                    </div>
                </div>
            </ScrollReveal>

            {/* How to Use Study Materials Section */}
            <ScrollReveal direction="up" delay={0.1}>
                <div className="max-w-4xl mx-auto px-4 py-12">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
                        How to Use These Materials Effectively
                    </h2>

                    <div className="grid md:grid-cols-3 gap-6">
                        {/* Step 1 */}
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
                                <span className="text-xl font-bold text-green-600 dark:text-green-400">1</span>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                Match with Your Course
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                                Filter by faculty, level, and course code to find relevant materials.
                            </p>
                        </div>

                        {/* Step 2 */}
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-full mb-4">
                                <span className="text-xl font-bold text-amber-600 dark:text-amber-400">2</span>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                Cross-Reference with Questions
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                                Use notes alongside past papers to understand recurring topics better.
                            </p>
                        </div>

                        {/* Step 3 */}
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
                                <span className="text-xl font-bold text-blue-600 dark:text-blue-400">3</span>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                Clarify Doubts with AI
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                                Stuck on a concept? Ask the AI tutor for instant explanations.
                            </p>
                        </div>
                    </div>

                    {/* AI Tutor Inline Prompt */}
                    <div className="mt-6 text-center text-sm">
                        <Link to="/?ai-tutor=open" className="text-green-600 dark:text-green-400 hover:underline inline-flex items-center gap-1">
                            Want study strategy tips? Ask AI →
                        </Link>
                    </div>
                </div>
            </ScrollReveal>

            {/* Why Students Use This Resource */}
            <ScrollReveal direction="up" delay={0.1}>
                <div className="max-w-4xl mx-auto px-4 py-12">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
                        Why SAU Students Use This Resource
                    </h2>

                    <div className="bg-white dark:bg-[#111827] rounded-xl border border-gray-200 dark:border-gray-700 p-8">
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <div>
                                    <strong className="text-gray-900 dark:text-white">All materials in one place:</strong>
                                    <span className="text-gray-700 dark:text-gray-300 ml-1">No more searching through WhatsApp groups or asking seniors — everything organized by course.</span>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <div>
                                    <strong className="text-gray-900 dark:text-white">Downloadable PDFs:</strong>
                                    <span className="text-gray-700 dark:text-gray-300 ml-1">Study offline during commutes or when internet is slow. Print what you need.</span>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <div>
                                    <strong className="text-gray-900 dark:text-white">Recent and relevant:</strong>
                                    <span className="text-gray-700 dark:text-gray-300 ml-1">Materials from the last 2-3 years aligned with current syllabus and exam patterns.</span>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <div>
                                    <strong className="text-gray-900 dark:text-white">Contribute and earn recognition:</strong>
                                    <span className="text-gray-700 dark:text-gray-300 ml-1">Share your notes, get credited publicly, and help juniors succeed.</span>
                                </div>
                            </li>
                        </ul>
                    </div>

                    {/* AI Tutor Inline Prompt */}
                    <div className="mt-6 text-center text-sm">
                        <Link to="/?ai-tutor=open" className="text-green-600 dark:text-green-400 hover:underline inline-flex items-center gap-1">
                            Need help organizing your study plan? Ask AI →
                        </Link>
                    </div>
                </div>
            </ScrollReveal>

            {/* FAQ Section */}
            <FAQ items={notesFAQs} title="Common Questions About Study Materials" />

            {/* Related Resources Section */}
            <RelatedPages
                pages={[
                    {
                        title: 'Question Bank',
                        description: 'Practice with previous year exam questions for all faculties.',
                        href: '/questions',
                        icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                    },
                    {
                        title: 'Ask AI Tutor',
                        description: 'Get instant explanations for difficult concepts in your notes.',
                        href: '/?ai-tutor=open',
                        icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z'
                    },
                    {
                        title: 'Economics Questions',
                        description: 'Browse AEC faculty-specific exam papers and practice questions.',
                        href: '/sau-economics-question',
                        icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4'
                    }
                ]}
            />
        </>
    );
};

export default SAUNotes;
