import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { supabase } from '../lib/supabaseClient';
import { courseData } from '../data';
import { motion } from 'framer-motion';

interface StudyMaterial {
    id: string;
    title: string;
    type: 'book' | 'note' | 'pdf';
    level: string;
    semester: string;
    course_name: string;
    drive_link: string;
    created_at: string;
    uploader_id?: string;
    users?: { full_name: string; email: string } | null;
}

const TYPE_CONFIG = {
    book: {
        label: 'Book',
        emoji: '📘',
        badgeBg: 'bg-indigo-50 dark:bg-indigo-900/30',
        badgeText: 'text-indigo-700 dark:text-indigo-300',
        badgeBorder: 'border-indigo-100 dark:border-indigo-800/50',
        btnBg: 'bg-indigo-600 hover:bg-indigo-700',
        btnShadow: 'shadow-indigo-500/30',
        iconBg: 'bg-indigo-100 dark:bg-indigo-900/40',
        iconText: 'text-indigo-600 dark:text-indigo-400',
    },
    note: {
        label: 'Note',
        emoji: '📝',
        badgeBg: 'bg-amber-50 dark:bg-amber-900/30',
        badgeText: 'text-amber-700 dark:text-amber-300',
        badgeBorder: 'border-amber-100 dark:border-amber-800/50',
        btnBg: 'bg-amber-500 hover:bg-amber-600',
        btnShadow: 'shadow-amber-500/30',
        iconBg: 'bg-amber-100 dark:bg-amber-900/40',
        iconText: 'text-amber-600 dark:text-amber-400',
    },
    pdf: {
        label: 'Gen. PDF',
        emoji: '📄',
        badgeBg: 'bg-rose-50 dark:bg-rose-900/30',
        badgeText: 'text-rose-700 dark:text-rose-300',
        badgeBorder: 'border-rose-100 dark:border-rose-800/50',
        btnBg: 'bg-rose-600 hover:bg-rose-700',
        btnShadow: 'shadow-rose-500/30',
        iconBg: 'bg-rose-100 dark:bg-rose-900/40',
        iconText: 'text-rose-600 dark:text-rose-400',
    },
};

const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
};

const gridVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.07 } },
};

const MaterialCard = ({ m }: { m: StudyMaterial }) => {
    const cfg = TYPE_CONFIG[m.type];

    return (
        <motion.div
            variants={cardVariants}
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            whileTap={{ scale: 0.98 }}
            className="group bg-white dark:bg-[#111827] rounded-2xl border border-[rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.07)] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:-translate-y-1 transition-all duration-300 flex flex-col h-full relative"
        >
            {/* Top accent bar */}
            <div className={`h-1.5 w-full ${m.type === 'book' ? 'bg-gradient-to-r from-indigo-500 to-purple-500' : m.type === 'note' ? 'bg-gradient-to-r from-amber-400 to-orange-500' : 'bg-gradient-to-r from-rose-400 to-red-500'}`} />

            <div className="p-6 flex flex-col flex-grow gap-4">
                {/* Icon + Title */}
                <div className="flex items-start gap-4">
                    <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${cfg.iconBg}`}>
                        {cfg.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-base text-slate-900 dark:text-[#F1F5F9] leading-snug line-clamp-2">
                            {m.title}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {new Date(m.created_at).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                    </div>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${cfg.badgeBg} ${cfg.badgeText} ${cfg.badgeBorder}`}>
                        {cfg.emoji} {cfg.label}
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400 border border-green-200/50 dark:border-green-500/20">
                        {m.level}
                    </span>
                    {m.semester && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border border-amber-200/50 dark:border-amber-500/20">
                            {m.semester}
                        </span>
                    )}
                </div>

                {/* Course name */}
                {m.course_name && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-2 flex-grow">
                        {m.course_name}
                    </p>
                )}
                {!m.course_name && <div className="flex-grow"></div>}

                <div className="flex items-center gap-2 pt-2 mt-auto text-xs text-gray-500 dark:text-gray-400 pb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="truncate font-medium">{m.users?.full_name || m.users?.email || 'Unknown Contributor'}</span>
                </div>

                {/* CTA Button */}
                <a
                    href={m.drive_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-white text-sm font-semibold shadow-md ${cfg.btnBg} ${cfg.btnShadow} hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    View / Download
                </a>
            </div>
        </motion.div>
    );
};

const StudyMaterials = () => {
    const [searchParams] = useSearchParams();
    const [materials, setMaterials] = useState<StudyMaterial[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalCounts, setTotalCounts] = useState({ book: 0, note: 0, pdf: 0 });

    const [filterLevel, setFilterLevel] = useState('');
    const [filterSemester, setFilterSemester] = useState('');
    const [filterCourse, setFilterCourse] = useState('');
    const [filterType, setFilterType] = useState(() => searchParams.get('type') || '');

    // Sync filterType when URL query param changes (e.g. clicking Books vs Notes in nav)
    useEffect(() => {
        const typeFromUrl = searchParams.get('type') || '';
        setFilterType(typeFromUrl);
    }, [searchParams]);

    const [availableSemesters, setAvailableSemesters] = useState<string[]>([]);
    const [availableCourses, setAvailableCourses] = useState<string[]>([]);

    // Cascade: Level → Semesters
    useEffect(() => {
        if (filterLevel && courseData[filterLevel as keyof typeof courseData]) {
            setAvailableSemesters(Object.keys(courseData[filterLevel as keyof typeof courseData]));
        } else {
            setAvailableSemesters([]);
        }
        setFilterSemester('');
        setFilterCourse('');
        setAvailableCourses([]);
    }, [filterLevel]);

    // Cascade: Semester → Courses
    useEffect(() => {
        if (filterLevel && filterSemester) {
            const levelData = courseData[filterLevel as keyof typeof courseData];
            if (levelData && levelData[filterSemester as keyof typeof levelData]) {
                setAvailableCourses(levelData[filterSemester as keyof typeof levelData]);
            } else {
                setAvailableCourses([]);
            }
        } else {
            setAvailableCourses([]);
        }
        setFilterCourse('');
    }, [filterLevel, filterSemester]);

    // Fetch real totals once on mount, independent of active filters
    useEffect(() => {
        const fetchTotals = async () => {
            const { data } = await supabase
                .from('study_materials')
                .select('type');
            if (data) {
                setTotalCounts({
                    book: data.filter(m => m.type === 'book').length,
                    note: data.filter(m => m.type === 'note').length,
                    pdf:  data.filter(m => m.type === 'pdf').length,
                });
            }
        };
        fetchTotals();
    }, []);

    useEffect(() => {
        fetchMaterials();
    }, [filterLevel, filterSemester, filterCourse, filterType]);

    const fetchMaterials = async () => {
        setLoading(true);
        try {
            let query = supabase
                .from('study_materials')
                .select('*')
                .order('created_at', { ascending: false });

            if (filterLevel) query = query.eq('level', filterLevel);
            if (filterSemester) query = query.eq('semester', filterSemester);
            if (filterCourse) query = query.eq('course_name', filterCourse);
            if (filterType) query = query.eq('type', filterType);

            const hasFilter = filterLevel || filterSemester || filterCourse || filterType;
            if (!hasFilter) query = query.limit(20);

            const { data, error } = await query;
            if (error) throw error;
            
            let fetchedMaterials = data || [];

            if (fetchedMaterials.length > 0) {
                const uploaderIds = Array.from(new Set(fetchedMaterials.map(m => m.uploader_id).filter(id => id)));
                if (uploaderIds.length > 0) {
                    const { data: usersData, error: usersError } = await supabase
                        .from('users')
                        .select('id, full_name, email')
                        .in('id', uploaderIds);
                        
                    if (!usersError && usersData) {
                        const userMap = usersData.reduce((acc: any, user: any) => {
                            acc[user.id] = user;
                            return acc;
                        }, {});
                        fetchedMaterials = fetchedMaterials.map(m => ({
                            ...m,
                            users: m.uploader_id ? userMap[m.uploader_id] : null
                        }));
                    }
                }
            }
            
            setMaterials(fetchedMaterials);
        } catch (err) {
            console.error('[StudyMaterials] Fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    const clearFilters = () => {
        setFilterLevel('');
        setFilterSemester('');
        setFilterCourse('');
        setFilterType('');
    };

    const isFiltered = !!(filterLevel || filterSemester || filterCourse || filterType);

    const bookCount = totalCounts.book;
    const noteCount = totalCounts.note;
    const pdfCount = totalCounts.pdf;

    return (
        <div className="space-y-8 animate-fade-in">
            <Helmet>
                <title>Study Materials — Books, Notes & PDFs | SAU Agricultural Economics</title>
                <meta name="description" content="Browse curated books, notes, and general PDFs for SAU Agricultural Economics courses. Filter by level, semester, and course to find the resources you need." />
            </Helmet>

            {/* Header */}
            <motion.div
                className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-2"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2, ease: 'easeOut' }}
            >
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent leading-tight">
                        Study Materials
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">
                        Curated books and notes for SAU Agricultural Economics
                    </p>
                </div>

                {/* Summary stats */}
                {!loading && (
                    <div className="flex gap-3 flex-shrink-0">
                        <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-xl text-sm font-semibold border border-indigo-100 dark:border-indigo-800/50">
                            📘 {bookCount} Book{bookCount !== 1 ? 's' : ''}
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-xl text-sm font-semibold border border-amber-100 dark:border-amber-800/50">
                            📝 {noteCount} Note{noteCount !== 1 ? 's' : ''}
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 rounded-xl text-sm font-semibold border border-rose-100 dark:border-rose-800/50">
                            📄 {pdfCount} PDF{pdfCount !== 1 ? 's' : ''}
                        </div>
                    </div>
                )}
            </motion.div>

            {/* Filter bar */}
            <motion.div 
                className="bg-white/80 dark:bg-[#111827]/80 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-[rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.07)] transition-all"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
            >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 items-end">
                    {/* Level */}
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

                    {/* Semester */}
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Semester</label>
                        <select
                            value={filterSemester}
                            onChange={(e) => setFilterSemester(e.target.value)}
                            disabled={!filterLevel}
                            className="w-full px-4 py-3 bg-white dark:bg-[#0A0F1E] border border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.08)] text-slate-800 dark:text-slate-200 rounded-xl focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all outline-none disabled:opacity-50 disabled:bg-gray-50 dark:disabled:bg-[#0A0F1E]/50 appearance-none"
                            style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
                        >
                            <option value="">All Semesters</option>
                            {availableSemesters.map((sem) => (
                                <option key={sem} value={sem}>{sem}</option>
                            ))}
                        </select>
                    </div>

                    {/* Course */}
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Course</label>
                        <select
                            value={filterCourse}
                            onChange={(e) => setFilterCourse(e.target.value)}
                            disabled={!filterSemester}
                            className="w-full px-4 py-3 bg-white dark:bg-[#0A0F1E] border border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.08)] text-slate-800 dark:text-slate-200 rounded-xl focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all outline-none disabled:opacity-50 disabled:bg-gray-50 dark:disabled:bg-[#0A0F1E]/50 appearance-none"
                            style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
                        >
                            <option value="">All Courses</option>
                            {availableCourses.map((course) => (
                                <option key={course} value={course}>{course}</option>
                            ))}
                        </select>
                    </div>

                    {/* Type */}
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Type</label>
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="w-full px-4 py-3 bg-white dark:bg-[#0A0F1E] border border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.08)] text-slate-800 dark:text-slate-200 rounded-xl focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all outline-none appearance-none"
                            style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
                        >
                            <option value="">All Types</option>
                            <option value="book">📘 Books</option>
                            <option value="note">📝 Notes</option>
                            <option value="pdf">📄 Gen. PDFs</option>
                        </select>
                    </div>

                    {/* Reset */}
                    <div className="flex flex-col justify-end h-full">
                        <motion.button
                            onClick={clearFilters}
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
            </motion.div>

            {/* Results */}
            <div className="space-y-4">
                {!loading && (
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {isFiltered
                            ? <><span className="text-gray-900 dark:text-white font-bold">{materials.length}</span> material{materials.length !== 1 ? 's' : ''} found</>
                            : <>Showing <span className="text-gray-900 dark:text-white font-bold">latest {materials.length}</span> material{materials.length !== 1 ? 's' : ''} — use filters to search all</>
                        }
                    </p>
                )}

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500" />
                    </div>
                ) : materials.length === 0 ? (
                    <div className="bg-white dark:bg-[#1E293B] rounded-2xl border border-gray-100 dark:border-gray-800 p-12 text-center shadow-sm">
                        <div className="bg-gray-50 dark:bg-gray-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                            📚
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No materials found</h3>
                        <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                            No books or notes match your current filters. Try adjusting or resetting them.
                        </p>
                        {isFiltered && (
                            <button
                                onClick={clearFilters}
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
                            {materials.map((m) => (
                                <MaterialCard key={m.id} m={m} />
                            ))}
                        </motion.div>

                        {!isFiltered && (
                            <div className="text-center pt-4">
                                <p className="text-sm text-gray-400 dark:text-gray-500 mb-3">Looking for something specific?</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Use the <span className="font-semibold text-gray-700 dark:text-gray-300">filters above</span> to search by level, semester, course, or type.
                                </p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default StudyMaterials;
