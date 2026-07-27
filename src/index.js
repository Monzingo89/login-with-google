import { getApp, getApps, initializeApp } from "firebase/app";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut
} from "firebase/auth";

const THEME_STYLE_ID = "zingo-loginmaxxing-theme";

export const ZINGO_LOGINMAXXING_THEME = `
.zingo-auth-theme {
  box-sizing: border-box;
  width: 100%;
  max-width: 420px;
  margin: 2rem auto;
  padding: 1.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: #ffffff;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

.zingo-auth-theme * {
  box-sizing: border-box;
}

.zingo-auth-title {
  margin: 0 0 1rem;
  font-size: 1.25rem;
  color: #111827;
}

.zingo-google-btn {
  width: 100%;
  border: 1px solid #d9d9d9;
  background: #fff;
  color: #1f1f1f;
  border-radius: 4px;
  height: 40px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-weight: 500;
}

.zingo-google-btn:hover {
  background: #f8f9fa;
}

.zingo-auth-divider {
  text-align: center;
  margin: 1rem 0;
  color: #6b7280;
  font-size: 0.875rem;
}

.zingo-auth-form {
  display: grid;
  gap: 0.75rem;
}

.zingo-auth-input {
  width: 100%;
  padding: 0.625rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.95rem;
}

.zingo-auth-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
}

.zingo-auth-primary,
.zingo-auth-secondary {
  border: 0;
  border-radius: 8px;
  padding: 0.625rem 0.75rem;
  font-weight: 600;
  cursor: pointer;
}

.zingo-auth-primary {
  background: #111827;
  color: #fff;
}

.zingo-auth-secondary {
  background: #f3f4f6;
  color: #111827;
}
`;

function assertFirebaseConfig(firebaseConfig) {
  if (!firebaseConfig || typeof firebaseConfig !== "object") {
    throw new Error("firebaseConfig is required and must be an object.");
  }
}

function getOrCreateFirebaseApp(firebaseConfig) {
  assertFirebaseConfig(firebaseConfig);
  return getApps().length ? getApp() : initializeApp(firebaseConfig);
}

function ensureDomAvailable() {
  if (typeof document === "undefined") {
    throw new Error("DOM is not available. Render this UI from a browser environment.");
  }
}

export function injectTheme(cssText = ZINGO_LOGINMAXXING_THEME) {
  ensureDomAvailable();

  if (document.getElementById(THEME_STYLE_ID)) {
    return;
  }

  const style = document.createElement("style");
  style.id = THEME_STYLE_ID;
  style.textContent = cssText;
  document.head.appendChild(style);
}

function googleIconSvgMarkup() {
  return `
<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true" focusable="false">
  <path fill="#EA4335" d="M9 3.48c1.69 0 2.83.73 3.48 1.35l2.54-2.48C13.46.89 11.45 0 9 0 5.48 0 2.44 2.02.96 4.96l2.96 2.3C4.65 5.13 6.64 3.48 9 3.48z"/>
  <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84c-.21 1.12-.84 2.06-1.79 2.69l2.91 2.26c1.7-1.56 2.68-3.86 2.68-6.59z"/>
  <path fill="#FBBC05" d="M3.92 10.74A5.41 5.41 0 0 1 3.62 9c0-.6.11-1.18.3-1.74L.96 4.96A9 9 0 0 0 0 9c0 1.45.35 2.82.96 4.04l2.96-2.3z"/>
  <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.17l-2.91-2.26c-.8.54-1.83.86-3.05.86-2.36 0-4.35-1.65-5.08-3.87l-2.96 2.3C2.44 15.98 5.48 18 9 18z"/>
</svg>`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function buildAuthMarkup(googleButtonText) {
  const safeGoogleButtonText = escapeHtml(googleButtonText);
  return `
    <section class="zingo-auth-theme">
      <h1 class="zingo-auth-title">Welcome back</h1>
      <button type="button" class="zingo-google-btn" id="zingo-google-btn">
        ${googleIconSvgMarkup()}
        <span>${safeGoogleButtonText}</span>
      </button>
      <div class="zingo-auth-divider">or continue with email</div>
      <form class="zingo-auth-form" id="zingo-auth-form">
        <input class="zingo-auth-input" id="zingo-email" type="email" autocomplete="email" placeholder="Email address" required />
        <input class="zingo-auth-input" id="zingo-password" type="password" autocomplete="current-password" placeholder="Password" required />
        <div class="zingo-auth-actions">
          <button type="submit" class="zingo-auth-primary" id="zingo-email-login">Sign in</button>
          <button type="button" class="zingo-auth-secondary" id="zingo-email-signup">Sign up</button>
        </div>
      </form>
    </section>
  `;
}

export function createZingoAuth({
  firebaseConfig,
  rootSelector = "#zingo-auth-root",
  googleButtonText = "Sign in with Google",
  autoRender = true,
  onSuccess = () => {},
  onError = () => {}
}) {
  const app = getOrCreateFirebaseApp(firebaseConfig);
  const auth = getAuth(app);
  const googleProvider = new GoogleAuthProvider();

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      onSuccess(result.user, "google");
      return result;
    } catch (error) {
      onError(error);
      throw error;
    }
  };

  const signInWithEmail = async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      onSuccess(result.user, "email");
      return result;
    } catch (error) {
      onError(error);
      throw error;
    }
  };

  const signUpWithEmail = async (email, password) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      onSuccess(result.user, "email-signup");
      return result;
    } catch (error) {
      onError(error);
      throw error;
    }
  };

  const signOutUser = () => signOut(auth);
  const onAuthStateChange = (handler) => onAuthStateChanged(auth, handler);

  if (autoRender) {
    ensureDomAvailable();
    injectTheme();

    const root = document.querySelector(rootSelector);
    if (!root) {
      throw new Error(`Root element not found for selector: ${rootSelector}`);
    }

    root.innerHTML = buildAuthMarkup(googleButtonText);

    const googleBtn = root.querySelector("#zingo-google-btn");
    const form = root.querySelector("#zingo-auth-form");
    const signUpBtn = root.querySelector("#zingo-email-signup");

    googleBtn.addEventListener("click", async () => {
      await signInWithGoogle();
    });

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const email = root.querySelector("#zingo-email").value;
      const password = root.querySelector("#zingo-password").value;
      await signInWithEmail(email, password);
    });

    signUpBtn.addEventListener("click", async () => {
      const email = root.querySelector("#zingo-email").value;
      const password = root.querySelector("#zingo-password").value;
      await signUpWithEmail(email, password);
    });
  }

  return {
    app,
    auth,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    signOutUser,
    onAuthStateChange
  };
}
