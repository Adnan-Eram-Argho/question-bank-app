import React, { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';

interface AuthContextType {
    user: User | null;
    role: string | null;
    loading: boolean;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

/**
 * Authentication Provider component that manages the Supabase session lifecycle
 * and exposes current user context to the React tree.
 * 
 * @param props.children - The child components that require access to the auth context.
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [role, setRole] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        // onAuthStateChange fires immediately with the current session on mount,
        // which eliminates the need for a separate getSession() call and prevents double-fetching the role.
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchRole(session.user.id);
            } else {
                setRole(null);
                setLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    /**
     * Resolves and sets the current user's authorization role from the database schema.
     * 
     * @param userId - The UUID of the authenticated user to query.
     */
    const fetchRole = async (userId: string): Promise<void> => {
        try {
            const { data, error } = await supabase
                .from('users')
                .select('role')
                .eq('id', userId)
                .single();

            if (error) throw error;
            setRole(data.role);
        } catch (error) {
            console.error('[AuthContext] Role retrieval failed:', error);
            setRole(null);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Invalidates the current Supabase session and clears state cleanly.
     */
    const signOut = async (): Promise<void> => {
        try {
            await supabase.auth.signOut();
            setUser(null);
            setRole(null);
        } catch (error) {
            console.error('[AuthContext] Session invalidation failed:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, role, loading, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

/**
 * Custom hook to consume the AuthContext safely.
 * 
 * @throws {Error} If called outside of an AuthProvider hierarchy.
 * @returns {AuthContextType} The current authentication context values.
 */
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be utilized strictly within an AuthProvider instance');
    }
    return context;
};