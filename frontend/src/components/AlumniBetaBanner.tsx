import { useState } from 'react';

const ALUMNI_URL = 'https://sau-alumni.vercel.app/';

export default function AlumniBetaBanner() {
  const [visible, setVisible] = useState<boolean>(true);

  if (!visible) return null;

  const dismiss = () => setVisible(false);

  return (
    <div
      role="region"
      aria-label="Alumni Beta Website Announcement"
      data-alumni-banner
      className="fixed bottom-0 left-0 right-0 z-[9999] w-full bg-brand-primary text-white  border-t border-emerald-500/30 dark:border-emerald-500/20"
    >
      <div className="mx-auto flex max-h-[35vh] max-w-7xl flex-col gap-2 overflow-y-auto px-3 py-3 sm:max-h-none sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-4 sm:py-2.5">
        <p className="min-w-0 flex-1 text-xs leading-relaxed sm:text-sm">
          🎓 <strong className="font-semibold">SAU Alumni Network এখন Beta-তে!</strong> বিনামূল্যে রেজিস্ট্রেশন করে আপনার ব্যাচমেট, সিনিয়র ও অ্যালামনাইদের সাথে যুক্ত হোন। সাইটটি ঘুরে দেখুন, মতামত জানান আর বন্ধুদের সাথে শেয়ার করুন।
        </p>
        <div className="flex shrink-0 items-center gap-2">
          <a
            href={ALUMNI_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 flex-1 items-center justify-center whitespace-nowrap rounded-md bg-surface-card px-4 py-2 text-sm font-semibold text-emerald-800 transition-colors hover:bg-emerald-50 dark:bg-emerald-100 dark:text-emerald-950 dark:hover:bg-surface-card sm:flex-none"
          >
            রেজিস্ট্রেশন করুন
          </a>
          <button
            type="button"
            onClick={dismiss}
            aria-label="Close"
            className="shrink-0 inline-flex items-center justify-center min-h-11 min-w-11 rounded-md text-white/80 hover:text-white hover:bg-surface-card/10 dark:hover:bg-black/20 text-xl font-semibold leading-none transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}
