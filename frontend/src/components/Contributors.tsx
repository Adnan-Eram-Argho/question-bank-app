import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ScrollReveal from './ScrollReveal';

const API_URL = import.meta.env.VITE_API_URL || 'https://question-bank-app.onrender.com';

interface Contributor {
  email: string;
  full_name: string | null;
  bio: string | null;
  avatar_url: string | null;
}

const SkeletonCard = () => (
  <div className="bg-surface-card/80  rounded-lg  border border-[rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.07)] p-8 text-center ">
    <div className="w-24 h-24 bg-gray-200 bg-surface-card rounded-full mx-auto mb-5" />
    <div className="h-5 bg-gray-200 bg-surface-card rounded w-3/4 mx-auto mb-3" />
    <div className="h-4 bg-gray-200 bg-surface-card rounded w-1/2 mx-auto mb-5" />
    <div className="h-3 bg-gray-200 bg-surface-card rounded w-full mb-2" />
    <div className="h-3 bg-gray-200 bg-surface-card rounded w-5/6 mx-auto" />
  </div>
);

const Contributors = () => {
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContributors = async () => {
      try {
        const response = await fetch(`${API_URL}/api/contributors`);
        if (!response.ok) {
          throw new Error('Failed to fetch contributors');
        }
        const data = await response.json();
        setContributors(data || []);
      } catch (error) {
        console.error('Error fetching contributors:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchContributors();
  }, []);

  return (
    <div className="animate-fade-in py-12 px-4">
      <Helmet>
        <title>Contributors | SAU Agricultural Economics Question Bank</title>
        <meta name="description"
          content="Meet the dedicated contributors who collect and upload past exam questions for the Agricultural Economics faculty of Sher-e-Bangla Agricultural University (SAU)." />
        <meta property="og:title" content="Contributors | SAU Agricultural Economics Question Bank" />
        <meta property="og:description"
          content="Meet the dedicated contributors who collect and upload past exam questions for the SAU Agricultural Economics faculty." />
      </Helmet>

      <div className="max-w-5xl mx-auto space-y-10">
        <div className="text-center">
          <motion.h1
            className="text-4xl sm:text-5xl font-semibold tracking-tight text-text-primary  mb-4"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2, ease: 'easeOut' }}
          >
            Our Valued Contributors
          </motion.h1>
          <motion.p
            className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.35, ease: 'easeOut' }}
          >
            These individuals have dedicated their time to collect and upload past exam questions for the faculty.
          </motion.p>
        </div>

        {loading ? (
          <ScrollReveal direction="up">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          </ScrollReveal>
        ) : contributors.length === 0 ? (
          <ScrollReveal direction="up">
            <div className="bg-surface-card rounded-lg border border-border-subtle p-12 text-center ">
              <p className="text-text-muted dark:text-text-muted">No contributors found yet.</p>
            </div>
          </ScrollReveal>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07 } } }}
          >
            {contributors.map((c, index) => (
              <motion.div
                key={index}
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } } }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                whileTap={{ scale: 0.98 }}
                className="group bg-surface-card/80  rounded-lg  border border-[rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.07)] p-8 text-center  transition-all duration-300"
              >
                <div className="w-24 h-24 rounded-full mx-auto mb-5 p-[3px] bg-brand-primary ">
                  <div className="w-full h-full rounded-full overflow-hidden bg-surface-card bg-surface-canvas flex items-center justify-center text-slate-800 dark:text-slate-200 text-3xl font-semibold">
                    {c.avatar_url ? (
                      <img src={c.avatar_url} alt={c.full_name || c.email} className="w-full h-full object-cover" />
                    ) : (
                      <span>{(c.full_name || c.email).charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                </div>
                <h3 className="font-semibold text-xl text-slate-900 text-text-primary">
                  {c.full_name || 'Anonymous Contributor'}
                </h3>
                <p className="text-sm text-slate-400 dark:text-slate-500 mb-4">{c.email}</p>
                {c.bio && (
                  <p className="text-sm text-slate-500 dark:text-slate-400 italic leading-relaxed">
                    "{c.bio}"
                  </p>
                )}
              </motion.div>
            ))}
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

export default Contributors;