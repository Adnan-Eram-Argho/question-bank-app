Stack

    frontend/ — React 19 + Vite 8 + TypeScript + TailwindCSS 3.4 (JIT) + Framer Motion + React Router v7
    backend/ — Express + TS. DO NOT modify for UI tasks.
    Dark mode: existing class strategy via ThemeContext (check tailwind.config.js darkMode).

Commands

    Build + typecheck: cd frontend && npm run build — run after every batch; ZERO TS errors required.
    Typecheck only: cd frontend && npx tsc --noEmit.
    Do not leave dev servers running; verify via build.

Non-negotiable rules

    Strict TS: no any/as any; catch blocks use unknown + instanceof Error.
    NEVER construct Tailwind classes dynamically (no bg-${color}-100). Static literals only — JIT purging deletes dynamic classes.
    UI-only refactor: do NOT touch data fetching, routing, auth, Supabase, upload/admin logic, or SEO markup (SEO.tsx, seoConfig.ts, JSON-LD, Breadcrumb.tsx, sitemap.xml, robots.txt, react-helmet-async usage).
    SAUCoverPageGenerator preview must stay print-safe: white bg, black text, A4, @media print intact; DOCX export must keep working unchanged.
    Icons only from src/components/icons.tsx (typed props, className override). No emojis as UI icons. New icons go there.
    Keep Vercel Analytics, react-hot-toast, IntersectionObserver cleanup patterns intact.
    Delete files you orphan (e.g. HeroParticles.tsx, DeveloperBadge.tsx after removal) — no dead code.

Design system (authoritative — see docs/ui-audit.md)
Tokens — CSS variables in index.css (:root light, .dark dark), mapped in tailwind.config.js as rgb(var(--x) / <alpha-value>):

surface-canvas #F8FAF8 / #0D140F · surface-card #FFFFFF / #141F17 ·border-subtle #E2E8E3 / #233327 · brand-primary #1B5E38 / #4ADE80 ·brand-secondary #8B5E14 / #FBBF24 · text-primary #111C13 / #F0FDF4 · text-muted #4B5E4F / #9BB0A0Replace ALL arbitrary bg-[#…]/text-[#…]/border-[#…] hexes with these tokens.
Typography

    Inter + Noto Sans Bengali, weights 400/500/600, Google Fonts with preconnect in index.html.
    fontFamily: Inter, 'Noto Sans Bengali', ui-sans-serif, system-ui, sans-serif
    Bangla body line-height ≥ 1.6 (leading-relaxed on body copy).
    font-bold/font-extrabold → font-semibold; body text font-normal.

Shape & elevation

    Only rounded-md (controls) and rounded-lg (cards/modals). Remove rounded-xl/2xl/3xl and rounded-full on rectangular buttons.
    Borders over shadows: 1px border-subtle; shadow-sm only on truly floating layers (sticky navbar, open dropdown, modal).
    Cards: flat, hover = hover:border-brand-primary/50 transition-colors duration-150. No hover translate, no gradient top bars, no bg-clip-text.

Motion

    No animate-ping/pulse/bounce loops. No canvas particles.
    ScrollReveal: respect useReducedMotion(); disabled below sm: screens.
    No whileHover y-shifts.

Accessibility

    Every interactive element: focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2.
    Mobile touch targets ≥ 44×44px. Icon-only buttons need aria-label.
    Replace hardcoded "→" with ArrowRightIcon (add to icons.tsx).
    Muted text = text-muted token only (replace text-gray-400/500).