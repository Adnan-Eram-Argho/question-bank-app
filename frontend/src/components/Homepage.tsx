import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import HeroParticles from './HeroParticles';
import { useFaculty } from '../context/FacultyContext';
import SEO from './SEO';
import { seoConfig } from '../lib/seoConfig';
import FAQ from './FAQ';
import { homepageFAQs } from '../lib/faqData';

const Homepage = () => {
    const { activeFaculty } = useFaculty();

    return (
        <>
            <SEO {...seoConfig.homepage} />
            
            <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 lg:py-16">
                <div className="relative w-full max-w-5xl mx-auto">
                    <HeroParticles />

                    <div className="relative z-10 flex flex-col items-center text-center space-y-8">
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/50 dark:bg-[#111827]/50 backdrop-blur-md border border-[rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.07)] text-sm font-semibold text-slate-800 dark:text-slate-200 shadow-sm"
                    >
                        <span className="animate-pulse">🌾</span> Built for SAU Students
                    </motion.div>

                    {/* Main H1 */}
                    <motion.h1
                        className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent leading-tight"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
                    >
                        All SAU Questions, Notes & AI Tutor in One Place
                    </motion.h1>

                    {/* Subheading */}
                    <motion.p
                        className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
                    >
                        Access previous year questions, study materials, and get instant help from our AI tutor — built for Sher-e-Bangla Agricultural University students.
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                        className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center items-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3, ease: 'easeOut' }}
                    >
                        {/* Browse Questions */}
                        <Link
                            to="/questions"
                            className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-white dark:bg-[#1E293B] hover:bg-gray-50 dark:hover:bg-[#334155] text-slate-900 dark:text-white font-semibold rounded-xl border border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.1)] shadow-sm hover:shadow-md transition-all duration-200 focus:ring-2 focus:ring-green-500/50 outline-none"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            Browse Questions
                        </Link>

                        {/* Get Study Materials */}
                        <Link
                            to="/study-materials"
                            className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-white dark:bg-[#1E293B] hover:bg-gray-50 dark:hover:bg-[#334155] text-slate-900 dark:text-white font-semibold rounded-xl border border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.1)] shadow-sm hover:shadow-md transition-all duration-200 focus:ring-2 focus:ring-amber-500/50 outline-none"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-500 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Get Study Materials
                        </Link>

                        {/* Ask AI Tutor - Primary CTA */}
                        <Link
                            to="/?ai-tutor=open"
                            className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-green-500 to-amber-500 hover:from-green-600 hover:to-amber-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 focus:ring-2 focus:ring-green-400/50 outline-none relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-white/20 group-hover:bg-white/30 transition-colors"></div>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 relative z-10 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                            <span className="relative z-10">Ask AI Tutor</span>
                        </Link>
                    </motion.div>

                    {/* Trust Signals */}
                    <motion.div
                        className="flex flex-wrap justify-center gap-6 sm:gap-8 pt-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.4, ease: 'easeOut' }}
                    >
                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>Covers 160+ courses</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <span>Used by SAU students</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            <span>Updated regularly</span>
                        </div>
                    </motion.div>

                    {/* Faculty Indicator */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.5, ease: 'easeOut' }}
                        className="text-xs text-slate-500 dark:text-slate-500 uppercase tracking-wider font-medium"
                    >
                        Currently viewing: {activeFaculty}
                    </motion.div>
                </div>
            </div>
        </div>

            {/* FAQ Section */}
            <FAQ items={homepageFAQs} title="Common Questions from SAU Students" />
        </>
    );
};

export default Homepage;
