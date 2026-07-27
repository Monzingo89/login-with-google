import { useCallback, useEffect, useState } from 'react';
import type { User } from 'firebase/auth';
import type { GoogleLoginClient } from './client';

export type GoogleLoginState = {
  user: User | null;
  loading: boolean;
  pending: boolean;
  error: Error | null;
  signIn(): Promise<void>;
  signOut(): Promise<void>;
};

export function useGoogleLogin(client: GoogleLoginClient): GoogleLoginState {
  const [user, setUser] = useState<User | null>(client.auth.currentUser);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let active = true;
    void client.completeRedirect().catch((cause) => {
      if (active) setError(cause instanceof Error ? cause : new Error(String(cause)));
    });
    const unsubscribe = client.subscribe((nextUser) => {
      if (!active) return;
      setUser(nextUser);
      setLoading(false);
    });
    return () => {
      active = false;
      unsubscribe();
    };
  }, [client]);

  const signIn = useCallback(async () => {
    setPending(true);
    setError(null);
    try {
      await client.signIn();
    } catch (cause) {
      setError(cause instanceof Error ? cause : new Error(String(cause)));
      throw cause;
    } finally {
      setPending(false);
    }
  }, [client]);

  const logout = useCallback(async () => {
    setPending(true);
    setError(null);
    try {
      await client.signOut();
    } catch (cause) {
      setError(cause instanceof Error ? cause : new Error(String(cause)));
      throw cause;
    } finally {
      setPending(false);
    }
  }, [client]);

  return { user, loading, pending, error, signIn, signOut: logout };
}
