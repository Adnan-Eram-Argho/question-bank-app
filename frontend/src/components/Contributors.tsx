import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'https://question-bank-app.onrender.com';

interface Contributor {
  email: string;
  full_name: string | null;
  bio: string | null;
  avatar_url: string | null;
}

const SkeletonCard = () => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 text-center animate-pulse">
    <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4" />
    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto mb-2" />
    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto mb-4" />
    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mb-1" />
    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6 mx-auto" />
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-4">
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
          <h1 className="text-3xl font-bold bg-gradient-to-r from-secondary-700 to-secondary-500 dark:from-secondary-300 dark:to-secondary-400 bg-clip-text text-transparent mb-3">
            Our Valued Contributors
          </h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            These individuals have dedicated their time to collect and upload past exam questions for the faculty.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : contributors.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-800 p-12 text-center shadow-sm">
            <p className="text-gray-500 dark:text-gray-400">No contributors found yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contributors.map((c, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-20 h-20 rounded-full mx-auto mb-4 overflow-hidden bg-accent-500 flex items-center justify-center text-white text-2xl font-bold ring-4 ring-secondary-100 dark:ring-secondary-900/40">
                  {c.avatar_url ? (
                    <img src={c.avatar_url} alt={c.full_name || c.email} className="w-full h-full object-cover" />
                  ) : (
                    <span>{(c.full_name || c.email).charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                  {c.full_name || 'Anonymous Contributor'}
                </h3>
                <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">{c.email}</p>
                {c.bio && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 italic leading-relaxed">
                    "{c.bio}"
                  </p>
                )}
              </div>
            ))}
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

export default Contributors;