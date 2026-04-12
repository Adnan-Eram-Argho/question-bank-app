import React, { useState } from 'react';
import type { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import FloatingAITutor from './FloatingAITutor';
import DeveloperBadge from './DeveloperBadge';
import { motion, AnimatePresence } from 'framer-motion';
import { useFaculty } from '../context/FacultyContext';
import { courseData } from '../data';

interface LayoutProps {
    children: ReactNode;
}

/**
 * Primary application layout wrapper providing responsive navigation,
 * theme toggling, and authentication-aware routing links.
 * 
 * @param props.children - Main page content to be rendered within the layout.
 */
const Layout: React.FC<LayoutProps> = ({ children }) => {
    const { theme, toggleTheme } = useTheme();
    const { user, role, signOut } = useAuth();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { activeFaculty, setActiveFaculty } = useFaculty();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const faculties = Object.keys(courseData);

    const handleSignOut = async (): Promise<void> => {
        await signOut();
        setIsMobileMenuOpen(false);
        navigate('/');
    };

    const closeMobileMenu = (): void => {
        setIsMobileMenuOpen(false);
    };


    return (
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-[#0B1120] text-gray-900 dark:text-gray-100 font-sans selection:bg-primary-200 dark:selection:bg-primary-900/50 selection:text-primary-900 dark:selection:text-primary-100">
        <motion.header
            className="sticky top-0 z-50 bg-white/70 dark:bg-[#0A0F1E]/80 backdrop-blur-xl border-b border-[rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.08)] transition-colors duration-300"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
        >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center relative">
                    <Link to="/" onClick={closeMobileMenu} className="text-xl font-bold bg-gradient-to-r from-green-400 to-amber-400 bg-clip-text text-transparent hover:opacity-80 transition-opacity whitespace-nowrap">
                        Agri-Economics Q-Bank
                    </Link>

                    <div className="flex items-center space-x-2 sm:hidden">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full text-gray-500 hover:text-primary-600 hover:bg-primary-50 dark:text-gray-400 dark:hover:text-primary-400 dark:hover:bg-gray-800 transition-all focus:outline-none"
                            aria-label="Toggle Dark Mode"
                        >
                            {theme === 'light' ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            )}
                        </button>

                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 rounded-lg text-gray-500 hover:text-primary-600 hover:bg-primary-50 dark:text-gray-400 dark:hover:text-primary-400 dark:hover:bg-gray-800 transition-colors focus:outline-none"
                            aria-label="Toggle Navigation Menu"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {isMobileMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>

                    <nav className="hidden sm:flex items-center space-x-6">
                        {/* Faculty Dropdown Desktop */}
                        <div className="relative">
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="flex items-center space-x-1 text-sm font-semibold text-slate-800 dark:text-slate-200 hover:text-primary-600 dark:hover:text-primary-400 transition-colors bg-white/50 dark:bg-gray-800/50 px-3 py-1.5 rounded-lg border border-gray-200/50 dark:border-gray-700/50 shadow-sm backdrop-blur-sm"
                            >
                                <span>{activeFaculty}</span>
                                <svg className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            <AnimatePresence>
                                {isDropdownOpen && (
                                    <>
                                        {/* Backdrop to click outside */}
                                        <div 
                                            className="fixed inset-0 z-40" 
                                            onClick={() => setIsDropdownOpen(false)}
                                            aria-hidden="true"
                                        />
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute top-full right-0 lg:left-0 lg:right-auto mt-2 w-56 bg-white/95 dark:bg-[#0B1120]/95 backdrop-blur-xl border border-gray-200 dark:border-gray-800 rounded-xl shadow-2xl py-2 z-50"
                                        >
                                            {faculties.map((faculty) => (
                                                <button
                                                    key={faculty}
                                                    onClick={() => {
                                                        setActiveFaculty(faculty);
                                                        setIsDropdownOpen(false);
                                                    }}
                                                    className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                                                        activeFaculty === faculty 
                                                        ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400 font-medium' 
                                                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/80'
                                                    }`}
                                                >
                                                    {faculty}
                                                </button>
                                            ))}
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>

                        <Link to="/" className="relative group text-sm font-semibold text-slate-800 dark:text-slate-200 hover:text-black dark:hover:text-white transition-colors">
                            Home
                            <motion.span className="absolute -bottom-1 left-0 w-full h-[2px] bg-gradient-to-r from-green-400 to-amber-400 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out" />
                        </Link>

                        <a href="https://sau-blogs.vercel.app/" target="_blank" rel="noopener noreferrer" className="relative group text-sm font-semibold text-slate-800 dark:text-slate-200 hover:text-black dark:hover:text-white transition-colors">
                            Blogs
                            <motion.span className="absolute -bottom-1 left-0 w-full h-[2px] bg-gradient-to-r from-green-400 to-amber-400 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out" />
                        </a>
                        <Link to="/study-materials?type=book" className="relative group text-sm font-semibold text-slate-800 dark:text-slate-200 hover:text-black dark:hover:text-white transition-colors">
                            Books
                            <motion.span className="absolute -bottom-1 left-0 w-full h-[2px] bg-gradient-to-r from-green-400 to-amber-400 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out" />
                        </Link>
                        <Link to="/study-materials?type=note" className="relative group text-sm font-semibold text-slate-800 dark:text-slate-200 hover:text-black dark:hover:text-white transition-colors">
                            Notes
                            <motion.span className="absolute -bottom-1 left-0 w-full h-[2px] bg-gradient-to-r from-green-400 to-amber-400 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out" />
                        </Link>
                        <Link to="/study-materials?type=pdf" className="relative group text-sm font-semibold text-slate-800 dark:text-slate-200 hover:text-black dark:hover:text-white transition-colors">
                            PDF
                            <motion.span className="absolute -bottom-1 left-0 w-full h-[2px] bg-gradient-to-r from-green-400 to-amber-400 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out" />
                        </Link>

                        {user ? (
                            <>
                                {(role === 'admin' || role === 'collector') && (
                                    <Link to="/upload" className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5">
                                        + Upload
                                    </Link>
                                )}

                                {role === 'admin' && (
                                    <Link to="/admin" className="relative group text-sm font-semibold text-slate-800 dark:text-slate-200 hover:text-black dark:hover:text-white transition-colors">
                                        Admin
                                        <motion.span className="absolute -bottom-1 left-0 w-full h-[2px] bg-gradient-to-r from-green-400 to-amber-400 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out" />
                                    </Link>
                                )}

                                <Link to="/profile" className="relative group text-sm font-semibold text-slate-800 dark:text-slate-200 hover:text-black dark:hover:text-white transition-colors">
                                    Profile
                                    <motion.span className="absolute -bottom-1 left-0 w-full h-[2px] bg-gradient-to-r from-green-400 to-amber-400 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out" />
                                </Link>

                                <button
                                    onClick={handleSignOut}
                                    className="text-sm font-medium text-gray-600 hover:text-red-600 dark:text-gray-300 dark:hover:text-red-400 px-2 py-1 transition-colors"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <Link to="/login" className="bg-gradient-to-r from-green-400 to-amber-500 text-white hover:from-green-500 hover:to-amber-600 px-5 py-2 rounded-xl text-sm font-bold shadow-md shadow-[rgba(74,222,128,0.2)] hover:shadow-lg transition-all duration-300">
                                Login
                            </Link>
                        )}

                        <div className="h-6 w-px bg-gray-300 dark:bg-gray-700 mx-2" />

                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full text-gray-500 hover:text-primary-600 hover:bg-primary-50 dark:text-gray-400 dark:hover:text-primary-400 dark:hover:bg-gray-800 transition-all focus:outline-none"
                            aria-label="Toggle Dark Mode"
                        >
                            <motion.div
                                initial={false}
                                animate={{ rotate: theme === 'light' ? 0 : 180 }}
                                transition={{ duration: 0.3, ease: 'backOut' }}
                            >
                                {theme === 'light' ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                )}
                            </motion.div>
                        </button>
                    </nav>
                </div>

                {isMobileMenuOpen && (
                    <div className="sm:hidden border-t border-gray-200/50 dark:border-gray-800/50 bg-white/95 dark:bg-[#0B1120]/95 backdrop-blur-xl absolute top-full left-0 w-full shadow-lg shadow-black/5 dark:shadow-black/20 animate-fade-in z-40">
                        <nav className="flex flex-col px-4 pt-2 pb-6 space-y-2">
                            {/* Faculty Select Mobile */}
                            <div className="mb-2 bg-gray-50/50 dark:bg-gray-800/30 p-3 rounded-xl border border-gray-100 dark:border-gray-800">
                                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                                    Select Faculty
                                </label>
                                <div className="space-y-1">
                                    {faculties.map((faculty) => (
                                        <button
                                            key={faculty}
                                            onClick={() => {
                                                setActiveFaculty(faculty);
                                                closeMobileMenu();
                                            }}
                                            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                                                activeFaculty === faculty 
                                                ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300 shadow-sm' 
                                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                                            }`}
                                        >
                                            {faculty} {activeFaculty === faculty && '✓'}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="h-px w-full bg-gray-200/50 dark:bg-gray-800/50 my-1" />

                            <Link to="/" onClick={closeMobileMenu} className="block px-3 py-3 rounded-lg text-base font-medium text-gray-800 dark:text-gray-200 hover:bg-primary-50 hover:text-primary-700 dark:hover:bg-gray-800 dark:hover:text-primary-400 transition-colors">
                                Home
                            </Link>

                            <a href="https://sau-blogs.vercel.app/" target="_blank" rel="noopener noreferrer" onClick={closeMobileMenu} className="text-left w-full block px-3 py-3 rounded-lg text-base font-medium text-gray-800 dark:text-gray-200 hover:bg-primary-50 hover:text-primary-700 dark:hover:bg-gray-800 dark:hover:text-primary-400 transition-colors">
                                Blogs
                            </a>
                            <Link to="/study-materials?type=book" onClick={closeMobileMenu} className="text-left w-full block px-3 py-3 rounded-lg text-base font-medium text-gray-800 dark:text-gray-200 hover:bg-primary-50 hover:text-primary-700 dark:hover:bg-gray-800 dark:hover:text-primary-400 transition-colors">
                                Books
                            </Link>
                            <Link to="/study-materials?type=note" onClick={closeMobileMenu} className="text-left w-full block px-3 py-3 rounded-lg text-base font-medium text-gray-800 dark:text-gray-200 hover:bg-primary-50 hover:text-primary-700 dark:hover:bg-gray-800 dark:hover:text-primary-400 transition-colors">
                                Notes
                            </Link>
                            <Link to="/study-materials?type=pdf" onClick={closeMobileMenu} className="text-left w-full block px-3 py-3 rounded-lg text-base font-medium text-gray-800 dark:text-gray-200 hover:bg-primary-50 hover:text-primary-700 dark:hover:bg-gray-800 dark:hover:text-primary-400 transition-colors">
                                PDF
                            </Link>

                            {user ? (
                                <>
                                    <Link to="/profile" onClick={closeMobileMenu} className="block px-3 py-3 rounded-lg text-base font-medium text-gray-800 dark:text-gray-200 hover:bg-primary-50 hover:text-primary-700 dark:hover:bg-gray-800 dark:hover:text-primary-400 transition-colors">
                                        Profile
                                    </Link>

                                    {role === 'admin' && (
                                        <Link to="/admin" onClick={closeMobileMenu} className="block px-3 py-3 rounded-lg text-base font-medium text-gray-800 dark:text-gray-200 hover:bg-primary-50 hover:text-primary-700 dark:hover:bg-gray-800 dark:hover:text-primary-400 transition-colors">
                                            Admin Dashboard
                                        </Link>
                                    )}

                                    {(role === 'admin' || role === 'collector') && (
                                        <Link to="/upload" onClick={closeMobileMenu} className="block px-3 py-3 rounded-lg text-base font-medium text-primary-700 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 hover:bg-primary-100 dark:hover:bg-primary-900/40 transition-colors">
                                            + Upload Question
                                        </Link>
                                    )}

                                    <button
                                        onClick={handleSignOut}
                                        className="w-full text-left px-3 py-3 rounded-lg text-base font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors mt-2"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <div className="pt-2">
                                    <Link to="/login" onClick={closeMobileMenu} className="block w-full text-center bg-primary-600 text-white px-5 py-3 rounded-lg text-base font-semibold shadow-sm hover:bg-primary-700 transition-colors">
                                        Login
                                    </Link>
                                </div>
                            )}
                        </nav>
                    </div>
                )}
        </motion.header>

            <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 transition-colors duration-300">
                {children}
            </main>

            <footer className="w-full bg-white dark:bg-[#0B1120] text-center py-6 text-sm text-gray-500 dark:text-gray-500 border-t border-gray-200 dark:border-gray-800/60 mt-auto transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-center items-center gap-2">
                    <p>
                        Developed by{' '}
                        <Link to="/developer" className="text-gray-700 dark:text-gray-300 font-medium hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                            Argho
                        </Link>
                    </p>
                    <span className="hidden sm:inline text-gray-300 dark:text-gray-700">&bull;</span>
                    <p>
                        Questions Collected by{' '}
                        <Link to="/contributors" className="text-gray-700 dark:text-gray-300 font-medium hover:text-secondary-600 dark:hover:text-secondary-400 transition-colors">
                            Contributors
                        </Link>
                    </p>
                </div>
            </footer>
            <DeveloperBadge />
            <FloatingAITutor />
        </div>
    );
};

export default Layout;