import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { courseData } from '../data';
import { motion } from 'framer-motion';
import ScrollReveal from './ScrollReveal';
import { useFaculty } from '../context/FacultyContext';
import { AcademicCapIcon, ExpandIcon, UserIcon, EmptyStateIcon } from './icons';
import SEO from './SEO';

const StatCard = ({ value, label, loading }: { value: number; label: string; loading: boolean }) => (
    <div className="flex w-full min-w-0 flex-col items-center justify-center rounded-lg border border-border-subtle bg-surface-card p-2 sm:p-4">
        <span className="text-2xl font-semibold text-brand-primary sm:text-3xl">{loading ? 'Loading' : `${value}+`}</span>
        <span className="mt-1 text-center text-[10px] font-medium text-text-muted sm:text-xs">{label}</span>
    </div>
);

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
    users?: { full_name: string; email: string } | null;
}

const QuestionCard = ({ q, index, isFirstBatch }: { q: Question; index: number; isFirstBatch?: boolean }) => {
    const images = q.image_urls && q.image_urls.length > 0 ? q.image_urls : (q.image_url ? [q.image_url] : []);
    const uploaderName = q.users?.full_name || q.users?.email || q.uploaded_by || 'Unknown';
    
    // ✅ First 6 images (first 2 rows) load eagerly for better LCP
    const shouldLoadEagerly = isFirstBatch && index < 6;

    return (
        <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
                duration: 0.5,
                delay: index * 0.1,
                ease: [0.21, 0.47, 0.32, 0.98]
            }}
            whileTap={{ scale: 0.98 }}
            className="group bg-surface-card rounded-lg border border-border-subtle hover:border-brand-primary/50 overflow-hidden transition-colors duration-150 flex flex-col h-full relative"
        >
            <div className="relative h-56 w-full bg-surface-canvas overflow-hidden border-b border-border-subtle flex">
                {images.length === 1 && (
                    <a href={images[0]} target="_blank" rel="noreferrer" className="w-full h-full block relative group/full">
                        <img
                            src={images[0]}
                            alt={`${q.course_name} Question Paper - ${q.level} ${q.semester} - ${q.question_type} (Page 1) | SAU`}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover/full:scale-105"
                            loading={shouldLoadEagerly ? "eager" : "lazy"}
                            fetchPriority={shouldLoadEagerly ? "high" : "auto"}
                        />
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/full:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                        <div className="absolute bottom-4 right-4 bg-surface-card border border-border-subtle p-2 rounded-md text-text-primary opacity-0 group-hover/full:opacity-100 shadow-sm transition-opacity duration-150 z-10" title="View Full Image">
                            <ExpandIcon />
                        </div>
                    </a>
                )}
                {images.length > 1 && (
                    <>
                        <a href={images[0]} target="_blank" rel="noreferrer" className="w-1/2 h-full block relative border-r border-white/20 dark:border-gray-800 group/half flex-shrink-0">
                            <img
                                src={images[0]}
                                alt={`${q.course_name} Question Paper - ${q.level} ${q.semester} - ${q.question_type} (Page 1) | SAU`}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover/half:scale-105"
                                loading={shouldLoadEagerly ? "eager" : "lazy"}
                                fetchPriority={shouldLoadEagerly ? "high" : "auto"}
                            />
                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/half:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                            <div className="absolute bottom-4 right-4 bg-surface-card border border-border-subtle p-2 rounded-md text-text-primary opacity-0 group-hover/half:opacity-100 shadow-sm transition-opacity duration-150 z-10" title="View Page 1">
                                <ExpandIcon />
                            </div>
                        </a>
                        <a href={images[1]} target="_blank" rel="noreferrer" className="w-1/2 h-full block relative group/half flex-shrink-0">
                            <img
                                src={images[1]}
                                alt={`${q.course_name} Question Paper - ${q.level} ${q.semester} - ${q.question_type} (Page 2) | SAU`}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover/half:scale-[1.02]"
                                loading={shouldLoadEagerly ? "eager" : "lazy"}
                                fetchPriority={shouldLoadEagerly ? "high" : "auto"}
                            />
                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/half:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                            <div className="absolute bottom-4 right-4 bg-surface-card border border-border-subtle p-2 rounded-md text-text-primary opacity-0 group-hover/half:opacity-100 shadow-sm transition-opacity duration-150 z-10" title="View Page 2">
                                <ExpandIcon />
                            </div>
                            {images.length > 2 && (
                                <a
                                    href={images[2]}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="absolute top-4 left-4 bg-black/70 text-white text-xs font-semibold px-2.5 py-1 rounded-full hover:bg-black/90 transition-colors z-10"
                                    title={`View remaining ${images.length - 2} pages`}
                                >
                                    +{images.length - 2} more
                                </a>
                            )}
                        </a>
                    </>
                )}
            </div>

            <div className="flex flex-grow flex-col p-4 sm:p-6">
                <h3 className="font-semibold text-lg text-text-primary mb-2 line-clamp-2 leading-tight">
                    {q.course_name}
                </h3>

                <div className="flex flex-wrap gap-2 mt-auto">
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

                <div className="flex items-center justify-between pt-3 border-t border-border-subtle">
                    <div className="flex items-center gap-2 text-[11px] text-text-muted">
                        <UserIcon />
                        <span className="truncate max-w-[120px]">{uploaderName}</span>
                    </div>
                    <div className="text-[11px] text-text-muted">
                        {new Date(q.created_at).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const QuestionList = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const { activeFaculty } = useFaculty();
    const facultyData = courseData[activeFaculty] || {};

    const BATCH_SIZE = 9;
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState(false);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const observerRef = useRef<IntersectionObserver | null>(null);
    const contributorsCache = useRef<Map<string, { full_name: string; email: string }>>(new Map());
    
    // 🛡️ Add requestIdRef to prevent race conditions during rapid filter changes
    const requestIdRef = useRef(0);
    
    // Track initial mount to preserve URL params on first navigation
    const isInitialMount = useRef(true);

    // Stats states
    const [stats, setStats] = useState({ questions: 0, courses: 0, contributors: 0 });
    const [statsLoading, setStatsLoading] = useState(true);

    // Filter states (user-driven via dropdowns)
    const [filterLevel, setFilterLevel] = useState('');
    const [filterSemester, setFilterSemester] = useState('');
    const [filterCourse, setFilterCourse] = useState('');
    const [filterType, setFilterType] = useState('');

    const [availableSemesters, setAvailableSemesters] = useState<string[]>([]);
    const [availableCourses, setAvailableCourses] = useState<string[]>([]);

    // ✅ Cache for all contributors to avoid repeated API calls
    const allContributorsCache = useRef<{ data: Array<{ id: string; full_name: string; email: string }>; timestamp: number } | null>(null);
    const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache

    // ✅ Read URL params on mount to support deep-linking from landing pages
    useEffect(() => {
        const urlLevel = searchParams.get('level');
        const urlSemester = searchParams.get('semester');
        const urlCourse = searchParams.get('course');
        const urlType = searchParams.get('type');
        
        if (urlLevel) setFilterLevel(urlLevel);
        if (urlSemester) setFilterSemester(urlSemester);
        if (urlCourse) setFilterCourse(urlCourse);
        if (urlType) setFilterType(urlType);
    }, []); // Only on mount

    // Sync filter changes to URL parameters (only when user manually changes filters)
    useEffect(() => {
        // Skip the first render to avoid wiping URL params before they're read
        if (isInitialMount.current) return;

        const currentParams = new URLSearchParams(searchParams);
        const newParams = new URLSearchParams();
        
        if (filterLevel) newParams.set('level', filterLevel);
        if (filterSemester) newParams.set('semester', filterSemester);
        if (filterCourse) newParams.set('course', filterCourse);
        if (filterType) newParams.set('type', filterType);
        
        // Only update if params actually changed
        if (currentParams.toString() !== newParams.toString()) {
            setSearchParams(newParams, { replace: true });
        }
    }, [filterLevel, filterSemester, filterCourse, filterType]);

    // Calculate total unique courses from data.ts (static data, no need for useCallback)
    const calculateTotalCourses = () => {
        const allCourses = new Set<string>();
        Object.values(courseData).forEach((facultyData) => {
            Object.values(facultyData).forEach((levelData) => {
                Object.values(levelData).forEach((courses: string[]) => {
                    courses.forEach(course => allCourses.add(course));
                });
            });
        });
        return allCourses.size;
    };

    // ✅ Optimized: Fetch all contributors once with caching
    const fetchAllContributors = useCallback(async (): Promise<Array<{ id: string; full_name: string; email: string }>> => {
        const now = Date.now();
        
        // Return cached data if still valid
        if (allContributorsCache.current && (now - allContributorsCache.current.timestamp) < CACHE_DURATION) {
            return allContributorsCache.current.data;
        }

        try {
            const API_URL = import.meta.env.VITE_API_URL || 'https://question-bank-app.onrender.com';
            const response = await fetch(`${API_URL}/api/contributors`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Cache the result
            allContributorsCache.current = {
                data,
                timestamp: now
            };
            
            // Also populate the individual cache
            data.forEach((user: { id: string; full_name: string; email: string }) => {
                if (user.id) {
                    contributorsCache.current.set(user.id, user);
                }
                if (user.email) {
                    contributorsCache.current.set(user.email.toLowerCase(), user);
                }
            });
            
            return data;
        } catch (err) {
            console.error('[QuestionList] Failed to fetch contributors:', err);
            return [];
        }
    }, []);

    // ✅ Optimized: Fetch stats in parallel with caching
    useEffect(() => {
        const fetchStats = async () => {
            setStatsLoading(true);
            try {
                // Calculate courses from data.ts (static but comprehensive)
                const totalCourses = calculateTotalCourses();
                
                // Fetch questions count from database and contributors in parallel
                const [questionsResult, contributors] = await Promise.all([
                    supabase.from('questions').select('*', { count: 'exact', head: true }),
                    fetchAllContributors()
                ]);

                const questionsCount = questionsResult.count || 0;
                const contributorsCount = contributors.length;

                setStats({
                    questions: questionsCount,
                    courses: totalCourses,
                    contributors: contributorsCount
                });
            } catch (err) {
                console.error('[QuestionList] Failed to fetch stats:', err);
                // Fallback to calculated courses even if API fails
                setStats({
                    questions: 0,
                    courses: calculateTotalCourses(),
                    contributors: 0
                });
            } finally {
                setStatsLoading(false);
            }
        };

        fetchStats();
    }, []); // Empty deps - only run once on mount

    useEffect(() => {
        // On initial mount, preserve URL params (e.g. from landing page level cards)
        if (isInitialMount.current) {
            isInitialMount.current = false;
            if (searchParams.get('level')) return;
        }
        setFilterLevel('');
        setFilterSemester('');
        setFilterCourse('');
        setAvailableSemesters([]);
        setAvailableCourses([]);
    }, [activeFaculty]);

    useEffect(() => {
        if (filterLevel && facultyData[filterLevel]) {
            const semesters = Object.keys(facultyData[filterLevel] || {});
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
            const levelData = facultyData[filterLevel] || {};
            if (levelData && levelData[filterSemester]) {
                const courses = levelData[filterSemester];
                setAvailableCourses(courses);
            } else {
                setAvailableCourses([]);
            }
        } else {
            setAvailableCourses([]);
        }
        setFilterCourse('');
    }, [filterLevel, filterSemester]);

    // ✅ Preload contributors data on component mount to avoid delays during question fetching
    useEffect(() => {
        let isMounted = true;
        
        const preloadContributors = async () => {
            if (contributorsCache.current.size === 0 && isMounted) {
                await fetchAllContributors();
            }
        };
        
        preloadContributors();
        
        return () => {
            isMounted = false;
        };
    }, []); // Empty deps - only preload once

    const isFiltered = !!(filterLevel || filterSemester || filterCourse || filterType);

    const enrichWithContributors = useCallback(async (fetchedQuestions: Question[]) => {
        const uploaderKeys = Array.from(new Set(
            fetchedQuestions
                .map(q => q.uploaded_by)
                .filter((uploader): uploader is string => !!uploader)
        ));

        if (uploaderKeys.length === 0) {
            return fetchedQuestions;
        }

        try {
            // ✅ Use cached contributors (already preloaded on mount)
            const cachedContributors = new Map(contributorsCache.current);
            const uncachedKeys = uploaderKeys.filter(key => !cachedContributors.has(key) && !cachedContributors.has(key.toLowerCase()));

            // ✅ Only fetch if there are truly uncached IDs (should be rare after initial preload)
            if (uncachedKeys.length > 0) {
                const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://question-bank-app.onrender.com'}/api/contributors`);
                if (!response.ok) throw new Error('Network response not ok');
                
                const usersData = await response.json();
                const userMap = usersData.reduce((acc: Record<string, { full_name: string; email: string }>, user: { id: string; full_name: string; email: string }) => {
                    if (user.id) {
                        acc[user.id] = user;
                        contributorsCache.current.set(user.id, user);
                    }
                    if (user.email) {
                        acc[user.email.toLowerCase()] = user;
                        contributorsCache.current.set(user.email.toLowerCase(), user);
                    }
                    return acc;
                }, {});

                uncachedKeys.forEach(key => {
                    const contributor = userMap[key] || userMap[key.toLowerCase()];
                    if (contributor) {
                        cachedContributors.set(key, contributor);
                    }
                });
            }

            return fetchedQuestions.map(q => {
                const uploaderKey = q.uploaded_by;
                return {
                    ...q,
                    users: uploaderKey ? cachedContributors.get(uploaderKey) || cachedContributors.get(uploaderKey.toLowerCase()) || null : null
                };
            });
        } catch (err) {
            console.error('[QuestionList] Failed to fetch contributors:', err);
            return fetchedQuestions.map(q => {
                const uploaderKey = q.uploaded_by;
                return {
                    ...q,
                    users: uploaderKey ? contributorsCache.current.get(uploaderKey) || contributorsCache.current.get(uploaderKey.toLowerCase()) || null : null
                };
            });
        }
    }, []); // No dependencies - uses refs which don't trigger re-renders

    const fetchQuestions = useCallback(async (pageNum: number, isReset = false) => {
        const currentRequestId = ++requestIdRef.current;
        // ✅ Require complete filter selection (level, semester, course) to load any questions
        const hasAllRequiredFilters = filterLevel && filterSemester && filterCourse;
        
        if (!hasAllRequiredFilters) {
            setQuestions([]);
            setLoading(false);
            setLoadingMore(false);
            setHasMore(false);
            setLoadError(false);
            return;
        }

        if (isReset) {
            setLoading(true);
            setQuestions([]);
            setHasMore(true);
            setLoadError(false);
        } else {
            setLoadingMore(true);
        }

        let requestTimeout: number | undefined;
        try {
            let query = supabase.from('questions').select('*').order('created_at', { ascending: false });

            if (activeFaculty) query = query.eq('faculty', activeFaculty);
            if (filterLevel) query = query.eq('level', filterLevel);
            if (filterSemester) query = query.eq('semester', filterSemester);
            if (filterCourse) query = query.eq('course_name', filterCourse);
            if (filterType) query = query.eq('question_type', filterType);

            const from = pageNum * BATCH_SIZE;
            const to = from + BATCH_SIZE - 1;
            query = query.range(from, to);

            const controller = new AbortController();
            requestTimeout = window.setTimeout(() => controller.abort(), 15000);
            const { data, error } = await query.abortSignal(controller.signal);
            window.clearTimeout(requestTimeout);
            requestTimeout = undefined;
            if (error) throw error;

            // 🛡️ Check if this is still the latest request before updating state
            if (currentRequestId !== requestIdRef.current) {
                return;
            }

            const rawQuestions = data || [];
            if (isReset) {
                setQuestions(rawQuestions);
            } else {
                setQuestions(prev => [...prev, ...rawQuestions]);
            }

            if (rawQuestions.length < BATCH_SIZE) {
                setHasMore(false);
            }

            // Contributor profiles are optional card metadata: render questions first,
            // then fill in names when the separate API request completes.
            void enrichWithContributors(rawQuestions).then(enrichedQuestions => {
                const enrichedById = new Map(enrichedQuestions.map(question => [question.id, question]));
                setQuestions(current => current.map(question => enrichedById.get(question.id) || question));
            });
        } catch (error) {
            // Only log error if this is still the latest request
            if (currentRequestId === requestIdRef.current) {
                console.error('[QuestionList] Error fetching questions:', error);
                setLoadError(true);
            }
        } finally {
            if (requestTimeout !== undefined) window.clearTimeout(requestTimeout);
            // Only update loading state if this is still the latest request
            if (currentRequestId === requestIdRef.current) {
                setLoading(false);
                setLoadingMore(false);
            }
        }
    }, [activeFaculty, filterLevel, filterSemester, filterCourse, filterType, enrichWithContributors]);

    // ✅ Only trigger fetch when all required filters are set
    useEffect(() => {
        setPage(0);
        fetchQuestions(0, true);
    }, [fetchQuestions]);

    useEffect(() => {
        if (page > 0) {
            fetchQuestions(page, false);
        }
    }, [page, fetchQuestions]);

    // ✅ Cleanup IntersectionObserver on unmount
    useEffect(() => {
        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, []);

    const lastQuestionElementRef = useCallback((node: HTMLDivElement | null) => {
        if (loadingMore || !hasMore) return;
        if (observerRef.current) observerRef.current.disconnect();

        observerRef.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prev => prev + 1);
            }
        });

        if (node) observerRef.current.observe(node);
    }, [loadingMore, hasMore]);

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
        if (parts.length === 0) return `SAU ${activeFaculty} Question Bank | Sher-e-Bangla Agricultural University`;
        return `${parts.join(' | ')} | SAU ${activeFaculty} Question Bank`;
    };

    const buildMetaDescription = (): string => {
        if (filterCourse && filterLevel && filterSemester) {
            return `Download and view ${filterCourse} past exam question papers for ${filterLevel} ${filterSemester}${filterType ? ` (${filterType})` : ''
                } at Sher-e-Bangla Agricultural University (SAU) ${activeFaculty} faculty.`;
        }
        if (filterLevel && filterSemester) {
            return `Browse ${filterLevel} ${filterSemester}${filterType ? ` ${filterType}` : ''
                } past exam questions for the SAU ${activeFaculty} faculty. Filter by course for more specific results.`;
        }
        if (filterType) {
            return `Browse ${filterType} past exam questions for the ${activeFaculty} faculty of Sher-e-Bangla Agricultural University (SAU).`;
        }
        return `Browse past exam questions for the ${activeFaculty} faculty of Sher-e-Bangla Agricultural University (SAU). Search by level, semester, course, and question type.`;
    };

    const pageTitle = buildPageTitle();
    const pageDescription = buildMetaDescription();

    return (
        <div className="space-y-8 animate-fade-in">
            <SEO
                title={pageTitle}
                description={pageDescription}
                keywords={`SAU ${activeFaculty} questions, SAU ${filterLevel || ''} ${filterSemester || ''} ${filterCourse || ''} ${filterType || ''}, Sher-e-Bangla Agricultural University ${activeFaculty}, SAU previous year questions ${activeFaculty}`.trim()}
                canonicalPath="/questions"
            />

            <div className="relative flex flex-col items-center text-center max-w-4xl mx-auto py-8 lg:py-12 px-4 rounded-lg">
                <div className="relative z-10 w-full flex flex-col items-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-surface-card border border-border-subtle text-sm font-semibold text-text-primary mb-6"
                    >
                        <AcademicCapIcon className="h-4 w-4 text-brand-primary" /> {activeFaculty} · SAU
                    </motion.div>

                    <motion.h1
                        className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-text-primary leading-tight mb-6"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.15, ease: 'easeOut' }}
                    >
                        Sher-e-Bangla Agricultural University <br className="hidden sm:block" /><span className="text-brand-primary">{activeFaculty} Question Bank</span>
                    </motion.h1>

                    <motion.p
                        className="text-lg sm:text-xl text-text-muted max-w-2xl leading-relaxed"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.3, ease: 'easeOut' }}
                    >
                        The comprehensive repository of previous year exam papers for {activeFaculty}.
                    </motion.p>

                    <motion.div
                        className="mt-8 grid w-full grid-cols-3 gap-2 sm:mt-12 sm:gap-6"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.45, ease: 'easeOut' }}
                    >
                        <StatCard value={stats.questions} label="Questions" loading={statsLoading} />
                        <StatCard value={stats.courses} label="Courses" loading={statsLoading} />
                        <StatCard value={stats.contributors} label="Contributors" loading={statsLoading} />
                    </motion.div>
                </div>
            </div>

            <ScrollReveal direction="up" delay={0.2}>
                <div className="rounded-lg border border-border-subtle bg-surface-card p-4 sm:p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-5 items-end">
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Level</label>
                            <select
                                value={filterLevel}
                                onChange={(e) => setFilterLevel(e.target.value)}
                                className="w-full min-h-11 px-4 py-3 bg-surface-card border border-border-subtle text-text-primary rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 transition-colors appearance-none"
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
                                className="w-full min-h-11 px-4 py-3 bg-surface-card border border-border-subtle text-text-primary rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 transition-colors disabled:opacity-50 appearance-none"
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
                            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Course</label>
                            <select
                                value={filterCourse}
                                onChange={(e) => setFilterCourse(e.target.value)}
                                className="w-full min-h-11 px-4 py-3 bg-surface-card border border-border-subtle text-text-primary rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 transition-colors disabled:opacity-50 appearance-none"
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
                            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Type</label>
                            <select
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                                className="w-full min-h-11 px-4 py-3 bg-surface-card border border-border-subtle text-text-primary rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 transition-colors appearance-none"
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
                                className="group w-full min-h-11 bg-surface-card hover:bg-surface-canvas text-text-primary font-semibold rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 flex items-center justify-center gap-2 border border-border-subtle"
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
                        <p className="text-sm font-medium text-text-muted dark:text-text-muted">
                            {isFiltered ? (
                                <>Found <span className="text-gray-900 dark:text-white font-semibold">{questions.length}</span> question{questions.length !== 1 && 's'}</>
                            ) : (
                                <>Showing <span className="text-gray-900 dark:text-white font-semibold">{questions.length}</span> question{questions.length !== 1 && 's'}</>
                            )}
                        </p>
                    </div>
                </ScrollReveal>

                {loadError && (
                    <div role="alert" className="rounded-lg border border-border-subtle bg-surface-card p-5 text-center sm:p-6">
                        <h3 className="mb-2 text-lg font-semibold text-text-primary">Questions could not be loaded</h3>
                        <p className="mb-4 text-sm text-text-muted">Check your connection and try again.</p>
                        <button
                            type="button"
                            onClick={() => fetchQuestions(0, true)}
                            className="inline-flex min-h-11 items-center justify-center rounded-md bg-brand-primary px-5 py-2 font-semibold text-white transition-colors hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
                        >
                            Try again
                        </button>
                    </div>
                )}

                {questions.length === 0 && !loadError ? (
                    <div className="rounded-lg border border-border-subtle bg-surface-card p-6 text-center sm:p-12">
                        <div className="bg-surface-canvas w-16 h-16 rounded-md flex items-center justify-center mx-auto mb-4">
                            {!filterLevel && !filterSemester && !filterCourse ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            ) : (
                                <EmptyStateIcon className="h-8 w-8 text-text-muted" />
                            )}
                        </div>
                        {!filterLevel && !filterSemester && !filterCourse ? (
                            <>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Search for Questions</h3>
                                <p className="text-text-muted dark:text-text-muted max-w-md mx-auto">
                                    Use the filters above to find specific question papers. You must select a <span className="font-semibold text-primary-600 dark:text-primary-400">Level</span>, <span className="font-semibold text-primary-600 dark:text-primary-400">Semester</span>, and <span className="font-semibold text-primary-600 dark:text-primary-400">Course</span> to load results.
                                </p>
                            </>
                        ) : !filterLevel || !filterSemester || !filterCourse ? (
                            <>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Complete Your Selection</h3>
                                <p className="text-text-muted dark:text-text-muted max-w-md mx-auto">
                                    Please select a <span className="font-semibold text-primary-600 dark:text-primary-400">Level</span>,{' '}
                                    <span className="font-semibold text-primary-600 dark:text-primary-400">Semester</span>, and{' '}
                                    <span className="font-semibold text-primary-600 dark:text-primary-400">Course</span> to view related question papers.
                                </p>
                                <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-sm text-text-muted dark:text-text-muted">
                                    <span className={`px-3 py-1 rounded-full ${filterLevel ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-gray-100 dark:bg-gray-800'}`}>
                                        {filterLevel ? '✓ Level' : '1. Level'}
                                    </span>
                                    <span>→</span>
                                    <span className={`px-3 py-1 rounded-full ${filterSemester ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-gray-100 dark:bg-gray-800'}`}>
                                        {filterSemester ? '✓ Semester' : '2. Semester'}
                                    </span>
                                    <span>→</span>
                                    <span className={`px-3 py-1 rounded-full ${filterCourse ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-gray-100 dark:bg-gray-800'}`}>
                                        {filterCourse ? '✓ Course' : '3. Course'}
                                    </span>
                                </div>
                            </>
                        ) : (
                            <>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No questions found</h3>
                                <p className="text-text-muted dark:text-text-muted max-w-sm mx-auto">
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
                            </>
                        )}
                    </div>
                ) : questions.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-8">
                            {questions.map((q, index) => {
                                const isFirstBatch = page === 0;
                                if (questions.length === index + 1) {
                                    return (
                                        <div ref={lastQuestionElementRef} key={q.id}>
                                            <QuestionCard q={q} index={index} isFirstBatch={isFirstBatch} />
                                        </div>
                                    );
                                } else {
                                    return <QuestionCard key={q.id} q={q} index={index} isFirstBatch={isFirstBatch} />;
                                }
                            })}
                        </div>

                        {loadingMore && (
                            <div className="flex justify-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
                            </div>
                        )}

                        {!hasMore && questions.length > 0 && (
                            <p className="text-center text-sm text-text-muted dark:text-text-muted pt-4">
                                You've reached the end of the list.
                            </p>
                        )}
                    </>
                ) : null}
            </div>
        </div>
    );
};

export default QuestionList;
