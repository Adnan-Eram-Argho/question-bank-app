import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { supabase } from '../lib/supabaseClient';

interface Contributor {
    email: string;
    full_name: string | null;
    bio: string | null;
    avatar_url: string | null;
}

// Skeleton card shown while loading
const SkeletonCard = () => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border dark:border-gray-700 text-center animate-pulse">
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
                // Fetch directly from Supabase — avoids Render cold-start delay
                const { data, error } = await supabase
                    .from('users')
                    .select('email, full_name, bio, avatar_url, role')
                    .in('role', ['collector', 'admin'])
                    .order('full_name', { ascending: true });

                if (error) throw error;
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
        <div className="max-w-5xl mx-auto p-6 mt-10">
            <Helmet>
                <title>Contributors | SAU Agricultural Economics Question Bank</title>
                <meta name="description" content="Meet the dedicated contributors who collect and upload past exam questions for the Agricultural Economics faculty of Sher-e-Bangla Agricultural University (SAU)." />
                <meta property="og:title" content="Contributors | SAU Agricultural Economics Question Bank" />
                <meta property="og:description" content="Meet the dedicated contributors who collect and upload past exam questions for the SAU Agricultural Economics faculty." />
            </Helmet>
            <h1 className="text-3xl font-bold text-center text-secondary-800 dark:text-secondary-200 mb-8">
                Our Valued Contributors
            </h1>
            <p className="text-center text-gray-600 dark:text-gray-400 mb-10">
                These users have dedicated their time to collect and upload questions for the faculty.
            </p>

            {loading ? (
                // Show 3 skeleton cards while data loads
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <SkeletonCard />
                    <SkeletonCard />
                    <SkeletonCard />
                </div>
            ) : contributors.length === 0 ? (
                <p className="text-center text-gray-500">No contributors found yet.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {contributors.map((c, index) => (
                        <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border dark:border-gray-700 text-center hover:shadow-xl transition-shadow">
                            <div className="w-20 h-20 bg-accent-500 rounded-full mx-auto flex items-center justify-center text-white text-2xl font-bold mb-4 overflow-hidden">
                                {c.avatar_url ? (
                                    <img src={c.avatar_url} alt={c.full_name || c.email} className="w-full h-full object-cover" />
                                ) : (
                                    <span>{(c.full_name || c.email).charAt(0).toUpperCase()}</span>
                                )}
                            </div>
                            <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200">
                                {c.full_name || 'Anonymous Contributor'}
                            </h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{c.email}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-300 italic">
                                "{c.bio || 'No bio provided.'}"
                            </p>
                        </div>
                    ))}
                </div>
            )}

            <div className="text-center mt-8">
                <a href="/" className="text-secondary-600 hover:underline">← Back to Home</a>
            </div>
        </div>
    );
};

export default Contributors;