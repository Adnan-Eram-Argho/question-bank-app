import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import ScrollReveal from '../components/ScrollReveal';
import FAQ from '../components/FAQ';
import RelatedPages from '../components/RelatedPages';
import Breadcrumb from '../components/Breadcrumb';
import type { FAQItem } from '../lib/faqData';

const admissionFAQs: FAQItem[] = [
    {
        question: "What subjects are covered in the SAU admission test preparation?",
        answer: "The admission test covers Biology, Chemistry, Physics, and English for undergraduate programs. For postgraduate admissions, subject-specific papers vary by faculty (Agricultural Economics, Agriculture, or ASVM). We provide sample questions and study guides for all levels."
    },
    {
        question: "Are there mock tests available for practice?",
        answer: "Yes! We offer timed mock tests that simulate the actual admission exam format. These include multiple-choice questions across all subjects with instant scoring and detailed explanations. Track your progress and identify weak areas before the real exam."
    },
    {
        question: "How should I prepare for the SAU admission test?",
        answer: "Start by reviewing the official syllabus for your target program. Practice with our sample questions daily, take weekly mock tests under timed conditions, and use the AI Tutor to clarify difficult concepts. Focus on Biology and Chemistry as they carry the most weight in undergraduate admissions."
    },
    {
        question: "Can I access previous years' admission test papers?",
        answer: "We maintain a collection of memory-based questions from recent admission tests shared by successful candidates. While official papers aren't released, these reconstructed questions help you understand the exam pattern, difficulty level, and frequently tested topics."
    }
];

const SAUAdmissionPreparation = () => {
    return (
        <>
            <SEO
                title="SAU Admission Test Preparation 2026 | Sample Questions & Mock Tests"
                description="Prepare for Sher-e-Bangla Agricultural University admission test with sample questions, mock tests, and study guides. Covers undergraduate and postgraduate programs."
                keywords="SAU admission test, Sher-e-Bangla Agricultural University admission, SAU entrance exam preparation, SAU admission sample questions, SAU mock test"
                canonicalPath="/sau-admission-preparation"
            />

            {/* Breadcrumb */}
            <Breadcrumb
                items={[
                    { label: 'Home', href: '/' },
                    { label: 'Resources' },
                    { label: 'Admission Preparation' }
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
                        SAU Admission Test Preparation (2026)
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto mb-8 leading-relaxed"
                    >
                        Prepare effectively for Sher-e-Bangla Agricultural University admission tests with sample questions, timed mock exams, and targeted study guides. Boost your confidence and maximize your score.
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
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                            </svg>
                            Start Practice Tests
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
                            <span>500+ sample questions</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>Timed mock tests</span>
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
                            Stuck on a concept? Ask AI →
                        </Link>
                    </motion.div>
                </div>
            </ScrollReveal>

            {/* Program Categories Section */}
            <ScrollReveal direction="up" delay={0.1}>
                <div className="max-w-4xl mx-auto px-4 py-12">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
                        Choose Your Program Level
                    </h2>

                    <div className="grid md:grid-cols-2 gap-6">
                        {[
                            {
                                level: 'Undergraduate (B.Sc)',
                                subjects: 'Biology, Chemistry, Physics, English',
                                duration: '2-hour exam',
                                icon: 'M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z',
                                iconBg: 'bg-green-100 dark:bg-green-900/30',
                                iconText: 'text-green-600 dark:text-green-400'
                            },
                            {
                                level: 'Postgraduate (M.Sc/PhD)',
                                subjects: 'Subject-specific papers by faculty',
                                duration: '3-hour exam',
                                icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
                                iconBg: 'bg-amber-100 dark:bg-amber-900/30',
                                iconText: 'text-amber-600 dark:text-amber-400'
                            }
                        ].map((item, index) => (
                            <Link
                                key={index}
                                to="/questions"
                                className="group block p-6 bg-white dark:bg-[#111827] rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-200"
                            >
                                <div className={`p-3 ${item.iconBg} rounded-lg mb-4 inline-block`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${item.iconText}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                    {item.level}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                    <strong>Subjects:</strong> {item.subjects}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    <strong>Duration:</strong> {item.duration}
                                </p>
                            </Link>
                        ))}
                    </div>

                    {/* AI Tutor Inline Prompt */}
                    <div className="mt-6 text-center text-sm">
                        <Link to="/?ai-tutor=open" className="text-green-600 dark:text-green-400 hover:underline inline-flex items-center gap-1">
                            Need help choosing your program? Ask AI →
                        </Link>
                    </div>
                </div>
            </ScrollReveal>

            {/* How to Prepare Section */}
            <ScrollReveal direction="up" delay={0.1}>
                <div className="max-w-4xl mx-auto px-4 py-12">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
                        How to Prepare Effectively
                    </h2>

                    <div className="grid md:grid-cols-3 gap-6">
                        {/* Step 1 */}
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
                                <span className="text-xl font-bold text-green-600 dark:text-green-400">1</span>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                Review the Syllabus
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                                Understand which topics carry the most weight and plan your study schedule accordingly.
                            </p>
                        </div>

                        {/* Step 2 */}
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-full mb-4">
                                <span className="text-xl font-bold text-amber-600 dark:text-amber-400">2</span>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                Practice Daily
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                                Solve 20-30 sample questions every day. Focus on weak areas identified through mock tests.
                            </p>
                        </div>

                        {/* Step 3 */}
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
                                <span className="text-xl font-bold text-blue-600 dark:text-blue-400">3</span>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                Take Mock Tests
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                                Simulate exam conditions weekly. Build speed, accuracy, and time management skills.
                            </p>
                        </div>
                    </div>

                    {/* AI Tutor Inline Prompt */}
                    <div className="mt-6 text-center text-sm">
                        <Link to="/?ai-tutor=open" className="text-green-600 dark:text-green-400 hover:underline inline-flex items-center gap-1">
                            Want a personalized study plan? Ask AI →
                        </Link>
                    </div>
                </div>
            </ScrollReveal>

            {/* Why Use This Resource */}
            <ScrollReveal direction="up" delay={0.1}>
                <div className="max-w-4xl mx-auto px-4 py-12">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
                        Why Students Use This Resource
                    </h2>

                    <div className="bg-white dark:bg-[#111827] rounded-xl border border-gray-200 dark:border-gray-700 p-8">
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <div>
                                    <strong className="text-gray-900 dark:text-white">Realistic exam simulation:</strong>
                                    <span className="text-gray-700 dark:text-gray-300 ml-1">Timed mock tests mirror the actual admission exam format, helping you build confidence and manage time effectively.</span>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <div>
                                    <strong className="text-gray-900 dark:text-white">Targeted practice:</strong>
                                    <span className="text-gray-700 dark:text-gray-300 ml-1">Focus on high-weightage subjects like Biology and Chemistry. Identify and strengthen weak areas before exam day.</span>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <div>
                                    <strong className="text-gray-900 dark:text-white">Instant doubt clearing:</strong>
                                    <span className="text-gray-700 dark:text-gray-300 ml-1">Stuck on a chemistry equation or biology concept? Ask the AI tutor for instant explanations instead of waiting for teachers.</span>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <div>
                                    <strong className="text-gray-900 dark:text-white">Track your progress:</strong>
                                    <span className="text-gray-700 dark:text-gray-300 ml-1">Monitor your mock test scores over time. See improvement trends and adjust your study strategy accordingly.</span>
                                </div>
                            </li>
                        </ul>
                    </div>

                    {/* AI Tutor Inline Prompt */}
                    <div className="mt-6 text-center text-sm">
                        <Link to="/?ai-tutor=open" className="text-green-600 dark:text-green-400 hover:underline inline-flex items-center gap-1">
                            Need motivation or study tips? Ask AI →
                        </Link>
                    </div>
                </div>
            </ScrollReveal>

            {/* FAQ Section */}
            <FAQ items={admissionFAQs} title="Common Questions About SAU Admission Test" />

            {/* Related Resources Section */}
            <RelatedPages
                pages={[
                    {
                        title: 'Question Bank',
                        description: 'Practice with previous year exam questions after admission.',
                        href: '/questions',
                        icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                    },
                    {
                        title: 'Ask AI Tutor',
                        description: 'Get instant help with difficult admission test concepts.',
                        href: '/?ai-tutor=open',
                        icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z'
                    },
                    {
                        title: 'Study Materials',
                        description: 'Access textbooks and lecture notes for deeper understanding.',
                        href: '/study-materials',
                        icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
                    }
                ]}
            />
        </>
    );
};

export default SAUAdmissionPreparation;
