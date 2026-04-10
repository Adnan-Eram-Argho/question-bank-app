import { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { supabase } from '../lib/supabaseClient';
import { courseData } from '../data';
import { motion, animate } from 'framer-motion';
import HeroParticles from './HeroParticles';
import ScrollReveal from './ScrollReveal';

const StatCounter = ({ to, label }: { to: number, label: string }) => {
    const nodeRef = useRef<HTMLSpanElement>(null);
    useEffect(() => {
        const node = nodeRef.current;
        if (node) {
            const controls = animate(0, to, {
                duration: 2,
                ease: "easeOut",
                onUpdate(value) {
                    node.textContent = Math.round(value).toString() + "+";
                }
            });
            return () => controls.stop();
        }
    }, [to]);

    return (
        <div className="flex flex-col items-center justify-center p-4 bg-white/60 dark:bg-[#111827]/60 backdrop-blur-md rounded-2xl border border-[rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.07)] w-full">
            <span ref={nodeRef} className="text-3xl font-bold bg-gradient-to-r from-green-400 to-amber-400 bg-clip-text text-transparent">
                0+
            </span>
            <span className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold mt-1">{label}</span>
        </div>
    );
};

interface Question {
    id: number;
    image_url: string;
    image_urls?: string[];
    level: string;
    semester: string;
    course_name: string;
    question_type: string;
    uploaded_by: string;
    created_at: string;
}

const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
};

const gridVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.07 } },
};

const QuestionCard = ({ q }: { q: Question }) => {
    const images = q.image_urls && q.image_urls.length > 0 ? q.image_urls : (q.image_url ? [q.image_url] : []);

    return (
        <motion.div
            variants={cardVariants}
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            whileTap={{ scale: 0.98 }}
            viewport={{ once: true, margin: '-40px' }}
            className="group bg-white dark:bg-[#111827] rounded-2xl border border-[rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.07)] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] transition-all duration-300 flex flex-col h-full relative"
        >
            {/* Top accent bar */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-green-400 to-amber-400 z-20"></div>

            <div className="relative h-56 w-full bg-gray-100 dark:bg-[#0A0F1E] overflow-hidden border-b border-[rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.05)] flex">
                {images.length === 1 && (
                    <a href={images[0]} target="_blank" rel="noreferrer" className="w-full h-full block relative group/full">
                        <img
                            src={images[0]}
                            alt={`${q.course_name} Question Paper - ${q.level} ${q.semester} - ${q.question_type} (Page 1) | SAU Agricultural Economics`}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover/full:scale-[1.02]"
                            loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover/full:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                        <div className="absolute bottom-4 right-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm p-2 rounded-full text-gray-900 dark:text-white opacity-0 group-hover/full:opacity-100 translate-y-2 group-hover/full:translate-y-0 shadow-lg transition-all duration-300 hover:bg-primary-500 hover:text-white dark:hover:bg-primary-500 z-10" title="View Full Image">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                            </svg>
                        </div>
                    </a>
                )}
                {images.length > 1 && (
                    <>
                        <a href={images[0]} target="_blank" rel="noreferrer" className="w-1/2 h-full block relative border-r border-white/20 dark:border-gray-800 group/half flex-shrink-0">
                            <img
                                src={images[0]}
                                alt={`${q.course_name} Question Paper - ${q.level} ${q.semester} - ${q.question_type} (Page 1) | SAU Agricultural Economics`}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover/half:scale-[1.02]"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover/half:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                            <div className="absolute bottom-4 right-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm p-2 rounded-full text-gray-900 dark:text-white opacity-0 group-hover/half:opacity-100 translate-y-2 group-hover/half:translate-y-0 shadow-lg transition-all duration-300 hover:bg-primary-500 hover:text-white dark:hover:bg-primary-500 z-10" title="View Page 1">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                                </svg>
                            </div>
                        </a>
                        <a href={images[1]} target="_blank" rel="noreferrer" className="w-1/2 h-full block relative group/half flex-shrink-0">
                            <img
                                src={images[1]}
                                alt={`${q.course_name} Question Paper - ${q.level} ${q.semester} - ${q.question_type} (Page 2) | SAU Agricultural Economics`}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover/half:scale-[1.02]"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover/half:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                            <div className="absolute bottom-4 right-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm p-2 rounded-full text-gray-900 dark:text-white opacity-0 group-hover/half:opacity-100 translate-y-2 group-hover/half:translate-y-0 shadow-lg transition-all duration-300 hover:bg-primary-500 hover:text-white dark:hover:bg-primary-500 z-10" title="View Page 2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                                </svg>
                            </div>
                        </a>
                    </>
                )}
            </div>

            <div className="p-6 flex flex-col flex-grow">
                <h3 className="font-bold text-lg text-slate-900 dark:text-[#F1F5F9] mb-4 line-clamp-2 leading-tight">
                    {q.course_name}
                </h3>

                <div className="flex flex-wrap gap-2 mb-6 mt-auto">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400 border border-green-200/50 dark:border-green-500/20">
                        {q.level}
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border border-amber-200/50 dark:border-amber-500/20">
                        {q.semester}
                    </span>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${q.question_type === 'Theory'
                            ? 'bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400 border-purple-200/50 dark:border-purple-500/20'
                            : 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400 border-rose-200/50 dark:border-rose-500/20'
                        }`}>
                        {q.question_type}
                    </span>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-[rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.06)]">
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="truncate max-w-[120px]">{q.uploaded_by || 'Unknown'}</span>
                    </div>
                    <div className="text-xs text-gray-400 dark:text-gray-500">
                        {new Date(q.created_at).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const QuestionList = () => {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(true);

    const [filterLevel, setFilterLevel] = useState('');
    const [filterSemester, setFilterSemester] = useState('');
    const [filterCourse, setFilterCourse] = useState('');
    const [filterType, setFilterType] = useState('');

    const [availableSemesters, setAvailableSemesters] = useState<string[]>([]);
    const [availableCourses, setAvailableCourses] = useState<string[]>([]);

    useEffect(() => {
        if (filterLevel && courseData[filterLevel as keyof typeof courseData]) {
            const semesters = Object.keys(courseData[filterLevel as keyof typeof courseData]);
            setAvailableSemesters(semesters);
        } else {
            setAvailableSemesters([]);
        }
        setFilterSemester('');
        setFilterCourse('');
        setAvailableCourses([]);
    }, [filterLevel]);

    useEffect(() => {
        if (filterLevel && filterSemester) {
            const levelData = courseData[filterLevel as keyof typeof courseData];
            if (levelData && levelData[filterSemester as keyof typeof levelData]) {
                const courses = levelData[filterSemester as keyof typeof levelData];
                setAvailableCourses(courses);
            } else {
                setAvailableCourses([]);
            }
        } else {
            setAvailableCourses([]);
        }
        setFilterCourse('');
    }, [filterLevel, filterSemester]);

    useEffect(() => {
        const allThreeSet = filterLevel && filterSemester && filterCourse;
        const partialLSCSelection = (filterLevel || filterSemester || filterCourse) && !allThreeSet;
        if (partialLSCSelection && !filterType) return;
        fetchQuestions();
    }, [filterLevel, filterSemester, filterCourse, filterType]);

    const isFiltered = !!(filterLevel && filterSemester) || !!(filterCourse || filterType);

    const fetchQuestions = async () => {
        setLoading(true);
        try {
            let query = supabase.from('questions').select('*').order('created_at', { ascending: false });

            if (filterLevel) query = query.eq('level', filterLevel);
            if (filterSemester) query = query.eq('semester', filterSemester);
            if (filterCourse) query = query.eq('course_name', filterCourse);
            if (filterType) query = query.eq('question_type', filterType);

            const hasMinimumFilter = (filterLevel && filterSemester) || filterCourse || filterType;
            if (!hasMinimumFilter) {
                query = query.limit(10);
            }

            const { data, error } = await query;
            if (error) throw error;
            setQuestions(data || []);
        } catch (error) {
            console.error('Error fetching questions:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
    );

    const buildPageTitle = (): string => {
        const parts: string[] = [];
        if (filterCourse) parts.push(filterCourse);
        else if (filterLevel || filterSemester) parts.push('Question Repository');
        if (filterLevel) parts.push(filterLevel);
        if (filterSemester) parts.push(filterSemester);
        if (filterType) parts.push(filterType);
        if (parts.length === 0) return 'SAU Agricultural Economics Question Bank | Sher-e-Bangla Agricultural University';
        return `${parts.join(' | ')} | SAU Agricultural Economics Question Bank`;
    };

    const buildMetaDescription = (): string => {
        if (filterCourse && filterLevel && filterSemester) {
            return `Download and view ${filterCourse} past exam question papers for ${filterLevel} ${filterSemester}${filterType ? ` (${filterType})` : ''
                } at Sher-e-Bangla Agricultural University (SAU) Agricultural Economics faculty.`;
        }
        if (filterLevel && filterSemester) {
            return `Browse ${filterLevel} ${filterSemester}${filterType ? ` ${filterType}` : ''
                } past exam questions for the SAU Agricultural Economics faculty. Filter by course for more specific results.`;
        }
        if (filterType) {
            return `Browse ${filterType} past exam questions for the Agricultural Economics faculty of Sher-e-Bangla Agricultural University (SAU).`;
        }
        return 'Browse past exam questions for the Agricultural Economics faculty of Sher-e-Bangla Agricultural University (SAU). Search by level, semester, course, and question type.';
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <Helmet>
                <title>{buildPageTitle()}</title>
                <meta name="description" content={buildMetaDescription()} />
                <link rel="canonical" href="https://sau-agri-econ.vercel.app/" />
                <meta property="og:title" content={buildPageTitle()} />
                <meta property="og:description" content={buildMetaDescription()} />
                <meta property="og:url" content="https://sau-agri-econ.vercel.app/" />
                <meta property="og:type" content="website" />
            </Helmet>

            <div className="relative overflow-hidden flex flex-col items-center text-center max-w-4xl mx-auto py-8 lg:py-12 px-4 rounded-3xl">
                <HeroParticles />
                <div className="relative z-10 w-full flex flex-col items-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/50 dark:bg-[#111827]/50 backdrop-blur-md border border-[rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.07)] text-sm font-semibold text-slate-800 dark:text-slate-200 mb-6 shadow-sm"
                    >
                        <span className="animate-pulse">🌾</span> Agricultural Economics · SAU
                    </motion.div>

                    <motion.h1
                        className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent leading-tight mb-6"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.15, ease: 'easeOut' }}
                    >
                        Sher-e-Bangla Agricultural University Question Bank
                    </motion.h1>

                    <motion.p
                        className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.3, ease: 'easeOut' }}
                    >
                        The comprehensive repository of previous year exam papers for Agricultural Economics.
                    </motion.p>

                    <motion.div
                        className="w-full grid grid-cols-3 gap-4 mt-12"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.45, ease: 'easeOut' }}
                    >
                        <StatCounter to={385} label="Questions" />
                        <StatCounter to={58} label="Courses" />
                        <StatCounter to={3} label="Contributors" />
                    </motion.div>
                </div>
            </div>

            <ScrollReveal direction="up" delay={0.2}>
                <div className="bg-white/80 dark:bg-[#111827]/80 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-[rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.07)] transition-all">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 items-end">
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Level</label>
                        <select
                            value={filterLevel}
                            onChange={(e) => setFilterLevel(e.target.value)}
                            className="w-full px-4 py-3 bg-white dark:bg-[#0A0F1E] border border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.08)] text-slate-800 dark:text-slate-200 rounded-xl focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all outline-none appearance-none"
                            style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
                        >
                            <option value="">All Levels</option>
                            {Object.keys(courseData).map((lvl) => (
                                <option key={lvl} value={lvl}>{lvl}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Semester</label>
                        <select
                            value={filterSemester}
                            onChange={(e) => setFilterSemester(e.target.value)}
                            className="w-full px-4 py-3 bg-white dark:bg-[#0A0F1E] border border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.08)] text-slate-800 dark:text-slate-200 rounded-xl focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all outline-none disabled:opacity-50 disabled:bg-gray-50 dark:disabled:bg-[#0A0F1E]/50 appearance-none"
                            style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
                            disabled={!filterLevel}
                        >
                            <option value="">All Semesters</option>
                            {availableSemesters.map((sem) => (
                                <option key={sem} value={sem}>{sem}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Course</label>
                        <select
                            value={filterCourse}
                            onChange={(e) => setFilterCourse(e.target.value)}
                            className="w-full px-4 py-3 bg-white dark:bg-[#0A0F1E] border border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.08)] text-slate-800 dark:text-slate-200 rounded-xl focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all outline-none disabled:opacity-50 disabled:bg-gray-50 dark:disabled:bg-[#0A0F1E]/50 appearance-none"
                            style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
                            disabled={!filterSemester}
                        >
                            <option value="">All Courses</option>
                            {availableCourses.map((course) => (
                                <option key={course} value={course}>{course}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Type</label>
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="w-full px-4 py-3 bg-white dark:bg-[#0A0F1E] border border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.08)] text-slate-800 dark:text-slate-200 rounded-xl focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all outline-none appearance-none"
                            style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
                        >
                            <option value="">All Types</option>
                            <option value="Theory">Theory</option>
                            <option value="Practical">Practical</option>
                        </select>
                    </div>

                    <div className="flex flex-col justify-end h-full">
                        <motion.button
                            onClick={() => {
                                setFilterLevel('');
                                setFilterSemester('');
                                setFilterCourse('');
                                setFilterType('');
                            }}
                            whileTap={{ scale: 0.97 }}
                            className="group w-full h-[46px] bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold rounded-xl transition-colors outline-none focus:ring-2 focus:ring-slate-300 dark:focus:ring-slate-700 flex items-center justify-center gap-2 border border-[rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.08)]"
                        >
                            <motion.svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 text-slate-500 dark:text-slate-400 group-hover:text-amber-500 transition-colors"
                                fill="none" viewBox="0 0 24 24" stroke="currentColor"
                                whileTap={{ rotate: 180 }}
                                transition={{ duration: 0.3 }}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </motion.svg>
                            Reset
                        </motion.button>
                    </div>
                </div>
                </div>
            </ScrollReveal>

            <div className="space-y-4">
                <ScrollReveal direction="up">
                    <div className="flex justify-between items-center">
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            {isFiltered ? (
                                <>Found <span className="text-gray-900 dark:text-white font-bold">{questions.length}</span> question{questions.length !== 1 && 's'}</>
                            ) : (
                                <>Showing <span className="text-gray-900 dark:text-white font-bold">latest {questions.length}</span> question{questions.length !== 1 && 's'} &mdash; use filters to search all</>
                            )}
                        </p>
                    </div>
                </ScrollReveal>

                {questions.length === 0 ? (
                    <div className="bg-white dark:bg-[#1E293B] rounded-2xl border border-gray-100 dark:border-gray-800 p-12 text-center shadow-sm">
                        <div className="bg-gray-50 dark:bg-gray-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No questions found</h3>
                        <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                            Try adjusting your filters or check back later for new uploads.
                        </p>
                        {isFiltered && (
                            <button
                                onClick={() => {
                                    setFilterLevel('');
                                    setFilterSemester('');
                                    setFilterCourse('');
                                    setFilterType('');
                                }}
                                className="mt-6 text-primary-600 dark:text-primary-400 font-medium hover:underline"
                            >
                                Clear all filters
                            </button>
                        )}
                    </div>
                ) : (
                    <>
                        <motion.div
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
                            variants={gridVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: '-50px' }}
                        >
                            {questions.map((q) => (
                                <QuestionCard key={q.id} q={q} />
                            ))}
                        </motion.div>

                        {!isFiltered && (
                            <div className="text-center pt-4">
                                <p className="text-sm text-gray-400 dark:text-gray-500 mb-3">Looking for a specific question?</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Use the <span className="font-semibold text-gray-700 dark:text-gray-300">filters above</span> to search by level, semester, course, or type — results will load without any limit.
                                </p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default QuestionList;