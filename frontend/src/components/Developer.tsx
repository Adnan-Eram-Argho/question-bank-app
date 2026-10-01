import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ScrollReveal from './ScrollReveal';

const DEV = {
  name: 'Adnan-Eram Argho',
  title: 'Full-Stack Developer & AI Engineer',
  subtitle: 'Building tools for SAU students and agricultural research',

  avatarUrl: '/profile.png',
  avatarInitials: 'A',

  bio: [
    `I'm a student of Agricultural Economics at Sher-e-Bangla Agricultural University, and the person who built this Question Bank for my fellow SAU students.`,
    `I'm completely self-taught: 4+ years of coding, no CSE degree, just curiosity and a lot of building. Everything on this page started with a real problem I saw around campus, and I wanted to fix it with code.`,
    `Right now I'm exploring Data Science and Machine Learning, with a focus on bringing AI into agriculture.`,
  ],

  github: 'https://github.com/Adnan-Eram-Argho',
  linkedin: 'https://www.linkedin.com/in/md-adnan-eram-argho/',
  email: 'adnaneramargho@gmail.com',
  portfolio: 'https://adnan-eram-argho.github.io/portfolio/',

  stats: [
    { value: '4+', label: 'Years of coding' },
    { value: '5', label: 'Live projects' },
    { value: '162', label: 'Courses in this Question Bank' },
    { value: '25+', label: 'Online certificates' },
  ],

  education: [
    {
      degree: 'B.Sc. (Hons.) in Agricultural Economics',
      institution: 'Sher-e-Bangla Agricultural University',
      year: '2024 – Present',
    },
  ],

  projects: [
    {
      name: 'SAU Alumni Network',
      desc: 'Alumni directory for SAU. Search batchmates by name, batch, department or country. Role-based auth and a secure admin system, built at zero cost.',
      href: 'https://sau-alumni.vercel.app/',
    },
    {
      name: 'SAU EconHub',
      desc: 'Academic blog platform for Agricultural Economics students, with AI summaries, AI Bangla translation, math rendering and a rich editor.',
      href: 'https://sau-blogs.vercel.app',
    },
    {
      name: 'Rice AI Doctor',
      desc: 'Rice disease detection with a custom-trained model, trained on Bangladeshi field data. Runs offline as a PWA on low-end phones, 94% accuracy.',
      href: 'https://rice-ai-app.vercel.app/',
    },
    {
      name: 'Bangladesh Monopoly',
      desc: 'Real-time multiplayer Monopoly with Bangladeshi locations, BDT currency and local Luck and Public Fund cards.',
      href: 'https://arghor-monopoly.vercel.app/',
    },
  ],

  skillGroups: [
    {
      title: 'Frontend',
      skills: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'shadcn/ui', 'Framer Motion', 'Vite'],
    },
    {
      title: 'Backend & Database',
      skills: ['Node.js', 'Express', 'Flask', 'REST API', 'Socket.io', 'Supabase', 'PostgreSQL', 'MongoDB', 'Firebase'],
    },
    {
      title: 'Data Science & AI',
      skills: [
        'Python', 'NumPy', 'Pandas', 'Matplotlib', 'Seaborn', 'Streamlit',
        'Statistics & Probability', 'Machine Learning', 'Computer Vision', 'ONNX',
      ],
    },
    {
      title: 'Core & Tools',
      skills: ['C++', 'Algorithms & Data Structures', 'OOP', 'Git & GitHub', 'Vercel', 'Google Colab'],
    },
  ],

  highlights: [
    'Designed and deployed this full-stack SAU Question Bank from scratch, covering 162 courses',
    'Implemented role-based auth (admin / collector) with Supabase',
    'Built a multi-image drag-and-drop upload system for question papers',
    'Trained a custom rice disease detection model and shipped it as an offline PWA',
    'Ranked in the top 15% among 5000 students in the Programming Hero web development course',
  ],
};

const CARD =
  'bg-white/80 dark:bg-[#111827]/80 backdrop-blur-md rounded-2xl shadow-sm border border-[rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.07)]';

const SECTION_TITLE =
  'text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-5';

const ITEM_VARIANTS = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
};

const creatorJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Adnan Eram Argho',
  jobTitle: DEV.title,
  url: DEV.portfolio,
  alumniOf: {
    '@type': 'EducationalOrganization',
    name: 'Sher-e-Bangla Agricultural University',
  },
  sameAs: [DEV.github, DEV.linkedin],
  knowsAbout: [
    'Full-Stack Development',
    'React',
    'Next.js',
    'Data Science',
    'Machine Learning',
    'Agricultural AI',
  ],
};

const IconGitHub = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" clipRule="evenodd"
      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483
         0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466
         -.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832
         .092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688
         -.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844a9.59 9.59 0
         012.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595
         1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012
         2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

const IconLinkedIn = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136
             1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85
             3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062
             0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452z" />
  </svg>
);

const IconMail = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const IconGlobe = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03
         3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" />
  </svg>
);

const IconCheck = () => (
  <svg className="w-4 h-4 text-green-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
);

const IconExternal = () => (
  <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M13.5 6H18v4.5M18 6l-7.5 7.5M10 6H6.75A1.75 1.75 0 005 7.75v9.5C5 18.216 5.784 19 6.75 19h9.5c.966 0 1.75-.784 1.75-1.75V14" />
  </svg>
);

const Developer = () => {
  return (
    <div className="animate-fade-in py-12 px-4">
      <Helmet>
        <title>Developer | SAU Agricultural Economics Question Bank</title>
        <meta name="description"
          content="Meet Adnan-Eram Argho, the SAU student and self-taught full-stack developer behind the SAU Agricultural Economics Question Bank, SAU Alumni Network, SAU EconHub and Rice AI Doctor." />
        <meta property="og:title" content="Developer | SAU Agricultural Economics Question Bank" />
        <meta property="og:description" content="Full-stack developer profile for the SAU Agri-Econ Question Bank application." />
        <script type="application/ld+json">{JSON.stringify(creatorJsonLd)}</script>
      </Helmet>

      <div className="max-w-3xl mx-auto space-y-6">

        {/* Hero */}
        <motion.div
          className={`${CARD} overflow-hidden`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15, ease: 'easeOut' }}
        >
          <div className="h-32 bg-gradient-to-r from-green-500 via-emerald-400 to-amber-500" />

          <div className="px-6 sm:px-8 pb-8">
            <div className="-mt-16 mb-4 flex items-end justify-between">
              <div className="w-28 h-28 rounded-full ring-4 ring-white dark:ring-[#111827] overflow-hidden bg-white dark:bg-[#0A0F1E] flex items-center justify-center text-slate-800 dark:text-slate-200 text-3xl font-bold shadow-lg">
                {DEV.avatarUrl
                  ? <img src={DEV.avatarUrl} alt={DEV.name} className="w-full h-full object-cover" />
                  : DEV.avatarInitials}
              </div>

              <div className="flex gap-2 mt-2">
                {DEV.github && (
                  <a href={DEV.github} target="_blank" rel="noreferrer"
                    className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-500/10 transition-colors"
                    title="GitHub" aria-label="GitHub">
                    <IconGitHub />
                  </a>
                )}
                {DEV.linkedin && (
                  <a href={DEV.linkedin} target="_blank" rel="noreferrer"
                    className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors"
                    title="LinkedIn" aria-label="LinkedIn">
                    <IconLinkedIn />
                  </a>
                )}
                {DEV.email && (
                  <a href={`mailto:${DEV.email}`}
                    className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-colors"
                    title="Email" aria-label="Email">
                    <IconMail />
                  </a>
                )}
                {DEV.portfolio && (
                  <a href={DEV.portfolio} target="_blank" rel="noreferrer"
                    className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-500/10 transition-colors"
                    title="Portfolio" aria-label="Portfolio">
                    <IconGlobe />
                  </a>
                )}
              </div>
            </div>

            <h1 className="text-3xl font-bold text-slate-900 dark:text-[#F1F5F9]">{DEV.name}</h1>
            <p className="text-green-600 dark:text-green-400 font-semibold text-lg mt-1">{DEV.title}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">{DEV.subtitle}</p>

            <div className="space-y-3">
              {DEV.bio.map((para, i) => (
                <p key={i} className="text-slate-700 dark:text-slate-300 leading-relaxed">{para}</p>
              ))}
            </div>

            <a href={DEV.portfolio} target="_blank" rel="noreferrer"
              className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-semibold shadow-md shadow-green-500/20 hover:shadow-lg hover:shadow-green-500/30 hover:-translate-y-0.5 transition-all">
              View my full portfolio
              <IconExternal />
            </a>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-4 gap-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
        >
          {DEV.stats.map((s) => (
            <motion.div key={s.label} className={`${CARD} px-3 py-4 text-center`} variants={ITEM_VARIANTS}>
              <p className="text-2xl font-bold bg-gradient-to-r from-green-500 to-amber-500 bg-clip-text text-transparent">
                {s.value}
              </p>
              <p className="text-[11px] leading-tight text-slate-500 dark:text-slate-400 mt-1">{s.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Projects */}
        <ScrollReveal direction="up" delay={0.1}>
          <div className={`${CARD} p-6`}>
            <h2 className={SECTION_TITLE}>More Projects for SAU &amp; Beyond</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {DEV.projects.map((p) => (
                <a key={p.name} href={p.href} target="_blank" rel="noreferrer"
                  className="group flex flex-col rounded-xl border border-[rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.07)] bg-slate-50/60 dark:bg-[#0A0F1E]/60 p-4 hover:border-green-400/50 hover:bg-green-50/50 dark:hover:bg-green-500/5 hover:-translate-y-0.5 transition-all">
                  <span className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-1.5 text-sm font-semibold text-slate-800 dark:text-slate-100">
                      {p.name}
                      <span className="text-slate-400 group-hover:text-green-500 transition-colors"><IconExternal /></span>
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-500/15 text-green-700 dark:text-green-400">
                      Live
                    </span>
                  </span>
                  <span className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">{p.desc}</span>
                </a>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Education + Tech Stack */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }}
        >
          <motion.div className={`${CARD} p-6`} variants={ITEM_VARIANTS}>
            <h2 className={SECTION_TITLE}>Education</h2>
            <ul className="space-y-4">
              {DEV.education.map((edu, i) => (
                <li key={i}>
                  <p className="font-semibold text-slate-800 dark:text-slate-100 text-sm leading-snug">{edu.degree}</p>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">{edu.institution}</p>
                  <span className="inline-block mt-2 text-xs font-semibold bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 px-2.5 py-1 rounded-md border border-green-200/50 dark:border-green-500/20">
                    {edu.year}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div className={`${CARD} p-6`} variants={ITEM_VARIANTS}>
            <h2 className={SECTION_TITLE}>Tech Stack</h2>
            <div className="space-y-4">
              {DEV.skillGroups.map((group) => (
                <div key={group.title}>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500 mb-1.5">
                    {group.title}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {group.skills.map((skill) => (
                      <span key={skill}
                        className="px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-100 dark:bg-[#0A0F1E] text-slate-700 dark:text-slate-300 border border-[rgba(0,0,0,0.05)] dark:border-[rgba(255,255,255,0.05)] shadow-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Highlights */}
        {DEV.highlights.length > 0 && (
          <ScrollReveal direction="up" delay={0.2}>
            <div className={`${CARD} p-6`}>
              <h2 className={SECTION_TITLE}>Highlights</h2>
              <ul className="space-y-3">
                {DEV.highlights.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <IconCheck />
                    <span className="text-slate-700 dark:text-slate-300 text-sm font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>
        )}

        {/* Feedback */}
        <ScrollReveal direction="up" delay={0.2}>
          <div className="rounded-2xl border border-green-200/60 dark:border-green-500/20 bg-gradient-to-br from-green-50 to-amber-50 dark:from-green-500/5 dark:to-amber-500/5 p-6 text-center">
            <h2 className="text-base font-bold text-slate-900 dark:text-[#F1F5F9]">
              Found a missing question or a bug?
            </h2>
            <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400">
              This Question Bank grows with your help. Tell me what's missing and I'll fix it.
            </p>
            <a href={`mailto:${DEV.email}?subject=SAU Question Bank Feedback`}
              className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white dark:bg-[#111827] border border-green-300/60 dark:border-green-500/30 text-sm font-semibold text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-500/10 transition-colors">
              <IconMail />
              Send feedback
            </a>
          </div>
        </ScrollReveal>

        <div className="text-center pt-4">
          <Link to="/" className="inline-block text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-green-500 dark:hover:text-green-400 transition-colors">
            ← Back to Question Bank
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Developer;