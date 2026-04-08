import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';

interface UserProfileData {
    full_name: string;
    bio: string;
    avatar_url: string;
}

const Profile = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    const [formData, setFormData] = useState<UserProfileData>({
        full_name: '',
        bio: '',
        avatar_url: ''
    });
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    // Fetch current profile data
    useEffect(() => {
        const fetchProfile = async () => {
            if (!user) return;
            try {
                const { data: sessionData } = await supabase.auth.getSession();
                const accessToken = sessionData.session?.access_token;
                if (!accessToken) {
                    throw new Error('Missing auth session token');
                }

                const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://question-bank-app.onrender.com'}/api/user/profile`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                const currentUser = await response.json();
                if (!response.ok) {
                    throw new Error(currentUser.error || 'Failed to fetch profile');
                }

                if (currentUser?.id) {
                    setFormData({
                        full_name: currentUser.full_name || '',
                        bio: currentUser.bio || '',
                        avatar_url: currentUser.avatar_url || ''
                    });
                    setPreviewUrl(currentUser.avatar_url || null);
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [user]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setAvatarFile(file);
            setPreviewUrl(URL.createObjectURL(file)); // Create local preview
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage('');

        const data = new FormData();
        data.append('userId', user?.id || '');
        data.append('fullName', formData.full_name);
        data.append('bio', formData.bio);
        if (avatarFile) {
            data.append('avatar', avatarFile);
        }

        try {
            const { data: sessionData } = await supabase.auth.getSession();
            const accessToken = sessionData.session?.access_token;
            if (!accessToken) {
                throw new Error('Missing auth session token');
            }

            const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://question-bank-app.onrender.com'}/api/user/profile`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                body: data,
            });

            const result = await response.json();
            if (!response.ok) throw new Error(result.error);

            setMessage('Profile updated successfully!');
            // Update local state to reflect new avatar if changed
            if (result.user.avatar_url) {
                setFormData(prev => ({ ...prev, avatar_url: result.user.avatar_url }));
            }
        } catch (err: any) {
            setMessage(err.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
    );

    return (
        <div className="max-w-xl mx-auto p-4 sm:p-8 animate-fade-in mt-6">
            <div className="bg-white dark:bg-[#1E293B] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 sm:p-10">
                <div className="mb-8 text-center border-b border-gray-100 dark:border-gray-800 pb-6">
                    <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent mb-2">My Profile</h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Manage your personal information and avatar</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Avatar Preview */}
                    <div className="flex flex-col items-center">
                        <div className="relative group">
                            <div className="w-32 h-32 rounded-full overflow-hidden mb-4 shadow-lg border-4 border-white dark:border-gray-800 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                                {previewUrl ? (
                                    <img src={previewUrl} alt="Avatar" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                                ) : (
                                    <span className="text-5xl font-bold text-gray-400 dark:text-gray-500 select-none">
                                        {formData.full_name ? formData.full_name.charAt(0).toUpperCase() : 'U'}
                                    </span>
                                )}
                            </div>
                            <label className="absolute bottom-4 right-0 bg-primary-600 hover:bg-primary-700 text-white p-2 rounded-full cursor-pointer shadow-lg transition-colors border-2 border-white dark:border-gray-800">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                            </label>
                        </div>
                        <p className="text-xs text-gray-400 dark:text-gray-500">JPG or PNG. Max size of 2MB</p>
                    </div>

                    <div className="space-y-5">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 ml-1">Full Name</label>
                            <input
                                type="text"
                                value={formData.full_name}
                                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all placeholder-gray-400"
                                placeholder="E.g. Jane Doe"
                            />
                        </div>

                        {/* Bio */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 ml-1">Short Bio</label>
                            <textarea
                                value={formData.bio}
                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all placeholder-gray-400 resize-none"
                                rows={4}
                                placeholder="Student, Researcher, Lecturer..."
                            />
                        </div>
                    </div>

                    {message && (
                        <div className={`p-4 rounded-xl flex items-center gap-3 ${
                            message.includes('success') 
                                ? 'bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800/50' 
                                : 'bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800/50'
                        }`}>
                            <p className={`text-sm font-medium ${message.includes('success') ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-700 dark:text-red-400'}`}>
                                {message}
                            </p>
                        </div>
                    )}

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={saving}
                            className="w-full py-3.5 px-4 flex justify-center items-center text-white bg-primary-600 hover:bg-primary-700 rounded-xl font-medium shadow-md shadow-primary-500/30 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {saving ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Saving...
                                </>
                            ) : (
                                'Save Changes'
                            )}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default Profile;