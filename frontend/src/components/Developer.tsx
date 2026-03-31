import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

const DEV = {
  name: 'Adnan-Eram Argho',
  title: 'Full-Stack Developer',
  subtitle: 'Building tools for Agricultural Education',

  avatarUrl: 'profile.png',
  avatarInitials: 'A',

  bio: `I'm a passionate full-stack developer and student at Sher-e-Bangla Agricultural University. 
  I built this Question Bank platform to help students access past exam questions easily and academics 
  to manage course resources in one place. I love turning real-world problems into clean, useful software.`,

  github: 'https://github.com/Adnan-Eram-Argho',
  linkedin: 'https://www.linkedin.com/in/md-adnan-eram-argho/',
  email: 'adnaneramargho@gmail.com',
  portfolio: 'https://portfolio-dusky-five-42.vercel.app/',

  education: [
    {
      degree: 'B.Sc. (Hons.) in Agricultural Economics',
      institution: 'Sher-e-Bangla Agricultural University',
      year: '2022 – Present',
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
  <svg className="w-4 h-4 text-primary-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
);

const Developer = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-4">
      <Helmet>
        <title>Developer | SAU Agricultural Economics Question Bank</title>
        <meta name="description"
          content="Learn about the developer behind the SAU Agricultural Economics Question Bank — a full-stack web application for Sher-e-Bangla Agricultural University." />
        <meta property="og:title" content="Developer | SAU Agricultural Economics Question Bank" />
        <meta property="og:description" content="Full-stack developer profile for the SAU Agri-Econ Question Bank application." />
      </Helmet>

      <div className="max-w-3xl mx-auto space-y-6">

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
          <div className="h-24 bg-gradient-to-r from-primary-600 via-primary-500 to-secondary-500" />

          <div className="px-8 pb-8">
            <div className="-mt-14 mb-4 flex items-end justify-between">
              <div className="w-24 h-24 rounded-full ring-4 ring-white dark:ring-gray-800 overflow-hidden bg-primary-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                {DEV.avatarUrl
                  ? <img src={DEV.avatarUrl} alt={DEV.name} className="w-full h-full object-cover" />
                  : DEV.avatarInitials}
              </div>

              <div className="flex gap-2 mt-2">
                {DEV.github && (
                  <a href={DEV.github} target="_blank" rel="noreferrer"
                    className="p-2 rounded-lg text-gray-500 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-colors"
                    title="GitHub">
                    <IconGitHub />
                  </a>
                )}
                {DEV.linkedin && (
                  <a href={DEV.linkedin} target="_blank" rel="noreferrer"
                    className="p-2 rounded-lg text-gray-500 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-colors"
                    title="LinkedIn">
                    <IconLinkedIn />
                  </a>
                )}
                {DEV.email && (
                  <a href={`mailto:${DEV.email}`}
                    className="p-2 rounded-lg text-gray-500 hover:text-secondary-600 dark:hover:text-secondary-400 hover:bg-secondary-50 dark:hover:bg-secondary-900/30 transition-colors"
                    title="Email">
                    <IconMail />
                  </a>
                )}
                {DEV.portfolio && (
                  <a href={DEV.portfolio} target="_blank" rel="noreferrer"
                    className="p-2 rounded-lg text-gray-500 hover:text-secondary-600 dark:hover:text-secondary-400 hover:bg-secondary-50 dark:hover:bg-secondary-900/30 transition-colors"
                    title="Portfolio">
                    <IconGlobe />
                  </a>
                )}
              </div>
            </div>

            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{DEV.name}</h1>
            <p className="text-primary-600 dark:text-primary-400 font-medium">{DEV.title}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{DEV.subtitle}</p>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{DEV.bio}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-primary-600 dark:text-primary-400 mb-4">
              Education
            </h2>
            <ul className="space-y-4">
              {DEV.education.map((edu, i) => (
                <li key={i}>
                  <p className="font-semibold text-gray-800 dark:text-gray-100 text-sm leading-snug">{edu.degree}</p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">{edu.institution}</p>
                  <span className="inline-block mt-1 text-xs font-medium bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 px-2 py-0.5 rounded-full">
                    {edu.year}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-primary-600 dark:text-primary-400 mb-4">
              Tech Stack
            </h2>
            <div className="flex flex-wrap gap-2">
              {DEV.skills.map((skill) => (
                <span key={skill}
                  className="px-3 py-1 text-xs font-medium rounded-full bg-secondary-100 dark:bg-secondary-900/40 text-secondary-800 dark:text-secondary-300 border border-secondary-200 dark:border-secondary-800">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {DEV.highlights.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-primary-600 dark:text-primary-400 mb-4">
              Project Highlights
            </h2>
            <ul className="space-y-2">
              {DEV.highlights.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <IconCheck />
                  <span className="text-gray-600 dark:text-gray-300 text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="text-center">
          <Link to="/" className="text-sm text-secondary-600 dark:text-secondary-400 hover:underline">
            ← Back to Question Bank
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Developer;