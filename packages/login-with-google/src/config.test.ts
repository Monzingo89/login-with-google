import { describe, expect, it } from 'vitest';
import { firebaseConfigFromEnv } from './config';
import { isMobileBrowser } from './client';

describe('firebaseConfigFromEnv', () => {
  it('maps the documented Vite variables', () => {
    expect(
      firebaseConfigFromEnv({
        VITE_FIREBASE_API_KEY: 'key',
        VITE_FIREBASE_AUTH_DOMAIN: 'example.firebaseapp.com',
        VITE_FIREBASE_PROJECT_ID: 'example',
        VITE_FIREBASE_STORAGE_BUCKET: 'example.firebasestorage.app',
        VITE_FIREBASE_MESSAGING_SENDER_ID: '123',
        VITE_FIREBASE_APP_ID: '1:123:web:abc'
      })
    ).toMatchObject({
      apiKey: 'key',
      authDomain: 'example.firebaseapp.com',
      projectId: 'example'
    });
  });

  it('fails with all missing variables named', () => {
    expect(() => firebaseConfigFromEnv({})).toThrow('VITE_FIREBASE_API_KEY');
  });
});

describe('isMobileBrowser', () => {
  it('recognizes mobile and desktop user agents', () => {
    expect(isMobileBrowser({ userAgent: 'Mozilla/5.0 (iPhone)', maxTouchPoints: 5 })).toBe(true);
    expect(isMobileBrowser({ userAgent: 'Mozilla/5.0 (Macintosh)', maxTouchPoints: 0 })).toBe(false);
  });
});
