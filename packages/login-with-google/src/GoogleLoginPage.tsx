import { useEffect, useRef, type ReactNode } from 'react';
import type { GoogleLoginClient } from './client';
import { GoogleLoginButton } from './GoogleLoginButton';
import { useGoogleLogin } from './useGoogleLogin';

export type GoogleLoginPageProps = {
  client: GoogleLoginClient;
  title?: string;
  subtitle?: string;
  postLoginUrl?: string;
  logo?: ReactNode;
  footer?: ReactNode;
  className?: string;
  onSuccess?: (user: NonNullable<ReturnType<typeof useGoogleLogin>['user']>) => void;
};

export function GoogleLoginPage({
  client,
  title = 'Welcome',
  subtitle = 'Sign in securely with your Google account.',
  postLoginUrl,
  logo,
  footer,
  className = '',
  onSuccess
}: GoogleLoginPageProps) {
  const state = useGoogleLogin(client);
  const handledUid = useRef<string | null>(null);

  useEffect(() => {
    if (!state.user || handledUid.current === state.user.uid) return;
    handledUid.current = state.user.uid;
    onSuccess?.(state.user);
    if (postLoginUrl && typeof window !== 'undefined') window.location.assign(postLoginUrl);
  }, [onSuccess, postLoginUrl, state.user]);

  return (
    <main className={`lwg-page ${className}`.trim()}>
      <section className="lwg-card" aria-labelledby="lwg-title">
        {logo ? <div className="lwg-logo">{logo}</div> : null}
        <div className="lwg-copy">
          <h1 id="lwg-title">{title}</h1>
          <p>{subtitle}</p>
        </div>
        {state.loading ? (
          <p className="lwg-status" role="status">
            Restoring your session…
          </p>
        ) : state.user ? (
          <p className="lwg-status" role="status">
            Signed in as {state.user.email || state.user.displayName || 'Google user'}.
          </p>
        ) : (
          <GoogleLoginButton pending={state.pending} onClick={() => void state.signIn()} />
        )}
        {state.error ? (
          <p className="lwg-error" role="alert">
            {state.error.message}
          </p>
        ) : null}
        {footer ? <footer className="lwg-footer">{footer}</footer> : null}
      </section>
    </main>
  );
}
