import React, { useState } from 'react';
import type { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import FloatingAITutor from './FloatingAITutor';

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
            <header className="sticky top-0 z-50 bg-white/80 dark:bg-[#0B1120]/80 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-800/50 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center relative">
                    <Link to="/" onClick={closeMobileMenu} className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-500 dark:from-primary-400 dark:to-secondary-400 bg-clip-text text-transparent hover:opacity-80 transition-opacity whitespace-nowrap">
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
                        <Link to="/" className="text-sm font-medium text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400 transition-colors">
                            Home
                        </Link>

                        {user ? (
                            <>
                                {(role === 'admin' || role === 'collector') && (
                                    <Link to="/upload" className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5">
                                        + Upload
                                    </Link>
                                )}

                                {role === 'admin' && (
                                    <Link to="/admin" className="text-sm font-medium text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400 transition-colors">
                                        Admin
                                    </Link>
                                )}

                                <Link to="/profile" className="text-sm font-medium text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400 transition-colors">
                                    Profile
                                </Link>

                                <button
                                    onClick={handleSignOut}
                                    className="text-sm font-medium text-gray-600 hover:text-red-600 dark:text-gray-300 dark:hover:text-red-400 px-2 py-1 transition-colors"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <Link to="/login" className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 px-5 py-2 rounded-lg text-sm font-medium shadow-sm transition-all duration-300">
                                Login
                            </Link>
                        )}

                        <div className="h-6 w-px bg-gray-300 dark:bg-gray-700 mx-2" />

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
                    </nav>
                </div>

                {isMobileMenuOpen && (
                    <div className="sm:hidden border-t border-gray-200/50 dark:border-gray-800/50 bg-white/95 dark:bg-[#0B1120]/95 backdrop-blur-xl absolute top-full left-0 w-full shadow-lg shadow-black/5 dark:shadow-black/20 animate-fade-in z-40">
                        <nav className="flex flex-col px-4 pt-2 pb-6 space-y-2">
                            <Link to="/" onClick={closeMobileMenu} className="block px-3 py-3 rounded-lg text-base font-medium text-gray-800 dark:text-gray-200 hover:bg-primary-50 hover:text-primary-700 dark:hover:bg-gray-800 dark:hover:text-primary-400 transition-colors">
                                Home
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
            </header>

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
            <FloatingAITutor />
        </div>
    );
};

export default Layout;