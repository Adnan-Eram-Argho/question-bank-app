import React, { useState } from 'react';
import type { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import FloatingAITutor from './FloatingAITutor';
import { motion, AnimatePresence } from 'framer-motion';
import { useFaculty } from '../context/FacultyContext';
import { courseData } from '../data';
import { MoonIcon, SunIcon, HamburgerIcon, XIcon, ChevronDownIcon } from './icons';
import DeveloperBadge from './DeveloperBadge';

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
        <div className="min-h-screen flex flex-col bg-surface-canvas text-text-primary font-sans pb-32 sm:pb-14">
            <motion.header
                className="sticky top-0 z-50 bg-surface-card border-b border-border-subtle transition-colors duration-300"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center relative">
                    <Link to="/" onClick={closeMobileMenu} className="inline-flex items-center gap-2 text-xl font-semibold text-brand-primary hover:opacity-80 transition-opacity whitespace-nowrap shrink-0">
                        <img src="/sau-logo.png" alt="SAU crest" className="h-7 w-7 object-contain" />
                        SAU Q-Bank
                    </Link>

                    <div className="flex items-center space-x-2 xl:hidden">
                        <button
                            onClick={toggleTheme}
                            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md text-text-muted hover:text-brand-primary hover:bg-surface-canvas transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
                            aria-label="Toggle Dark Mode"
                        >
                            {theme === 'light' ? <MoonIcon /> : <SunIcon />}
                        </button>

                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md text-text-muted hover:text-brand-primary hover:bg-surface-canvas transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
                            aria-label="Toggle Navigation Menu"
                        >
                            {isMobileMenuOpen ? <XIcon /> : <HamburgerIcon />}
                        </button>
                    </div>

                    <nav className="hidden xl:flex items-center space-x-4">
                        {/* Faculty Dropdown Desktop */}
                        <div className="relative">
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="flex min-h-11 items-center space-x-1 text-sm font-semibold text-text-primary hover:text-brand-primary transition-colors bg-surface-card px-3 py-1.5 rounded-md border border-border-subtle shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
                            >
                                <span className="max-w-[9rem] truncate">{activeFaculty}</span>
                                <ChevronDownIcon className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
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
                                            onBlur={() => setIsDropdownOpen(false)}
                                            tabIndex={-1}
                                            className="absolute top-full left-0 mt-2 w-56 bg-surface-card border border-border-subtle rounded-lg py-2 z-50 focus:outline-none"
                                        >
                                            {faculties.map((faculty) => (
                                                <button
                                                    key={faculty}
                                                    onClick={() => {
                                                        setActiveFaculty(faculty);
                                                        setIsDropdownOpen(false);
                                                    }}
                                                    className={`w-full text-left px-4 py-2 text-sm transition-colors ${activeFaculty === faculty
                                                        ? 'bg-brand-primary/10 text-brand-primary font-medium'
                                                        : 'text-text-muted hover:bg-surface-canvas'
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

                        <Link to="/" className="relative group inline-flex min-h-11 items-center px-1 text-sm font-semibold text-text-primary hover:text-brand-primary transition-colors whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2">
                            Home
                            <motion.span className="absolute -bottom-1 left-0 w-full h-px bg-brand-primary origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out" />
                        </Link>

                        <a href="https://sau-blogs.vercel.app/" target="_blank" rel="noopener noreferrer" className="relative group inline-flex min-h-11 items-center px-1 text-sm font-semibold text-text-primary hover:text-brand-primary transition-colors whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2">
                            Blogs
                            <motion.span className="absolute -bottom-1 left-0 w-full h-px bg-brand-primary origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out" />
                        </a>
                        <Link to="/study-materials?type=book" className="relative group inline-flex min-h-11 items-center px-1 text-sm font-semibold text-text-primary hover:text-brand-primary transition-colors whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2">
                            Books
                            <motion.span className="absolute -bottom-1 left-0 w-full h-px bg-brand-primary origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out" />
                        </Link>
                        <Link to="/study-materials?type=note" className="relative group inline-flex min-h-11 items-center px-1 text-sm font-semibold text-text-primary hover:text-brand-primary transition-colors whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2">
                            Notes
                            <motion.span className="absolute -bottom-1 left-0 w-full h-px bg-brand-primary origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out" />
                        </Link>
                        <Link to="/study-materials?type=pdf" className="relative group inline-flex min-h-11 items-center px-1 text-sm font-semibold text-text-primary hover:text-brand-primary transition-colors whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2">
                            PDF
                            <motion.span className="absolute -bottom-1 left-0 w-full h-px bg-brand-primary origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out" />
                        </Link>
                        <Link to="/sau-assignment-cover-page" className="relative group inline-flex min-h-11 items-center px-1 text-sm font-semibold text-text-primary hover:text-brand-primary transition-colors whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2">
                            Cover Page
                            <motion.span className="absolute -bottom-1 left-0 w-full h-px bg-brand-primary origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out" />
                        </Link>

                        {user ? (
                            <>
                                {(role === 'admin' || role === 'collector') && (
                                    <Link to="/upload" className="inline-flex min-h-11 items-center bg-brand-primary hover:opacity-90 text-white px-4 py-2 rounded-md text-sm font-semibold transition-colors whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2">
                                        + Upload
                                    </Link>
                                )}

                                {role === 'admin' && (
                                    <Link to="/admin" className="relative group inline-flex min-h-11 items-center px-1 text-sm font-semibold text-text-primary hover:text-brand-primary transition-colors whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2">
                                        Admin
                                        <motion.span className="absolute -bottom-1 left-0 w-full h-px bg-brand-primary origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out" />
                                    </Link>
                                )}

                                <Link to="/profile" className="relative group inline-flex min-h-11 items-center px-1 text-sm font-semibold text-text-primary hover:text-brand-primary transition-colors whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2">
                                    Profile
                                    <motion.span className="absolute -bottom-1 left-0 w-full h-px bg-brand-primary origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out" />
                                </Link>

                                <button
                                    onClick={handleSignOut}
                                    className="inline-flex min-h-11 items-center text-sm font-medium text-text-muted hover:text-brand-primary px-2 py-1 transition-colors whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <Link to="/login" className="inline-flex min-h-11 items-center bg-brand-primary text-white hover:opacity-90 px-5 py-2 rounded-md text-sm font-semibold transition-colors whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2">
                                Login
                            </Link>
                        )}

                        <div className="h-6 w-px bg-border-subtle mx-2" />

                        <button
                            onClick={toggleTheme}
                            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md text-text-muted hover:text-brand-primary hover:bg-surface-canvas transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
                            aria-label="Toggle Dark Mode"
                        >
                            <motion.div
                                initial={false}
                                animate={{ rotate: theme === 'light' ? 0 : 180 }}
                                transition={{ duration: 0.3, ease: 'backOut' }}
                            >
                                {theme === 'light' ? <MoonIcon /> : <SunIcon />}
                            </motion.div>
                        </button>
                    </nav>
                </div>

                {isMobileMenuOpen && (
                    <div className="xl:hidden max-h-[calc(100dvh-5rem)] overflow-y-auto border-t border-border-subtle bg-surface-card absolute top-full left-0 w-full animate-fade-in z-40">
                        <nav className="flex flex-col px-4 pt-2 pb-6 space-y-2">
                            {/* Faculty Select Mobile */}
                            <div className="mb-2 bg-surface-canvas p-3 rounded-lg border border-border-subtle">
                                <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
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
                                            className={`w-full min-h-11 text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeFaculty === faculty
                                                ? 'bg-brand-primary/15 text-brand-primary'
                                                : 'text-text-muted hover:bg-surface-canvas'
                                                }`}
                                        >
                                            {faculty} {activeFaculty === faculty && '✓'}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="h-px w-full bg-border-subtle my-1" />

                            <Link to="/" onClick={closeMobileMenu} className="flex min-h-11 items-center px-3 py-3 rounded-md text-base font-medium text-text-primary hover:bg-surface-canvas hover:text-brand-primary transition-colors">
                                Home
                            </Link>

                            <a href="https://sau-blogs.vercel.app/" target="_blank" rel="noopener noreferrer" onClick={closeMobileMenu} className="flex min-h-11 items-center text-left w-full px-3 py-3 rounded-md text-base font-medium text-text-primary hover:bg-surface-canvas hover:text-brand-primary transition-colors">
                                Blogs
                            </a>
                            <Link to="/study-materials?type=book" onClick={closeMobileMenu} className="flex min-h-11 items-center text-left w-full px-3 py-3 rounded-md text-base font-medium text-text-primary hover:bg-surface-canvas hover:text-brand-primary transition-colors">
                                Books
                            </Link>
                            <Link to="/study-materials?type=note" onClick={closeMobileMenu} className="flex min-h-11 items-center text-left w-full px-3 py-3 rounded-md text-base font-medium text-text-primary hover:bg-surface-canvas hover:text-brand-primary transition-colors">
                                Notes
                            </Link>
                            <Link to="/study-materials?type=pdf" onClick={closeMobileMenu} className="flex min-h-11 items-center text-left w-full px-3 py-3 rounded-md text-base font-medium text-text-primary hover:bg-surface-canvas hover:text-brand-primary transition-colors">
                                PDF
                            </Link>
                            <Link to="/sau-assignment-cover-page" onClick={closeMobileMenu} className="flex min-h-11 items-center text-left w-full px-3 py-3 rounded-md text-base font-medium text-text-primary hover:bg-surface-canvas hover:text-brand-primary transition-colors">
                                Cover Page
                            </Link>

                            {user ? (
                                <>
                                    <Link to="/profile" onClick={closeMobileMenu} className="flex min-h-11 items-center px-3 py-3 rounded-md text-base font-medium text-text-primary hover:bg-surface-canvas hover:text-brand-primary transition-colors">
                                        Profile
                                    </Link>

                                    {role === 'admin' && (
                                        <Link to="/admin" onClick={closeMobileMenu} className="flex min-h-11 items-center px-3 py-3 rounded-md text-base font-medium text-text-primary hover:bg-surface-canvas hover:text-brand-primary transition-colors">
                                            Admin Dashboard
                                        </Link>
                                    )}

                                    {(role === 'admin' || role === 'collector') && (
                                        <Link to="/upload" onClick={closeMobileMenu} className="flex min-h-11 items-center px-3 py-3 rounded-md text-base font-medium text-brand-primary bg-surface-canvas hover:opacity-90 transition-colors">
                                            + Upload Question
                                        </Link>
                                    )}

                                    <button
                                        onClick={handleSignOut}
                                        className="w-full min-h-11 text-left px-3 py-3 rounded-md text-base font-medium text-brand-primary hover:bg-surface-canvas transition-colors mt-2"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <div className="pt-2">
                                    <Link to="/login" onClick={closeMobileMenu} className="flex min-h-11 w-full items-center justify-center text-center bg-brand-primary text-white px-5 py-3 rounded-md text-base font-semibold hover:opacity-90 transition-colors">
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

            <footer className="w-full bg-surface-card border-t border-border-subtle mt-auto transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    {/* Footer Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
                        {/* Brand Column */}
                        <div className="col-span-2 md:col-span-1">
                            <Link to="/" className="text-xl font-semibold text-brand-primary hover:opacity-80 transition-opacity inline-block mb-4">
                                SAU Q-Bank
                            </Link>
                            <p className="text-sm text-text-muted leading-relaxed">
                                Built by SAU students, for SAU students. Access previous year questions, study materials, and AI-powered tutoring.
                            </p>
                        </div>

                        {/* Tools Column */}
                        <div>
                            <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wider mb-4">
                                Tools
                            </h3>
                            <ul className="space-y-3">
                                <li>
                                    <Link to="/questions" className="text-sm text-text-muted hover:text-brand-primary transition-colors">
                                        Browse Questions
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/study-materials" className="text-sm text-text-muted hover:text-brand-primary transition-colors">
                                        Study Materials
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/?ai-tutor=open" className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-primary hover:opacity-80 transition-opacity">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                        </svg>
                                        Ask AI Tutor
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Faculties Column */}
                        <div>
                            <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wider mb-4">
                                Faculties
                            </h3>
                            <ul className="space-y-3">
                                <li>
                                    <Link to="/sau-economics-question" className="text-sm text-text-muted hover:text-brand-primary transition-colors">
                                        Agricultural Economics
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/sau-agriculture-question" className="text-sm text-text-muted hover:text-brand-primary transition-colors">
                                        Agriculture
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/sau-asvm-question" className="text-sm text-text-muted hover:text-brand-primary transition-colors">
                                        Animal Science & Vet Med
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Resources Column */}
                        <div>
                            <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wider mb-4">
                                Resources
                            </h3>
                            <ul className="space-y-3">
                                <li>
                                    <Link to="/sau-question-bank-pdf" className="text-sm text-text-muted hover:text-brand-primary transition-colors">
                                        Question Bank PDF
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/sau-notes" className="text-sm text-text-muted hover:text-brand-primary transition-colors">
                                        Lecture Notes
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/sau-admission-preparation" className="text-sm text-text-muted hover:text-brand-primary transition-colors">
                                        Admission Prep
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/sau-assignment-cover-page" className="text-sm text-text-muted hover:text-brand-primary transition-colors">
                                        Cover Page Generator
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="pt-8 border-t border-border-subtle flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="flex flex-wrap justify-center items-center gap-4 text-sm text-text-muted">
                            <p>
                                Developed by{' '}
                                <Link to="/developer" className="text-text-muted font-medium hover:text-brand-primary transition-colors">
                                    Argho
                                </Link>
                            </p>
                            <span className="hidden sm:inline text-text-muted">&bull;</span>
                            <p>
                                Questions by{' '}
                                <Link to="/contributors" className="text-text-muted font-medium hover:text-brand-secondary transition-colors">
                                    Contributors
                                </Link>
                            </p>
                        </div>

                        <p className="text-xs text-text-muted">
                            © {new Date().getFullYear()} SAU Question Bank. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
            <DeveloperBadge />
            <FloatingAITutor />
        </div>
    );
};

export default Layout;
