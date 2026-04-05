import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { supabase } from '../lib/supabaseClient';
import { courseData } from '../data';

interface StudyMaterial {
    id: string;
    title: string;
    type: 'book' | 'note';
    level: string;
    semester: string;
    course_name: string;
    drive_link: string;
    created_at: string;
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
};

const MaterialCard = ({ m }: { m: StudyMaterial }) => {
    const cfg = TYPE_CONFIG[m.type];

    return (
        <div className="group bg-white dark:bg-[#1E293B] rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
            {/* Top accent bar */}
            <div className={`h-1.5 w-full ${m.type === 'book' ? 'bg-gradient-to-r from-indigo-500 to-purple-500' : 'bg-gradient-to-r from-amber-400 to-orange-500'}`} />

            <div className="p-6 flex flex-col flex-grow gap-4">
                {/* Icon + Title */}
                <div className="flex items-start gap-4">
                    <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${cfg.iconBg}`}>
                        {cfg.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-base text-gray-900 dark:text-white leading-snug line-clamp-2">
                            {m.title}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {new Date(m.created_at).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                    </div>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border ${cfg.badgeBg} ${cfg.badgeText} ${cfg.badgeBorder}`}>
                        {cfg.emoji} {cfg.label}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-800/50">
                        {m.level}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-100 dark:border-blue-800/50">
                        {m.semester}
                    </span>
                </div>

                {/* Course name */}
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-2 flex-grow">
                    {m.course_name}
                </p>

                {/* CTA Button */}
                <a
                    href={m.drive_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`mt-auto w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-white text-sm font-semibold shadow-md ${cfg.btnBg} ${cfg.btnShadow} hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    View / Download
                </a>
            </div>
        </div>
    );
};

const StudyMaterials = () => {
    const [materials, setMaterials] = useState<StudyMaterial[]>([]);
    const [loading, setLoading] = useState(true);

    const [filterLevel, setFilterLevel] = useState('');
    const [filterSemester, setFilterSemester] = useState('');
    const [filterCourse, setFilterCourse] = useState('');
    const [filterType, setFilterType] = useState('');

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
            setMaterials(data || []);
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

    const bookCount = materials.filter(m => m.type === 'book').length;
    const noteCount = materials.filter(m => m.type === 'note').length;

    return (
        <div className="space-y-8 animate-fade-in">
            <Helmet>
                <title>Study Materials — Books & Notes | SAU Agricultural Economics</title>
                <meta name="description" content="Browse curated books and notes for SAU Agricultural Economics courses. Filter by level, semester, and course to find the resources you need." />
            </Helmet>

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-2">
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
                    </div>
                )}
            </div>

            {/* Filter bar */}
            <div className="bg-white dark:bg-[#1E293B] p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 transition-all">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                    {/* Level */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1">Level</label>
                        <select
                            value={filterLevel}
                            onChange={(e) => setFilterLevel(e.target.value)}
                            className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none"
                        >
                            <option value="">All Levels</option>
                            {Object.keys(courseData).map((lvl) => (
                                <option key={lvl} value={lvl}>{lvl}</option>
                            ))}
                        </select>
                    </div>

                    {/* Semester */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1">Semester</label>
                        <select
                            value={filterSemester}
                            onChange={(e) => setFilterSemester(e.target.value)}
                            disabled={!filterLevel}
                            className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <option value="">All Semesters</option>
                            {availableSemesters.map((sem) => (
                                <option key={sem} value={sem}>{sem}</option>
                            ))}
                        </select>
                    </div>

                    {/* Course */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1">Course</label>
                        <select
                            value={filterCourse}
                            onChange={(e) => setFilterCourse(e.target.value)}
                            disabled={!filterSemester}
                            className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <option value="">All Courses</option>
                            {availableCourses.map((course) => (
                                <option key={course} value={course}>{course}</option>
                            ))}
                        </select>
                    </div>

                    {/* Type */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1">Type</label>
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none"
                        >
                            <option value="">All Types</option>
                            <option value="book">📘 Books</option>
                            <option value="note">📝 Notes</option>
                        </select>
                    </div>

                    {/* Reset */}
                    <div className="flex flex-col justify-end">
                        <button
                            onClick={clearFilters}
                            className="w-full h-[46px] bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-xl transition-colors outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600 flex items-center justify-center gap-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Reset
                        </button>
                    </div>
                </div>
            </div>

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
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                            {materials.map((m) => (
                                <MaterialCard key={m.id} m={m} />
                            ))}
                        </div>

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
