import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { supabase } from '../lib/supabaseClient';
import { courseData } from '../data';
import { motion } from 'framer-motion';
import ScrollReveal from './ScrollReveal';
import { useFaculty } from '../context/FacultyContext';
import { BookOpenIcon, DocumentTextIcon, UserIcon, ExternalLinkIcon } from './icons';

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
        Icon: BookOpenIcon,
    },
    note: {
        label: 'Note',
        Icon: DocumentTextIcon,
    },
    pdf: {
        label: 'Gen. PDF',
        Icon: DocumentTextIcon,
    },
} satisfies Record<StudyMaterial['type'], { label: string; Icon: typeof DocumentTextIcon }>;

const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
};



const MaterialCard = ({ m }: { m: StudyMaterial }) => {
    const cfg = TYPE_CONFIG[m.type];
    const TypeIcon = cfg.Icon;

    return (
        <motion.div
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            className="group bg-surface-card rounded-lg border border-border-subtle hover:border-brand-primary/50 transition-colors duration-150 overflow-hidden flex flex-col h-full"
        >
            <div className="p-6 flex flex-col flex-grow gap-4">
                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-md border border-border-subtle bg-surface-canvas flex items-center justify-center text-brand-primary">
                        <TypeIcon className="h-6 w-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-base text-text-primary leading-snug line-clamp-2">
                            {m.title}
                        </h3>
                        <p className="text-xs text-text-muted mt-1">
                            {new Date(m.created_at).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold border border-border-subtle text-text-muted">
                        <TypeIcon className="h-4 w-4 text-brand-primary" /> {cfg.label}
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-md text-xs font-semibold bg-surface-canvas text-text-primary border border-border-subtle">
                        {m.level}
                    </span>
                    {m.semester && (
                        <span className="inline-flex items-center px-3 py-1 rounded-md text-xs font-semibold bg-surface-canvas text-text-primary border border-border-subtle">
                            {m.semester}
                        </span>
                    )}
                </div>

                {m.course_name && (
                    <p className="text-sm text-text-muted leading-relaxed line-clamp-2 flex-grow">
                        {m.course_name}
                    </p>
                )}
                {!m.course_name && <div className="flex-grow"></div>}

                <div className="flex items-center gap-2 pt-2 mt-auto text-xs text-text-muted pb-2">
                    <UserIcon className="h-4 w-4" />
                    <span className="truncate font-medium">{m.users?.full_name || m.users?.email || 'Unknown'}</span>
                </div>

                <a
                    href={m.drive_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full min-h-11 flex items-center justify-center gap-2 py-2.5 px-4 rounded-md bg-brand-primary hover:opacity-90 text-white text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
                >
                    <ExternalLinkIcon />
                    View / Download
                </a>
            </div>
        </motion.div>
    );
};

const StudyMaterials = () => {
    const { activeFaculty } = useFaculty();
    const facultyData = courseData[activeFaculty] || {};

    const [searchParams, setSearchParams] = useSearchParams();

    const BATCH_SIZE = 9;
    const [materials, setMaterials] = useState<StudyMaterial[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const observerRef = useRef<IntersectionObserver | null>(null);
    const requestIdRef = useRef(0);
    
    // Cache for contributor data to avoid repeated API calls
    const contributorsCache = useRef<Map<string, { full_name: string; email: string }>>(new Map());

    const [totalCounts, setTotalCounts] = useState({ book: 0, note: 0, pdf: 0 });

    const [filterLevel, setFilterLevel] = useState('');
    const [filterSemester, setFilterSemester] = useState('');
    const [filterCourse, setFilterCourse] = useState('');
    const [filterType, setFilterType] = useState(() => searchParams.get('type') || '');

    useEffect(() => {
        const typeFromUrl = searchParams.get('type') || '';
        setFilterType(typeFromUrl);
    }, [searchParams]);

    const [availableSemesters, setAvailableSemesters] = useState<string[]>([]);
    const [availableCourses, setAvailableCourses] = useState<string[]>([]);

    useEffect(() => {
        setFilterLevel('');
        setFilterSemester('');
        setFilterCourse('');
        setAvailableSemesters([]);
        setAvailableCourses([]);
    }, [activeFaculty]);

    useEffect(() => {
        if (filterLevel && facultyData[filterLevel]) {
            setAvailableSemesters(Object.keys(facultyData[filterLevel] || {}));
        } else {
            setAvailableSemesters([]);
        }
        setFilterSemester('');
        setFilterCourse('');
        setAvailableCourses([]);
    }, [filterLevel]);

    useEffect(() => {
        if (filterLevel && filterSemester) {
            const levelData = facultyData[filterLevel] || {};
            if (levelData && levelData[filterSemester]) {
                setAvailableCourses(levelData[filterSemester]);
            } else {
                setAvailableCourses([]);
            }
        } else {
            setAvailableCourses([]);
        }
        setFilterCourse('');
    }, [filterLevel, filterSemester]);

    useEffect(() => {
        const fetchTotals = async () => {
            const [bookRes, noteRes, pdfRes] = await Promise.all([
                supabase.from('study_materials').select('id', { count: 'exact', head: true }).eq('type', 'book').eq('faculty', activeFaculty),
                supabase.from('study_materials').select('id', { count: 'exact', head: true }).eq('type', 'note').eq('faculty', activeFaculty),
                supabase.from('study_materials').select('id', { count: 'exact', head: true }).eq('type', 'pdf').eq('faculty', activeFaculty),
            ]);

            setTotalCounts({
                book: bookRes.count ?? 0,
                note: noteRes.count ?? 0,
                pdf: pdfRes.count ?? 0,
            });
        };
        fetchTotals();
    }, [activeFaculty]);

    const isFiltered = !!(filterLevel || filterSemester || filterCourse || filterType);

    /**
     * Fetches contributor names and enriches materials with user data.
     * Uses caching to prevent redundant API calls and merges data in a single state update.
     */
    const enrichWithContributors = useCallback(async (fetchedMaterials: StudyMaterial[]) => {
        const uploaderIds = Array.from(new Set(fetchedMaterials.map(m => m.uploader_id).filter((id): id is string => !!id)));
        
        if (uploaderIds.length === 0) {
            return fetchedMaterials;
        }

        try {
            // Check cache first
            const cachedContributors = new Map(contributorsCache.current);
            const uncachedIds = uploaderIds.filter(id => !cachedContributors.has(id));

            // Fetch only uncached contributors
            if (uncachedIds.length > 0) {
                const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://question-bank-app.onrender.com'}/api/contributors`);
                if (!response.ok) throw new Error('Network response not ok');
                
                const usersData = await response.json();
                const userMap = usersData.reduce((acc: Record<string, { full_name: string; email: string }>, user: { id: string; full_name: string; email: string }) => {
                    if (user.id) {
                        acc[user.id] = user;
                        contributorsCache.current.set(user.id, user);
                    }
                    return acc;
                }, {});

                // Merge cached and newly fetched
                uncachedIds.forEach(id => {
                    if (userMap[id]) {
                        cachedContributors.set(id, userMap[id]);
                    }
                });
            }

            // Enrich materials with contributor data in a single pass
            return fetchedMaterials.map(m => ({
                ...m,
                users: m.uploader_id ? cachedContributors.get(m.uploader_id) || null : null
            }));
        } catch (err) {
            console.error('[StudyMaterials] Failed to fetch contributors:', err);
            // Return materials without contributor data rather than failing completely
            return fetchedMaterials.map(m => ({
                ...m,
                users: m.uploader_id ? contributorsCache.current.get(m.uploader_id) || null : null
            }));
        }
    }, []);

    const fetchMaterials = useCallback(async (pageNum: number, isReset = false) => {
        const currentRequestId = ++requestIdRef.current;

        if (isReset) {
            setLoading(true);
            setMaterials([]);
            setHasMore(true);
        } else {
            setLoadingMore(true);
        }

        try {
            let query = supabase
                .from('study_materials')
                .select('*')
                .order('created_at', { ascending: false });

            if (activeFaculty) query = query.eq('faculty', activeFaculty);
            if (filterLevel) query = query.eq('level', filterLevel);
            if (filterSemester) query = query.eq('semester', filterSemester);
            if (filterCourse) query = query.eq('course_name', filterCourse);
            if (filterType) query = query.eq('type', filterType);

            const from = pageNum * BATCH_SIZE;
            const to = from + BATCH_SIZE - 1;
            query = query.range(from, to);

            const { data, error } = await query;
            if (error) throw error;

            const fetchedMaterials = data || [];

            // Check if this is still the latest request
            if (currentRequestId !== requestIdRef.current) {
                return;
            }

            // Enrich with contributor data before updating state
            const enrichedMaterials = await enrichWithContributors(fetchedMaterials);

            // Check again after async operation
            if (currentRequestId !== requestIdRef.current) {
                return;
            }

            // Single state update with enriched data
            if (isReset) {
                setMaterials(enrichedMaterials);
            } else {
                setMaterials(prev => [...prev, ...enrichedMaterials]);
            }

            if (fetchedMaterials.length < BATCH_SIZE) {
                setHasMore(false);
            }
        } catch (err) {
            if (currentRequestId === requestIdRef.current) {
                console.error('[StudyMaterials] Fetch error:', err);
            }
        } finally {
            if (currentRequestId === requestIdRef.current) {
                setLoading(false);
                setLoadingMore(false);
            }
        }
    }, [activeFaculty, filterLevel, filterSemester, filterCourse, filterType, enrichWithContributors]);

    useEffect(() => {
        setPage(0);
        fetchMaterials(0, true);
    }, [fetchMaterials]);

    useEffect(() => {
        if (page > 0) {
            fetchMaterials(page, false);
        }
    }, [page, fetchMaterials]);

    // ✅ Cleanup IntersectionObserver on unmount to prevent memory leaks
    useEffect(() => {
        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, []);

    const lastMaterialElementRef = useCallback((node: HTMLDivElement | null) => {
        if (loadingMore || !hasMore) return;
        if (observerRef.current) observerRef.current.disconnect();

        observerRef.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prev => prev + 1);
            }
        });

        if (node) observerRef.current.observe(node);
    }, [loadingMore, hasMore]);

    const clearFilters = () => {
        setFilterLevel('');
        setFilterSemester('');
        setFilterCourse('');
        setFilterType('');
        setSearchParams({});
    };

    const bookCount = totalCounts.book;
    const noteCount = totalCounts.note;
    const pdfCount = totalCounts.pdf;

    return (
        <div className="space-y-8 animate-fade-in">
            <Helmet>
                <title>Study Materials — Books, Notes & PDFs | SAU {activeFaculty}</title>
                <meta name="description" content={`Browse curated books, notes, and general PDFs for SAU ${activeFaculty} courses. Filter by level, semester, and course to find the resources you need.`} />
            </Helmet>

            <motion.div
                className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-2"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2, ease: 'easeOut' }}
            >
                <div>
                    <h1 className="text-2xl sm:text-3xl font-semibold text-text-primary leading-tight">
                        {activeFaculty} Study Materials
                    </h1>
                    <p className="text-text-muted mt-2">
                        Curated books and notes for SAU {activeFaculty}
                    </p>
                </div>

                {!loading && (
                    <div className="flex gap-3 flex-shrink-0">
                        <div className="flex items-center gap-2 px-4 py-2 bg-surface-card text-text-primary rounded-md text-sm font-semibold border border-border-subtle">
                            <BookOpenIcon className="h-4 w-4 text-brand-primary" /> {bookCount} Book{bookCount !== 1 ? 's' : ''}
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-surface-card text-text-primary rounded-md text-sm font-semibold border border-border-subtle">
                            <DocumentTextIcon className="h-4 w-4 text-brand-primary" /> {noteCount} Note{noteCount !== 1 ? 's' : ''}
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-surface-card text-text-primary rounded-md text-sm font-semibold border border-border-subtle">
                            <DocumentTextIcon className="h-4 w-4 text-brand-primary" /> {pdfCount} PDF{pdfCount !== 1 ? 's' : ''}
                        </div>
                    </div>
                )}
            </motion.div>

            <ScrollReveal direction="up" delay={0.2}>
                <div className="bg-surface-card p-6 rounded-lg border border-border-subtle">
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-5 items-end">
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Level</label>
                            <select
                                value={filterLevel}
                                onChange={(e) => setFilterLevel(e.target.value)}
                                className="w-full px-4 py-3 bg-surface-card bg-surface-canvas border border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.08)] text-slate-800 dark:text-slate-200 rounded-md focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all outline-none appearance-none"
                                style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
                            >
                                <option value="">All Levels</option>
                                {Object.keys(facultyData).map((lvl) => (
                                    <option key={lvl} value={lvl}>{lvl}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Semester</label>
                            <select
                                value={filterSemester}
                                onChange={(e) => setFilterSemester(e.target.value)}
                                disabled={!filterLevel}
                                className="w-full px-4 py-3 bg-surface-card bg-surface-canvas border border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.08)] text-slate-800 dark:text-slate-200 rounded-md focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all outline-none disabled:opacity-50 disabled:bg-gray-50 dark:disabled:bg-[#0A0F1E]/50 appearance-none"
                                style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
                            >
                                <option value="">All Semesters</option>
                                {availableSemesters.map((sem) => (
                                    <option key={sem} value={sem}>{sem}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Course</label>
                            <select
                                value={filterCourse}
                                onChange={(e) => setFilterCourse(e.target.value)}
                                disabled={!filterSemester}
                                className="w-full px-4 py-3 bg-surface-card bg-surface-canvas border border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.08)] text-slate-800 dark:text-slate-200 rounded-md focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all outline-none disabled:opacity-50 disabled:bg-gray-50 dark:disabled:bg-[#0A0F1E]/50 appearance-none"
                                style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
                            >
                                <option value="">All Courses</option>
                                {availableCourses.map((course) => (
                                    <option key={course} value={course}>{course}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Type</label>
                            <select
                                value={filterType}
                                onChange={(e) => {
                                    const newVal = e.target.value;
                                    setFilterType(newVal);
                                    if (newVal) {
                                        setSearchParams({ type: newVal });
                                    } else {
                                        setSearchParams({});
                                    }
                                }}
                                className="w-full px-4 py-3 bg-surface-card bg-surface-canvas border border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.08)] text-slate-800 dark:text-slate-200 rounded-md focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all outline-none appearance-none"
                                style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
                            >
                                <option value="">All Types</option>
                                <option value="book">Books</option>
                                <option value="note">Notes</option>
                                <option value="pdf">Gen. PDFs</option>
                            </select>
                        </div>

                        <div className="flex flex-col justify-end h-full">
                            <motion.button
                                onClick={clearFilters}
                                whileTap={{ scale: 0.97 }}
                                className="group w-full h-[46px] bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold rounded-md transition-colors outline-none focus:ring-2 focus:ring-slate-300 dark:focus:ring-slate-700 flex items-center justify-center gap-2 border border-[rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.08)]"
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
                {!loading && (
                    <p className="text-sm font-medium text-text-muted dark:text-text-muted">
                        {isFiltered
                            ? <><span className="text-gray-900 dark:text-white font-semibold">{materials.length}</span> material{materials.length !== 1 ? 's' : ''} found</>
                            : <>Showing <span className="text-gray-900 dark:text-white font-semibold">{materials.length}</span> material{materials.length !== 1 ? 's' : ''}</>
                        }
                    </p>
                )}

                {loading && materials.length === 0 ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500" />
                    </div>
                ) : materials.length === 0 ? (
                    <ScrollReveal direction="up">
                        <div className="bg-surface-card rounded-lg border border-border-subtle p-12 text-center">
                            <div className="bg-surface-canvas border border-border-subtle w-16 h-16 rounded-md flex items-center justify-center mx-auto mb-4 text-brand-primary">
                                <BookOpenIcon className="h-8 w-8" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No materials found</h3>
                            <p className="text-text-muted dark:text-text-muted max-w-sm mx-auto">
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
                    </ScrollReveal>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                            {materials.map((m, index) => {
                                if (materials.length === index + 1) {
                                    return (
                                        <div ref={lastMaterialElementRef} key={m.id}>
                                            <MaterialCard m={m} />
                                        </div>
                                    );
                                } else {
                                    return <MaterialCard key={m.id} m={m} />;
                                }
                            })}
                        </div>

                        {loadingMore && (
                            <div className="flex justify-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500" />
                            </div>
                        )}

                        {!hasMore && materials.length > 0 && (
                            <p className="text-center text-sm text-text-muted dark:text-text-muted pt-4">
                                You've reached the end of the list.
                            </p>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default StudyMaterials;
