import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import ScrollReveal from '../components/ScrollReveal';
import FAQ from '../components/FAQ';
import RelatedPages from '../components/RelatedPages';
import Breadcrumb from '../components/Breadcrumb';
import type { FAQItem } from '../lib/faqData';

const agricultureFAQs: FAQItem[] = [
    {
        question: "Which Agriculture courses have the most question papers available?",
        answer: "Core courses like Crop Science, Soil Management, Agronomy, and Plant Pathology have the most papers — usually 3-5 years each. Specialized electives may have fewer depending on student contributions. Check individual course pages for exact availability."
    },
    {
        question: "Are practical exam questions included along with theory papers?",
        answer: "Yes, both theory and practical exam questions are included where available. Practical papers often include lab procedures, field experiment designs, and viva voce questions. Filter by semester to see what's available for your current coursework."
    },
    {
        question: "Can I contribute old Agriculture question papers I have?",
        answer: "Yes! Use the Upload form (requires login as Collector or Admin). Even a single semester's paper helps juniors preparing for the same course. Uploaded papers are reviewed and added within 24-48 hours. Your contribution is credited publicly on the Contributors page."
    },
    {
        question: "How do I prepare for Agriculture exams using these papers?",
        answer: "Start by identifying recurring topics across years — crop cycles, soil types, pest management strategies appear frequently. Practice drawing diagrams and flowcharts under timed conditions. Use the AI Tutor if you get stuck on concepts like photosynthesis mechanisms or fertilizer calculations."
    }
];

const SAUAgricultureQuestion = () => {
    return (
        <>
            <SEO
                title="SAU Agriculture Question Bank 2026 | All Levels & Courses"
                description="Previous year questions for SAU Agriculture faculty. Covers all 4 levels, 8 semesters and 60+ courses including Crop Science, Agronomy, and Soil Management."
                keywords="SAU Agriculture questions, Agriculture exam papers, SAU agriculture previous year questions, Sher-e-Bangla Agricultural University Agriculture faculty"
                canonicalPath="/sau-agriculture-question"
            />

            {/* Breadcrumb */}
            <Breadcrumb
                items={[
                    { label: 'Home', href: '/' },
                    { label: 'Faculties', href: '/questions' },
                    { label: 'Agriculture' }
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
                        SAU Agriculture Questions — All Levels (2026)
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto mb-8 leading-relaxed"
                    >
                        Access previous year exam papers for all 60+ Agriculture courses across 4 levels and 8 semesters. Filter by course code, browse by topic, and prepare effectively for midterms and finals.
                    </motion.p>

                    {/* Primary CTA */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="mb-6"
                    >
                        <Link
                            to="/questions?faculty=Agriculture"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-green-500 to-amber-500 hover:from-green-600 hover:to-amber-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Browse Agriculture Questions
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
                            <span>60+ Agriculture courses</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>4 levels, 8 semesters</span>
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
                            Stuck on an agriculture concept? Ask AI →
                        </Link>
                    </motion.div>
                </div>
            </ScrollReveal>

            {/* Available Levels Section */}
            <ScrollReveal direction="up" delay={0.1}>
                <div className="max-w-4xl mx-auto px-4 py-12">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
                        Agriculture Courses by Level
                    </h2>

                    <div className="grid md:grid-cols-2 gap-6">
                        {[
                            { level: 'Level-1', label: '1st Year', semesters: 'Semester 1 & 2', courses: '15 courses', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
                            { level: 'Level-2', label: '2nd Year', semesters: 'Semester 3 & 4', courses: '15 courses', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
                            { level: 'Level-3', label: '3rd Year', semesters: 'Semester 5 & 6', courses: '15 courses', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
                            { level: 'Level-4', label: '4th Year', semesters: 'Semester 7 & 8', courses: '15 courses', icon: 'M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z' }
                        ].map((item, index) => (
                            <Link
                                key={index}
                                to={`/questions?faculty=Agriculture&level=${item.level}`}
                                className="group block p-6 bg-white dark:bg-[#111827] rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-200"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                                        </svg>
                                    </div>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 group-hover:text-amber-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                    {item.label}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {item.semesters} • {item.courses}
                                </p>
                            </Link>
                        ))}
                    </div>

                    {/* AI Tutor Inline Prompt */}
                    <div className="mt-6 text-center text-sm">
                        <Link to="/?ai-tutor=open" className="text-green-600 dark:text-green-400 hover:underline inline-flex items-center gap-1">
                            Need help choosing your level? Ask AI →
                        </Link>
                    </div>
                </div>
            </ScrollReveal>

            {/* How to Use This Page Section */}
            <ScrollReveal direction="up" delay={0.1}>
                <div className="max-w-4xl mx-auto px-4 py-12">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
                        How to Find Agriculture Questions
                    </h2>

                    <div className="grid md:grid-cols-3 gap-6">
                        {/* Step 1 */}
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
                                <span className="text-xl font-bold text-green-600 dark:text-green-400">1</span>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                Select Your Level
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                                Choose 1st, 2nd, 3rd, or 4th year based on your current semester.
                            </p>
                        </div>

                        {/* Step 2 */}
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-full mb-4">
                                <span className="text-xl font-bold text-amber-600 dark:text-amber-400">2</span>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                Pick Your Course
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                                Filter by course code (e.g., AGR-101, SOIL-201) or browse by topic.
                            </p>
                        </div>

                        {/* Step 3 */}
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
                                <span className="text-xl font-bold text-blue-600 dark:text-blue-400">3</span>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                Practice & Prepare
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                                Review past papers, identify patterns, and use AI Tutor for doubts.
                            </p>
                        </div>
                    </div>

                    {/* AI Tutor Inline Prompt */}
                    <div className="mt-6 text-center text-sm">
                        <Link to="/?ai-tutor=open" className="text-green-600 dark:text-green-400 hover:underline inline-flex items-center gap-1">
                            Confused about course selection? Ask AI →
                        </Link>
                    </div>
                </div>
            </ScrollReveal>

            {/* Why Agriculture Students Use This Platform */}
            <ScrollReveal direction="up" delay={0.1}>
                <div className="max-w-4xl mx-auto px-4 py-12">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
                        Why Agriculture Students Use This Platform
                    </h2>

                    <div className="bg-white dark:bg-[#111827] rounded-xl border border-gray-200 dark:border-gray-700 p-8">
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <div>
                                    <strong className="text-gray-900 dark:text-white">Identify high-weightage topics:</strong>
                                    <span className="text-gray-700 dark:text-gray-300 ml-1">See which crop cycles, soil types, and pest management strategies appear every year — focus your study time there.</span>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <div>
                                    <strong className="text-gray-900 dark:text-white">No more scattered Telegram groups:</strong>
                                    <span className="text-gray-700 dark:text-gray-300 ml-1">All Agriculture questions organized by course code in one searchable place.</span>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <div>
                                    <strong className="text-gray-900 dark:text-white">Instant doubt clearing:</strong>
                                    <span className="text-gray-700 dark:text-gray-300 ml-1">Stuck on photosynthesis mechanisms or fertilizer calculations? Ask the AI tutor instead of waiting for classmates.</span>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <div>
                                    <strong className="text-gray-900 dark:text-white">Help juniors by contributing:</strong>
                                    <span className="text-gray-700 dark:text-gray-300 ml-1">Upload your old Agriculture papers and build your reputation in the SAU community.</span>
                                </div>
                            </li>
                        </ul>
                    </div>

                    {/* AI Tutor Inline Prompt */}
                    <div className="mt-6 text-center text-sm">
                        <Link to="/?ai-tutor=open" className="text-green-600 dark:text-green-400 hover:underline inline-flex items-center gap-1">
                            Want Agriculture study tips? Ask AI →
                        </Link>
                    </div>
                </div>
            </ScrollReveal>

            {/* FAQ Section */}
            <FAQ items={agricultureFAQs} title="Common Questions About Agriculture Exam Prep" />

            {/* Related Resources Section */}
            <RelatedPages
                pages={[
                    {
                        title: 'Economics Questions',
                        description: 'Browse Agricultural Economics faculty exam papers and practice questions.',
                        href: '/sau-economics-question',
                        icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                    },
                    {
                        title: 'Ask AI Tutor',
                        description: 'Get instant explanations for agriculture concepts and formulas.',
                        href: '/?ai-tutor=open',
                        icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z'
                    },
                    {
                        title: 'ASVM Questions',
                        description: 'Access Animal Science & Veterinary Medicine faculty exam papers.',
                        href: '/sau-asvm-question',
                        icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'
                    }
                ]}
            />
        </>
    );
};

export default SAUAgricultureQuestion;
