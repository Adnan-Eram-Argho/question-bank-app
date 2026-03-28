import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { courseData } from '../data';

interface Question {
    id: number;
    image_url: string;
    level: string;
    semester: string;
    course_name: string;
    question_type: string;
    uploaded_by: string;
    created_at: string;
}

const QuestionList = () => {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(true);

    // Filter States
    const [filterLevel, setFilterLevel] = useState('');
    const [filterSemester, setFilterSemester] = useState('');
    const [filterCourse, setFilterCourse] = useState('');
    const [filterType, setFilterType] = useState('');

    // Dynamic Options for Dropdowns
    const [availableSemesters, setAvailableSemesters] = useState<string[]>([]);
    const [availableCourses, setAvailableCourses] = useState<string[]>([]);

    // 1. Update Semesters & Reset Downstream when Level changes
    useEffect(() => {
        if (filterLevel && courseData[filterLevel as keyof typeof courseData]) {
            const semesters = Object.keys(courseData[filterLevel as keyof typeof courseData]);
            setAvailableSemesters(semesters);
        } else {
            setAvailableSemesters([]);
        }
        // Reset dependent fields
        setFilterSemester('');
        setFilterCourse('');
        setAvailableCourses([]);
    }, [filterLevel]);

    // 2. Update Courses & Reset Downstream when Semester changes
    useEffect(() => {
        if (filterLevel && filterSemester) {
            const levelData = courseData[filterLevel as keyof typeof courseData];
            // Safety check to ensure the path exists
            if (levelData && levelData[filterSemester as keyof typeof levelData]) {
                const courses = levelData[filterSemester as keyof typeof levelData];
                setAvailableCourses(courses);
            } else {
                setAvailableCourses([]);
            }
        } else {
            setAvailableCourses([]);
        }
        // Reset course selection
        setFilterCourse('');
    }, [filterLevel, filterSemester]);

    // 3. Fetch Questions whenever filters change
    useEffect(() => {
        fetchQuestions();
    }, [filterLevel, filterSemester, filterCourse, filterType]);

    const fetchQuestions = async () => {
        setLoading(true);
        try {
            let query = supabase.from('questions').select('*').order('created_at', { ascending: false });

            if (filterLevel) query = query.eq('level', filterLevel);
            if (filterSemester) query = query.eq('semester', filterSemester);
            if (filterCourse) query = query.eq('course_name', filterCourse);
            if (filterType) query = query.eq('question_type', filterType);

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

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-2">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">Question Repository</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">Browse and find past exam questions</p>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white dark:bg-[#1E293B] p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 transition-all">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                    
                    {/* 1. Level */}
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

                    {/* 2. Semester */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1">Semester</label>
                        <select
                            value={filterSemester}
                            onChange={(e) => setFilterSemester(e.target.value)}
                            className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={!filterLevel}
                        >
                            <option value="">All Semesters</option>
                            {availableSemesters.map((sem) => (
                                <option key={sem} value={sem}>{sem}</option>
                            ))}
                        </select>
                    </div>

                    {/* 3. Course Name */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1">Course</label>
                        <select
                            value={filterCourse}
                            onChange={(e) => setFilterCourse(e.target.value)}
                            className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={!filterSemester}
                        >
                            <option value="">All Courses</option>
                            {availableCourses.map((course) => (
                                <option key={course} value={course}>{course}</option>
                            ))}
                        </select>
                    </div>

                    {/* 4. Question Type */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1">Type</label>
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none"
                        >
                            <option value="">All Types</option>
                            <option value="Theory">Theory</option>
                            <option value="Practical">Practical</option>
                        </select>
                    </div>

                    {/* 5. Reset Button */}
                    <div className="flex flex-col justify-end">
                        <button
                            onClick={() => {
                                setFilterLevel('');
                                setFilterSemester('');
                                setFilterCourse('');
                                setFilterType('');
                            }}
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

            {/* Content Area */}
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Found <span className="text-gray-900 dark:text-white font-bold">{questions.length}</span> question{questions.length !== 1 && 's'}
                    </p>
                </div>

                {/* Question Grid */}
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
                        {(filterLevel || filterSemester || filterCourse || filterType) && (
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                        {questions.map((q) => (
                            <div key={q.id} className="group bg-white dark:bg-[#1E293B] rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
                                
                                {/* Image Container */}
                                <div className="relative h-56 w-full bg-gray-100 dark:bg-gray-900 overflow-hidden border-b border-gray-100 dark:border-gray-800">
                                    <img
                                        src={q.image_url}
                                        alt={q.course_name}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    
                                    {/* Action button overlay (optional, e.g. View Full) */}
                                    <a 
                                        href={q.image_url} 
                                        target="_blank" 
                                        rel="noreferrer" 
                                        className="absolute bottom-4 right-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm p-2 rounded-full text-gray-900 dark:text-white opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 shadow-lg transition-all duration-300 hover:bg-primary-500 hover:text-white dark:hover:bg-primary-500"
                                        title="View Full Image"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                                        </svg>
                                    </a>
                                </div>

                                {/* Content Container */}
                                <div className="p-5 flex flex-col flex-grow">
                                    <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-3 line-clamp-2 leading-tight">
                                        {q.course_name}
                                    </h3>

                                    {/* Tags */}
                                    <div className="flex flex-wrap gap-2 mb-4 mt-auto">
                                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-800/50">
                                            {q.level}
                                        </span>
                                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-100 dark:border-blue-800/50">
                                            {q.semester}
                                        </span>
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${
                                            q.question_type === 'Theory' 
                                                ? 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border-purple-100 dark:border-purple-800/50' 
                                                : 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 border-amber-100 dark:border-amber-800/50'
                                        }`}>
                                            {q.question_type}
                                        </span>
                                    </div>

                                    {/* Footer Info */}
                                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
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
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuestionList;