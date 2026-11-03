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
      className="fixed bottom-0 left-0 right-0 z-[9999] w-full bg-brand-primary text-white  border-t border-emerald-500/30 dark:border-emerald-500/20"
    >
      <div className="max-w-7xl mx-auto px-4 py-2.5 sm:py-2 flex items-center justify-between gap-3">
        <p className="flex-1 min-w-0 text-xs sm:text-sm leading-snug sm:leading-normal">
          🎓 <strong className="font-semibold">SAU Alumni Network এখন Beta-তে!</strong> বিনামূল্যে রেজিস্ট্রেশন করে আপনার ব্যাচমেট, সিনিয়র ও অ্যালামনাইদের সাথে যুক্ত হোন। সাইটটি ঘুরে দেখুন, মতামত জানান আর বন্ধুদের সাথে শেয়ার করুন।
        </p>
        <div className="flex items-center gap-2 shrink-0">
          <a
            href={ALUMNI_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center justify-center bg-surface-card text-emerald-800 dark:bg-emerald-100 dark:text-emerald-950 font-semibold px-3 py-1.5 rounded-lg text-xs sm:text-sm hover:bg-emerald-50 dark:hover:bg-surface-card transition-all  active:scale-95 whitespace-nowrap min-h-[32px]"
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
