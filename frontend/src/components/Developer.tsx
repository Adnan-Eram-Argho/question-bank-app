import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const DEV = {
  name: 'Adnan-Eram Argho',
  title: 'Full-Stack Developer',
  subtitle: 'Building tools for Agricultural Education',

  avatarUrl: 'profile.png',
  avatarInitials: 'A',

  bio: `I'm a passionate full-stack developer and student at Sher-e-Bangla Agricultural University. 

I have gained proficiency in different technologies.My learning journey has been largely self-directed. I have explored and learned some technologies from multiple online sources, allowing me to develop a comprehensive understanding and versatile skill set. This experience has not only honed my technical abilities but also cultivated a strong problem-solving mindset and an eagerness to embrace new challenges.

I am passionate about programming and continuously learning new technologies to stay at the forefront of the ever-evolving tech landscape. I am excited to leverage my skills to contribute to innovative projects and collaborate with like-minded professionals in the field.`,

  github: 'https://github.com/Adnan-Eram-Argho',
  linkedin: 'https://www.linkedin.com/in/md-adnan-eram-argho/',
  email: 'adnaneramargho@gmail.com',
  portfolio: 'https://portfolio-dusky-five-42.vercel.app/',

  education: [
    {
      degree: 'B.Sc. (Hons.) in Agricultural Economics',
      institution: 'Sher-e-Bangla Agricultural University',
      year: '2024 – Present',
    },
  ],

  skills: [
    'React', 'TypeScript', 'Node.js', 'Express',
    'Supabase', 'PostgreSQL', 'Tailwind CSS', 'Vite',
    'Firebase', 'MongoDB', 'Python', 'C++',
    'Algorithms & Data Structures',
  ],

  highlights: [
    'Designed and deployed the full-stack SAU Question Bank from scratch',
    'Implemented role-based auth (admin / collector) with Supabase',
    'Built a multi-image drag-and-drop upload system for question papers',
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

const Developer = () => {
  return (
    <div className="animate-fade-in py-12 px-4">
      <Helmet>
        <title>Developer | SAU Agricultural Economics Question Bank</title>
        <meta name="description"
          content="Learn about the developer behind the SAU Agricultural Economics Question Bank — a full-stack web application for Sher-e-Bangla Agricultural University." />
        <meta property="og:title" content="Developer | SAU Agricultural Economics Question Bank" />
        <meta property="og:description" content="Full-stack developer profile for the SAU Agri-Econ Question Bank application." />
      </Helmet>

      <div className="max-w-3xl mx-auto space-y-6">

        <motion.div
          className="bg-white/80 dark:bg-[#111827]/80 backdrop-blur-md rounded-2xl shadow-sm border border-[rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.07)] overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15, ease: 'easeOut' }}
        >
          <div className="h-32 bg-gradient-to-r from-green-500 via-emerald-400 to-amber-500" />

          <div className="px-8 pb-8">
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
                    title="GitHub">
                    <IconGitHub />
                  </a>
                )}
                {DEV.linkedin && (
                  <a href={DEV.linkedin} target="_blank" rel="noreferrer"
                    className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors"
                    title="LinkedIn">
                    <IconLinkedIn />
                  </a>
                )}
                {DEV.email && (
                  <a href={`mailto:${DEV.email}`}
                    className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-colors"
                    title="Email">
                    <IconMail />
                  </a>
                )}
                {DEV.portfolio && (
                  <a href={DEV.portfolio} target="_blank" rel="noreferrer"
                    className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-500/10 transition-colors"
                    title="Portfolio">
                    <IconGlobe />
                  </a>
                )}
              </div>
            </div>

            <h1 className="text-3xl font-bold text-slate-900 dark:text-[#F1F5F9]">{DEV.name}</h1>
            <p className="text-green-600 dark:text-green-400 font-semibold text-lg mt-1">{DEV.title}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">{DEV.subtitle}</p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">{DEV.bio}</p>
          </div>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }}
        >
          <motion.div
            className="bg-white/80 dark:bg-[#111827]/80 backdrop-blur-md rounded-2xl shadow-sm border border-[rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.07)] p-6"
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } } }}
          >
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-5">
              Education
            </h2>
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

          <motion.div
            className="bg-white/80 dark:bg-[#111827]/80 backdrop-blur-md rounded-2xl shadow-sm border border-[rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.07)] p-6"
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } } }}
          >
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-5">
              Tech Stack
            </h2>
            <div className="flex flex-wrap gap-2">
              {DEV.skills.map((skill) => (
                <span key={skill}
                  className="px-3 py-1 text-xs font-semibold rounded-full bg-slate-100 dark:bg-[#0A0F1E] text-slate-700 dark:text-slate-300 border border-[rgba(0,0,0,0.05)] dark:border-[rgba(255,255,255,0.05)] shadow-sm">
                  {skill}
                </span>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {DEV.highlights.length > 0 && (
          <motion.div
            className="bg-white/80 dark:bg-[#111827]/80 backdrop-blur-md rounded-2xl shadow-sm border border-[rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.07)] p-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-5">
              Project Highlights
            </h2>
            <ul className="space-y-3">
              {DEV.highlights.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <IconCheck />
                  <span className="text-slate-700 dark:text-slate-300 text-sm font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}

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