import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// App.tsx-এ Developer পেজের আসল রুট মিলিয়ে নিন
const DEVELOPER_PAGE_PATH = '/developer';

const DeveloperBadge: React.FC = () => {
    const [expanded, setExpanded] = useState(false);
    const [bannerHeight, setBannerHeight] = useState(0);

    // Alumni ব্যানার দেখা দিলে নিজেকে ওটার উপরে সরাই, বন্ধ হলে নেমে আসি
    useEffect(() => {
        const measure = () => {
            const banner = document.querySelector('[data-alumni-banner]');
            setBannerHeight(banner instanceof HTMLElement ? banner.offsetHeight : 0);
        };
        measure();
        const observer = new MutationObserver(measure);
        observer.observe(document.body, { childList: true, subtree: true });
        return () => observer.disconnect();
    }, []);

    // বাইরে ক্লিক করলে কলাপ্স
    useEffect(() => {
        const onPointerDown = (e: MouseEvent) => {
            if (e.target instanceof HTMLElement && !e.target.closest('[data-developer-badge]')) {
                setExpanded(false);
            }
        };
        document.addEventListener('pointerdown', onPointerDown);
        return () => document.removeEventListener('pointerdown', onPointerDown);
    }, []);

    return (
        <div
            data-developer-badge
            className="fixed left-4 z-[70] flex items-center"
            style={{ bottom: `calc(1rem + ${bannerHeight}px)` }}
        >
            {expanded ? (
                <Link
                    to={DEVELOPER_PAGE_PATH}
                    onClick={() => setExpanded(false)}
                    className="flex items-center gap-2 min-h-11 px-3 py-2 rounded-full bg-surface-card border border-border-subtle text-xs font-medium text-text-muted hover:text-brand-primary transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
                >
                    <span className="h-2 w-2 rounded-full bg-brand-primary" aria-hidden="true" />
                    Developed by Md. Adnan Eram Argho
                </Link>
            ) : (
                <button
                    type="button"
                    aria-label="About the developer"
                    aria-expanded={expanded}
                    onClick={() => setExpanded((v) => !v)}
                    className="flex items-center justify-center h-11 w-11 rounded-full bg-surface-card border border-border-subtle text-brand-primary hover:border-brand-primary/50 transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
                    </svg>
                </button>
            )}
        </div>
    );
};

export default DeveloperBadge;