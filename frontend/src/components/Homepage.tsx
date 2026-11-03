import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useFaculty } from '../context/FacultyContext';
import SEO from './SEO';
import { seoConfig } from '../lib/seoConfig';
import FAQ from './FAQ';
import { homepageFAQs } from '../lib/faqData';
import { AcademicCapIcon, BookOpenIcon, DocumentTextIcon, RefreshIcon, UsersIcon } from './icons';

const Homepage = () => {
    const { activeFaculty } = useFaculty();

    return (
        <>
            <SEO {...seoConfig.homepage} />

            <section className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 lg:py-16">
                <div className="w-full max-w-5xl mx-auto">
                    <div className="flex flex-col items-center text-center space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, ease: 'easeOut' }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-surface-card border border-border-subtle text-sm font-semibold text-text-primary"
                        >
                            <AcademicCapIcon className="h-4 w-4 text-brand-primary" />
                            Built for SAU Students
                        </motion.div>

                        <motion.h1
                            className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-text-primary leading-tight"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
                        >
                            All SAU Questions, Notes &amp; AI Tutor in One Place
                        </motion.h1>

                        <motion.p
                            className="text-lg sm:text-xl text-text-muted max-w-2xl leading-relaxed"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
                        >
                            Access previous year questions, study materials, and get instant help from our AI tutor — built for Sher-e-Bangla Agricultural University students.
                        </motion.p>

                        <motion.div
                            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center items-center"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3, ease: 'easeOut' }}
                        >
                            <Link
                                to="/questions"
                                className="w-full sm:w-auto inline-flex min-h-11 items-center justify-center gap-2 px-8 py-3 bg-brand-primary hover:opacity-90 text-white font-semibold rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
                            >
                                <BookOpenIcon className="h-5 w-5" />
                                Browse Questions
                            </Link>

                            <Link
                                to="/study-materials"
                                className="w-full sm:w-auto inline-flex min-h-11 items-center justify-center gap-2 px-8 py-3 bg-brand-secondary hover:opacity-90 text-white font-semibold rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary focus-visible:ring-offset-2"
                            >
                                <DocumentTextIcon className="h-5 w-5" />
                                Get Study Materials
                            </Link>

                            <Link
                                to="/?ai-tutor=open"
                                className="w-full sm:w-auto inline-flex min-h-11 items-center justify-center gap-2 px-8 py-3 bg-surface-card border border-border-subtle hover:border-brand-primary text-text-primary font-semibold rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
                            >
                                <AcademicCapIcon className="h-5 w-5 text-brand-primary" />
                                Ask AI Tutor
                            </Link>
                        </motion.div>

                        <motion.div
                            className="flex flex-wrap justify-center gap-6 sm:gap-8 pt-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.4, ease: 'easeOut' }}
                        >
                            <div className="flex items-center gap-2 text-sm text-text-muted">
                                <BookOpenIcon className="h-4 w-4 text-brand-primary" />
                                <span>Covers 160+ courses</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-text-muted">
                                <UsersIcon className="h-4 w-4 text-brand-secondary" />
                                <span>Used by SAU students</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-text-muted">
                                <RefreshIcon className="h-4 w-4 text-brand-primary" />
                                <span>Updated regularly</span>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.45, ease: 'easeOut' }}
                            className="mt-2"
                        >
                            <Link
                                to="/sau-assignment-cover-page"
                                className="inline-flex min-h-11 items-center gap-2 px-4 py-2 rounded-md bg-surface-card border border-border-subtle text-sm font-medium text-text-primary hover:border-brand-primary transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
                            >
                                <DocumentTextIcon className="h-4 w-4 text-brand-primary" />
                                Free Cover Page Generator →
                            </Link>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.5, ease: 'easeOut' }}
                            className="text-xs text-text-muted uppercase tracking-wider font-medium"
                        >
                            Currently viewing: {activeFaculty}
                        </motion.div>
                    </div>
                </div>
            </section>

            <FAQ items={homepageFAQs} title="Common Questions from SAU Students" />
        </>
    );
};

export default Homepage;
