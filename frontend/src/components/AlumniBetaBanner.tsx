import { useState } from 'react';

const ALUMNI_URL = 'https://sau-alumni.vercel.app/'; // ekhane real link boshao
const STORAGE_KEY = 'alumni-beta-banner-v1'; // notun message dile v2 koro

export default function AlumniBetaBanner() {
  const [visible, setVisible] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === null;
    } catch {
      return true;
    }
  });

  if (!visible) return null;

  const dismiss = () => {
    try {
      localStorage.setItem(STORAGE_KEY, 'dismissed');
    } catch {
      /* ignore */
    }
    setVisible(false);
  };

  return (
    <div
      role="region"
      aria-label="Alumni Beta Website Announcement"
      className="fixed bottom-0 left-0 right-0 z-[9999] w-full bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-700 dark:to-teal-800 text-white shadow-lg border-t border-emerald-500/30 dark:border-emerald-500/20"
    >
      <div className="max-w-7xl mx-auto px-4 py-2.5 sm:py-2 flex items-center justify-between gap-3">
        <p className="flex-1 min-w-0 text-xs sm:text-sm leading-snug sm:leading-normal">
          🎓 <strong className="font-semibold">SAU Alumni Website এখন Beta Testing-এ!</strong> সাইটটি ভিজিট করুন, আপনার মতামত জানান এবং সবার সাথে শেয়ার করে আমাকে সাহায্য করুন।
        </p>
        <div className="flex items-center gap-2 shrink-0">
          <a
            href={ALUMNI_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center justify-center bg-white text-emerald-800 dark:bg-emerald-100 dark:text-emerald-950 font-semibold px-3 py-1.5 rounded-lg text-xs sm:text-sm hover:bg-emerald-50 dark:hover:bg-white transition-all shadow-sm active:scale-95 whitespace-nowrap min-h-[32px]"
          >
            ভিজিট করুন
          </a>
          <button
            type="button"
            onClick={dismiss}
            aria-label="Close"
            className="shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-lg text-white/80 hover:text-white hover:bg-white/10 dark:hover:bg-black/20 text-xl font-bold leading-none transition-colors active:scale-95 focus:outline-none"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}