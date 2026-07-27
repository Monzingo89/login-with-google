import type { FirebaseOptions } from 'firebase/app';

export const FIREBASE_ENV_KEYS = {
  apiKey: 'VITE_FIREBASE_API_KEY',
  authDomain: 'VITE_FIREBASE_AUTH_DOMAIN',
  projectId: 'VITE_FIREBASE_PROJECT_ID',
  storageBucket: 'VITE_FIREBASE_STORAGE_BUCKET',
  messagingSenderId: 'VITE_FIREBASE_MESSAGING_SENDER_ID',
  appId: 'VITE_FIREBASE_APP_ID'
} as const;

export type FirebaseEnvRecord = Record<string, string | undefined>;

export function firebaseConfigFromEnv(source: FirebaseEnvRecord): FirebaseOptions {
  const config: FirebaseOptions = {};
  const missing: string[] = [];

  for (const [field, envKey] of Object.entries(FIREBASE_ENV_KEYS)) {
    const value = source[envKey]?.trim();
    if (!value) missing.push(envKey);
    else Object.assign(config, { [field]: value });
  }

  if (missing.length) {
    throw new Error(`Missing Firebase web configuration: ${missing.join(', ')}`);
  }
  return config;
}
