import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { courseData } from '../data';
import { supabase } from '../lib/supabaseClient';

export interface UserProfile {
    id: string;
    email: string;
    role: string;
    created_at: string;
}

export interface Question {
    id: number;
    image_url: string;
    image_urls?: string[];
    level: string;
    semester: string;
    course_name: string;
    question_type: string;
    uploaded_by: string;
}

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

/**
 * Administrative control panel enabling user provisioning, role management,
 * and bulk repository content moderation (questions, books, and notes).
 */
const AdminDashboard: React.FC = () => {
    const { user, signOut } = useAuth();

    const [activeTab, setActiveTab] = useState<'users' | 'questions' | 'materials'>('users');

    // ── Users state ──
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [formData, setFormData] = useState({ email: '', password: '', role: 'collector' });
    const [userMessage, setUserMessage] = useState('');

    // ── Questions state ──
    const [questions, setQuestions] = useState<Question[]>([]);
    const [qLevel, setQLevel] = useState('');
    const [qSemester, setQSemester] = useState('');
    const [qCourse, setQCourse] = useState('');
    const [availableSemesters, setAvailableSemesters] = useState<string[]>([]);
    const [availableCourses, setAvailableCourses] = useState<string[]>([]);

    // ── Materials state ──
    const [materials, setMaterials] = useState<StudyMaterial[]>([]);
    const [mLevel, setMLevel] = useState('');
    const [mSemester, setMSemester] = useState('');
    const [mCourse, setMCourse] = useState('');
    const [mType, setMType] = useState('');
    const [mAvailableSemesters, setMAvailableSemesters] = useState<string[]>([]);
    const [mAvailableCourses, setMAvailableCourses] = useState<string[]>([]);

    // ── Initial load ──
    useEffect(() => {
        if (user) {
            fetchUsers();
        }
    }, [user]);

    // ── Questions cascading filters ──
    useEffect(() => {
        if (qLevel && courseData[qLevel as keyof typeof courseData]) {
            setAvailableSemesters(Object.keys(courseData[qLevel as keyof typeof courseData]));
        } else {
            setAvailableSemesters([]);
        }
        setQSemester(''); setQCourse(''); setAvailableCourses([]);
    }, [qLevel]);

    useEffect(() => {
        if (qLevel && qSemester) {
            const levelData = courseData[qLevel as keyof typeof courseData];
            if (levelData && levelData[qSemester as keyof typeof levelData]) {
                setAvailableCourses(levelData[qSemester as keyof typeof levelData]);
            }
        } else { setAvailableCourses([]); }
        setQCourse('');
    }, [qLevel, qSemester]);

    useEffect(() => {
        if (activeTab === 'questions') fetchQuestions();
    }, [qLevel, qSemester, qCourse, activeTab]);

    // ── Materials cascading filters ──
    useEffect(() => {
        if (mLevel && courseData[mLevel as keyof typeof courseData]) {
            setMAvailableSemesters(Object.keys(courseData[mLevel as keyof typeof courseData]));
        } else {
            setMAvailableSemesters([]);
        }
        setMSemester(''); setMCourse(''); setMAvailableCourses([]);
    }, [mLevel]);

    useEffect(() => {
        if (mLevel && mSemester) {
            const levelData = courseData[mLevel as keyof typeof courseData];
            if (levelData && levelData[mSemester as keyof typeof levelData]) {
                setMAvailableCourses(levelData[mSemester as keyof typeof levelData]);
            }
        } else { setMAvailableCourses([]); }
        setMCourse('');
    }, [mLevel, mSemester]);

    useEffect(() => {
        if (activeTab === 'materials') fetchMaterials();
    }, [mLevel, mSemester, mCourse, mType, activeTab]);

    const getAccessToken = async (): Promise<string> => {
        const { data: sessionData } = await supabase.auth.getSession();
        const accessToken = sessionData.session?.access_token;
        if (!accessToken) {
            throw new Error('Missing auth session token');
        }
        return accessToken;
    };

    // ── Fetch functions ──
    const fetchUsers = async (): Promise<void> => {
        try {
            const accessToken = await getAccessToken();
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://question-bank-app.onrender.com'}/api/admin/users`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            const payload = await response.json();
            if (!response.ok) throw new Error(payload.error || 'Failed to fetch users');
            setUsers(payload);
            setUserMessage('');
        } catch (err: any) {
            console.error('[AdminDashboard] Failed to load users:', err);
            setUsers([]);
            setUserMessage(err.message || 'Unable to load users');
        }
    };

    const fetchQuestions = async () => {
        try {
            let query = supabase.from('questions').select('*').order('created_at', { ascending: false });
            if (qLevel) query = query.eq('level', qLevel);
            if (qSemester) query = query.eq('semester', qSemester);
            if (qCourse) query = query.eq('course_name', qCourse);
            const { data, error } = await query;
            if (error) throw error;
            setQuestions(data || []);
        } catch (err) { console.error('[AdminDashboard] Failed to load questions:', err); }
    };

    const fetchMaterials = async () => {
        try {
            let query = supabase.from('study_materials').select('*').order('created_at', { ascending: false });
            if (mLevel) query = query.eq('level', mLevel);
            if (mSemester) query = query.eq('semester', mSemester);
            if (mCourse) query = query.eq('course_name', mCourse);
            if (mType) query = query.eq('type', mType);
            const { data, error } = await query;
            if (error) throw error;
            setMaterials(data || []);
        } catch (err) { console.error('[AdminDashboard] Failed to load materials:', err); }
    };

    // ── Delete handlers ──
    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setUserMessage('');
        try {
            const accessToken = await getAccessToken();
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://question-bank-app.onrender.com'}/api/admin/create-user`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Failed to create user');
            setUserMessage('User created successfully!');
            setFormData({ email: '', password: '', role: 'collector' });
            fetchUsers();
        } catch (err: any) { setUserMessage(err.message); }
    };

    const handleDeleteUser = async (userId: string) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        try {
            const accessToken = await getAccessToken();
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://question-bank-app.onrender.com'}/api/admin/users/${userId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error);
            fetchUsers();
        } catch (err: any) { alert(err.message); }
    };

    const handleDeleteQuestion = async (questionId: number) => {
        if (!window.confirm('Delete this question? The image will also be removed from Cloudinary.')) return;
        try {
            const accessToken = await getAccessToken();
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://question-bank-app.onrender.com'}/api/admin/questions/${questionId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error);
            fetchQuestions();
        } catch (err: any) { alert(err.message); }
    };

    const handleDeleteMaterial = async (materialId: string, title: string) => {
        if (!window.confirm(`Delete "${title}"? This action cannot be undone.`)) return;
        try {
            const accessToken = await getAccessToken();
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://question-bank-app.onrender.com'}/api/admin/materials/${materialId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Failed to delete material');
            // Optimistic update — remove from local state immediately
            setMaterials(prev => prev.filter(m => m.id !== materialId));
        } catch (err: any) { alert(err.message || 'Failed to delete material'); }
    };

    if (!user) return null;

    // ── Tab config ──
    const TABS = [
        { id: 'users' as const,     label: 'Manage Users' },
        { id: 'questions' as const, label: 'Questions' },
        { id: 'materials' as const, label: 'Books & Notes' },
    ];

    return (
        <div className="p-4 sm:p-6 space-y-8 animate-fade-in max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-[#1E293B] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">Admin Dashboard</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage users and oversee question repository</p>
                </div>
                <div className="flex items-center gap-4 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-4 py-2 rounded-xl">
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Logged in as</span>
                        <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{user.email}</span>
                    </div>
                    <div className="h-8 w-px bg-gray-200 dark:bg-gray-700" />
                    <button onClick={signOut} className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium px-2 py-1 transition-colors">
                        Sign Out
                    </button>
                </div>
            </div>

            {/* Tabs — now 3 options */}
            <div className="flex space-x-2 bg-gray-100 dark:bg-gray-800/50 p-1.5 rounded-xl border border-gray-200 dark:border-gray-700/50 w-full max-w-lg mx-auto">
                {TABS.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 py-2.5 px-3 rounded-lg font-medium text-sm transition-all duration-300 ${
                            activeTab === tab.id
                                ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-white shadow-sm ring-1 ring-gray-900/5 dark:ring-white/10'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-700/50'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* ══════════════════════════════════════════
                TAB: Users
            ══════════════════════════════════════════ */}
            {activeTab === 'users' && (
                <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
                    {/* Create User Form */}
                    <div className="lg:col-span-1 bg-white dark:bg-[#1E293B] p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 h-fit">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 border-b border-gray-100 dark:border-gray-800 pb-4">Create New User</h3>
                        {userMessage && (
                            <div className={`mb-6 p-4 rounded-xl flex items-start gap-3 border ${userMessage.includes('success') ? 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/30 dark:border-emerald-800/50 dark:text-emerald-400' : 'bg-red-50 border-red-200 text-red-700 dark:bg-red-900/30 dark:border-red-800/50 dark:text-red-400'}`}>
                                <p className="text-sm font-medium">{userMessage}</p>
                            </div>
                        )}
                        <form onSubmit={handleCreateUser} className="space-y-5">
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 ml-1">Email Address</label>
                                <input type="email" placeholder="user@domain.com" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all placeholder-gray-400" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 ml-1">Password</label>
                                <input type="password" placeholder="Min. 6 characters" required value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all placeholder-gray-400" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 ml-1">Role Assignment</label>
                                <select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all">
                                    <option value="collector">Collector</option>
                                    <option value="admin">Administrator</option>
                                </select>
                            </div>
                            <button type="submit" className="w-full mt-2 py-3 px-4 flex justify-center items-center text-white bg-primary-600 hover:bg-primary-700 rounded-xl font-medium shadow-sm hover:shadow hover:-translate-y-0.5 transition-all duration-300">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                </svg>
                                Create Account
                            </button>
                        </form>
                    </div>

                    {/* Users List */}
                    <div className="lg:col-span-2 bg-white dark:bg-[#1E293B] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Active Users <span className="ml-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-2.5 py-0.5 rounded-full text-sm">{users.length}</span></h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-left text-sm">
                                <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400">
                                    <tr>
                                        <th className="px-6 py-4 font-semibold">User Email</th>
                                        <th className="px-6 py-4 font-semibold">System Role</th>
                                        <th className="px-6 py-4 font-semibold text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                    {users.map((u) => (
                                        <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-gray-900 dark:text-gray-200">{u.email}</div>
                                                <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">ID: {u.id.substring(0, 8)}...</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border ${u.role === 'admin' ? 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border-purple-100 dark:border-purple-800/50' : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-100 dark:border-emerald-800/50'}`}>
                                                    {u.role === 'admin' ? (
                                                        <svg className="mr-1.5 h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                                                    ) : (
                                                        <svg className="mr-1.5 h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                                    )}
                                                    {u.role.charAt(0).toUpperCase() + u.role.slice(1)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button onClick={() => handleDeleteUser(u.id)} className="inline-flex items-center text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium transition-colors">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                    Revoke
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {users.length === 0 && (
                                        <tr><td colSpan={3} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">No users found. Create one to get started.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* ══════════════════════════════════════════
                TAB: Questions
            ══════════════════════════════════════════ */}
            {activeTab === 'questions' && (
                <div className="space-y-6">
                    {/* Filters */}
                    <div className="bg-white dark:bg-[#1E293B] p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 transition-all">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1">Level</label>
                                <select value={qLevel} onChange={(e) => setQLevel(e.target.value)} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none">
                                    <option value="">All Levels</option>
                                    {Object.keys(courseData).map(lvl => <option key={lvl} value={lvl}>{lvl}</option>)}
                                </select>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1">Semester</label>
                                <select value={qSemester} onChange={(e) => setQSemester(e.target.value)} disabled={!qLevel} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none disabled:opacity-50">
                                    <option value="">All Semesters</option>
                                    {availableSemesters.map(sem => <option key={sem} value={sem}>{sem}</option>)}
                                </select>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1">Course</label>
                                <select value={qCourse} onChange={(e) => setQCourse(e.target.value)} disabled={!qSemester} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none disabled:opacity-50">
                                    <option value="">All Courses</option>
                                    {availableCourses.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div className="flex flex-col justify-end h-full">
                                <button onClick={() => { setQLevel(''); setQSemester(''); setQCourse(''); }} className="w-full h-[46px] bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-xl transition-colors flex items-center justify-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                                    Reset Filters
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-between items-center mb-2 px-1">
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Found <span className="text-gray-900 dark:text-white font-bold">{questions.length}</span> question{questions.length !== 1 && 's'}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                        {questions.map(q => (
                            <div key={q.id} className="bg-white dark:bg-[#1E293B] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden relative group hover:shadow-lg transition-all duration-300 flex flex-col">
                                <div className="relative h-40 bg-gray-100 dark:bg-gray-900">
                                    <img src={q.image_url || (q.image_urls && q.image_urls[0]) || ''} alt="Q" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                    {q.image_urls && q.image_urls.length > 1 && (
                                        <div className="absolute top-2 right-2 bg-gray-900/70 backdrop-blur-md text-white px-2 py-1 text-[10px] font-bold rounded shadow-sm z-10 flex items-center gap-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                            {q.image_urls.length} Pages
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-20">
                                        <button onClick={() => handleDeleteQuestion(q.id)} className="bg-red-600 hover:bg-red-700 text-white p-2.5 rounded-full shadow-lg transform scale-90 group-hover:scale-100 transition-all duration-300" title="Delete Question">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </button>
                                    </div>
                                </div>
                                <div className="p-4 flex-grow flex flex-col">
                                    <p className="text-sm font-bold text-gray-900 dark:text-white line-clamp-2 mb-2 leading-tight">{q.course_name}</p>
                                    <div className="mt-auto flex justify-between items-center">
                                        <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${q.question_type === 'Theory' ? 'bg-purple-50 text-purple-700 border-purple-100 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800/50' : 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800/50'}`}>
                                            {q.question_type}
                                        </span>
                                        <span className="text-[10px] text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">{q.level} • {q.semester}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {questions.length === 0 && (
                        <div className="bg-white dark:bg-[#1E293B] rounded-2xl border border-gray-100 dark:border-gray-800 p-12 text-center shadow-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Content Found</h3>
                            <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">There are no questions matching the current filter criteria.</p>
                        </div>
                    )}
                </div>
            )}

            {/* ══════════════════════════════════════════
                TAB: Books & Notes
            ══════════════════════════════════════════ */}
            {activeTab === 'materials' && (
                <div className="space-y-6">
                    {/* Filters */}
                    <div className="bg-white dark:bg-[#1E293B] p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 transition-all">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1">Level</label>
                                <select value={mLevel} onChange={(e) => setMLevel(e.target.value)} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none">
                                    <option value="">All Levels</option>
                                    {Object.keys(courseData).map(lvl => <option key={lvl} value={lvl}>{lvl}</option>)}
                                </select>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1">Semester</label>
                                <select value={mSemester} onChange={(e) => setMSemester(e.target.value)} disabled={!mLevel} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none disabled:opacity-50">
                                    <option value="">All Semesters</option>
                                    {mAvailableSemesters.map(sem => <option key={sem} value={sem}>{sem}</option>)}
                                </select>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1">Course</label>
                                <select value={mCourse} onChange={(e) => setMCourse(e.target.value)} disabled={!mSemester} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none disabled:opacity-50">
                                    <option value="">All Courses</option>
                                    {mAvailableCourses.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1">Type</label>
                                <select value={mType} onChange={(e) => setMType(e.target.value)} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none">
                                    <option value="">All Types</option>
                                    <option value="book">📘 Books</option>
                                    <option value="note">📝 Notes</option>
                                </select>
                            </div>
                            <div className="flex flex-col justify-end h-full">
                                <button onClick={() => { setMLevel(''); setMSemester(''); setMCourse(''); setMType(''); }} className="w-full h-[46px] bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-xl transition-colors flex items-center justify-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                                    Reset Filters
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-between items-center mb-2 px-1">
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Found <span className="text-gray-900 dark:text-white font-bold">{materials.length}</span> material{materials.length !== 1 && 's'}
                        </p>
                    </div>

                    {/* Materials list — table layout for easy admin scanning */}
                    {materials.length === 0 ? (
                        <div className="bg-white dark:bg-[#1E293B] rounded-2xl border border-gray-100 dark:border-gray-800 p-12 text-center shadow-sm">
                            <div className="text-4xl mb-4">📚</div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Materials Found</h3>
                            <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">No books or notes match the current filter criteria.</p>
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-[#1E293B] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="min-w-full text-left text-sm">
                                    <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400">
                                        <tr>
                                            <th className="px-6 py-4 font-semibold">Title</th>
                                            <th className="px-6 py-4 font-semibold">Type</th>
                                            <th className="px-6 py-4 font-semibold">Level / Sem</th>
                                            <th className="px-6 py-4 font-semibold">Course</th>
                                            <th className="px-6 py-4 font-semibold text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                        {materials.map((m) => (
                                            <tr key={m.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors group">
                                                <td className="px-6 py-4 max-w-[220px]">
                                                    <div className="font-semibold text-gray-900 dark:text-white line-clamp-2 leading-snug">{m.title}</div>
                                                    <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                                        {new Date(m.created_at).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold border ${
                                                        m.type === 'book'
                                                            ? 'bg-indigo-50 text-indigo-700 border-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800/50'
                                                            : 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800/50'
                                                    }`}>
                                                        {m.type === 'book' ? '📘' : '📝'} {m.type.charAt(0).toUpperCase() + m.type.slice(1)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-gray-600 dark:text-gray-300 whitespace-nowrap">
                                                    {m.level} <span className="text-gray-400 dark:text-gray-600 mx-1">•</span> {m.semester}
                                                </td>
                                                <td className="px-6 py-4 text-gray-600 dark:text-gray-300 max-w-[180px]">
                                                    <span className="line-clamp-1">{m.course_name}</span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-3">
                                                        <a
                                                            href={m.drive_link}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-1 text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium transition-colors text-xs"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                                            View
                                                        </a>
                                                        <button
                                                            onClick={() => handleDeleteMaterial(m.id, m.title)}
                                                            className="inline-flex items-center gap-1 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium transition-colors"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;