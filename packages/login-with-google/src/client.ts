import {
  getApp,
  getApps,
  initializeApp,
  type FirebaseApp,
  type FirebaseOptions
} from 'firebase/app';
import {
  GoogleAuthProvider,
  browserLocalPersistence,
  getAuth,
  getRedirectResult,
  onAuthStateChanged,
  setPersistence,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  type Auth,
  type User,
  type UserCredential
} from 'firebase/auth';

export type GoogleLoginMode = 'auto' | 'popup' | 'redirect';

export type GoogleLoginClientOptions = {
  firebaseConfig?: FirebaseOptions;
  auth?: Auth;
  appName?: string;
  mode?: GoogleLoginMode;
  scopes?: string[];
  customParameters?: Record<string, string>;
};

export type GoogleLoginResult =
  | { method: 'popup'; credential: UserCredential }
  | { method: 'redirect'; credential: null };

export type GoogleLoginClient = {
  readonly auth: Auth;
  signIn(): Promise<GoogleLoginResult>;
  completeRedirect(): Promise<UserCredential | null>;
  subscribe(listener: (user: User | null) => void): () => void;
  signOut(): Promise<void>;
};

export function isMobileBrowser(
  navigatorLike: Pick<Navigator, 'userAgent' | 'maxTouchPoints'> | undefined =
    typeof navigator === 'undefined' ? undefined : navigator
) {
  if (!navigatorLike) return false;
  return (
    /Android|iPhone|iPad|iPod|Mobile/i.test(navigatorLike.userAgent) ||
    navigatorLike.maxTouchPoints > 1
  );
}

function resolveApp(options: GoogleLoginClientOptions): FirebaseApp {
  if (options.auth) return options.auth.app;
  if (!options.firebaseConfig) {
    throw new Error('firebaseConfig is required when an existing Firebase Auth instance is not supplied');
  }
  const appName = options.appName || '[DEFAULT]';
  const existing = getApps().find((app) => app.name === appName);
  if (existing) return existing;
  return appName === '[DEFAULT]'
    ? initializeApp(options.firebaseConfig)
    : initializeApp(options.firebaseConfig, appName);
}

function shouldRedirect(mode: GoogleLoginMode) {
  if (mode === 'redirect') return true;
  if (mode === 'popup') return false;
  return isMobileBrowser();
}

function isPopupFallbackError(error: unknown) {
  const code = String((error as { code?: string })?.code || '');
  return [
    'auth/popup-blocked',
    'auth/popup-closed-by-user',
    'auth/cancelled-popup-request',
    'auth/operation-not-supported-in-this-environment'
  ].includes(code);
}

export function createGoogleLoginClient(options: GoogleLoginClientOptions): GoogleLoginClient {
  const auth = options.auth || getAuth(resolveApp(options));
  const mode = options.mode || 'auto';

  function provider() {
    const google = new GoogleAuthProvider();
    for (const scope of options.scopes ?? []) google.addScope(scope);
    if (options.customParameters) google.setCustomParameters(options.customParameters);
    return google;
  }

  return {
    auth,
    async signIn() {
      await setPersistence(auth, browserLocalPersistence);
      if (shouldRedirect(mode)) {
        await signInWithRedirect(auth, provider());
        return { method: 'redirect', credential: null };
      }

      try {
        const credential = await signInWithPopup(auth, provider());
        return { method: 'popup', credential };
      } catch (error) {
        if (mode === 'auto' && isPopupFallbackError(error)) {
          await signInWithRedirect(auth, provider());
          return { method: 'redirect', credential: null };
        }
        throw error;
      }
    },
    completeRedirect: () => getRedirectResult(auth),
    subscribe: (listener) => onAuthStateChanged(auth, listener),
    signOut: () => signOut(auth)
  };
}
