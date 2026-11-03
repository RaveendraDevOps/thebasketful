import type { Session, User } from '@supabase/supabase-js';
import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';

type AuthStore = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  configured: boolean;
  sendOtp: (phone: string) => Promise<void>;
  verifyOtp: (phone: string, token: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthStore | null>(null);

export function AuthStoreProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(isSupabaseConfigured);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setLoading(false);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  const value = useMemo<AuthStore>(() => ({
    session,
    user: session?.user ?? null,
    loading,
    configured: isSupabaseConfigured,
    sendOtp: async (phone) => {
      if (!supabase) throw new Error('Supabase is not configured.');
      const { error } = await supabase.auth.signInWithOtp({ phone });
      if (error) throw error;
    },
    verifyOtp: async (phone, token) => {
      if (!supabase) throw new Error('Supabase is not configured.');
      const { error } = await supabase.auth.verifyOtp({ phone, token, type: 'sms' });
      if (error) throw error;
    },
    signOut: async () => {
      if (!supabase) return;
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    },
  }), [loading, session]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthStore() {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuthStore must be used inside AuthStoreProvider');
  return value;
}
