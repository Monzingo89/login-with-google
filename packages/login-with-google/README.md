# login-with-google

Responsive Firebase Google authentication for React. The package uses redirects on mobile, popups on desktop, and falls back to redirect if a popup is blocked.

```bash
npm install login-with-google firebase react react-dom
```

```tsx
import { createGoogleLoginClient, firebaseConfigFromEnv, GoogleLoginPage } from 'login-with-google';
import 'login-with-google/base.css';

const client = createGoogleLoginClient({
  firebaseConfig: firebaseConfigFromEnv(import.meta.env),
  mode: 'auto'
});

export function Login() {
  return <GoogleLoginPage client={client} postLoginUrl="/dashboard" />;
}
```

Copy `.env.example`, add the web app configuration from Firebase, enable Google in Firebase Authentication, and add every production/mobile web hostname to Firebase Authorized Domains.

The optional VCV styling is published separately as
[`login-with-google-theme`](https://github.com/Monzingo89/login-with-google-theme).
