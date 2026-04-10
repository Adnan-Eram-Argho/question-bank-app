import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const DeveloperBadge: React.FC = () => {
    const [isHovered, setIsHovered] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    React.useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const isExpanded = isHovered || isMobile;

    return (
        <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.5 }}
            className="fixed bottom-6 left-6 z-50 flex items-end drop-shadow-2xl"
        >
            <Link
                to="/developer"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="group relative flex items-center justify-center p-[2px] rounded-full outline-none focus:outline-none cursor-pointer"
            >
                {/* 
                    Outer glowing gradient border 
                    Visible and rotating subtly on hover 
                */}
                <motion.div 
                    initial={false}
                    animate={{ rotate: isHovered ? 180 : 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-green-400 via-amber-400 to-green-500 opacity-30 group-hover:opacity-100 blur-[2px] transition-all duration-500" 
                />

                {/* Main Card Content that expands automatically */}
                <motion.div
                    layout
                    className="relative flex items-center bg-white/90 dark:bg-[#0A0F1E]/90 rounded-full p-1 shadow-inner overflow-hidden backdrop-blur-xl border border-white/50 dark:border-white/5"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                >
                    {/* Circular Icon / Avatar section */}
                    <motion.div 
                        layout 
                        className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 border border-gray-200/50 dark:border-gray-700/50 shadow-sm relative z-10 overflow-hidden"
                    >
                        {/* Inner hover glow for the icon */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-green-400/20 to-amber-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />
                        
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                            className="text-gray-600 dark:text-gray-400 group-hover:text-amber-500 transition-colors duration-300 relative z-10"
                        >
                            <polyline points="16 18 22 12 16 6"></polyline>
                            <polyline points="8 6 2 12 8 18"></polyline>
                        </svg>
                    </motion.div>

                    {/* Expanding Text Section */}
                    <AnimatePresence>
                        {isExpanded && (
                            <motion.div
                                initial={{ width: 0, opacity: 0 }}
                                animate={{ width: 'auto', opacity: 1 }}
                                exit={{ width: 0, opacity: 0 }}
                                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                                className="flex flex-col justify-center whitespace-nowrap overflow-hidden"
                            >
                                <div className="ml-3 pr-4 flex flex-col pl-1">
                                    <motion.span 
                                        initial={{ x: -10, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        exit={{ x: -10, opacity: 0 }}
                                        transition={{ delay: 0.05, duration: 0.2 }}
                                        className="text-[9px] font-extrabold tracking-[0.2em] text-gray-400 dark:text-gray-500 uppercase leading-none mb-1"
                                    >
                                        Developed By
                                    </motion.span>
                                    <motion.span 
                                        initial={{ x: -10, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        exit={{ x: -10, opacity: 0 }}
                                        transition={{ delay: 0.1, duration: 0.2 }}
                                        className="text-sm font-black bg-gradient-to-r from-green-500 to-amber-500 bg-clip-text text-transparent leading-none flex items-center gap-2"
                                    >
                                        Argho
                                        <div className="relative flex h-1.5 w-1.5 ml-1">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-500 drop-shadow-[0_0_2px_rgba(245,158,11,0.8)]"></span>
                                        </div>
                                    </motion.span>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </Link>
        </motion.div>
    );
};

export default DeveloperBadge;
