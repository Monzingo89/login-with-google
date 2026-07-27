# zingo-loginmaxxing

`zingo-loginmaxxing` is a template-ready npm package that makes Firebase authentication fast to set up with:
- a professional default auth card theme
- a Google-branded sign-in button
- email/password sign in + sign up

## Install

### Prerequisites (all OS)
- Node.js 18+ and npm 9+
- A Firebase project with Google and Email/Password auth enabled

### Windows (PowerShell)
```powershell
mkdir my-app
cd my-app
npm init -y
npm install zingo-loginmaxxing firebase
```

### macOS (Terminal)
```bash
mkdir my-app
cd my-app
npm init -y
npm install zingo-loginmaxxing firebase
```

### Linux (Terminal)
```bash
mkdir my-app
cd my-app
npm init -y
npm install zingo-loginmaxxing firebase
```

## Quick setup

1. Enable providers in Firebase Console:
   - Authentication → Sign-in method → Google (Enable)
   - Authentication → Sign-in method → Email/Password (Enable)
2. Create a web app in Firebase and copy the config object.
3. Add this to your client code:

```js
import { createZingoAuth } from "zingo-loginmaxxing";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  appId: "YOUR_APP_ID"
};

createZingoAuth({
  firebaseConfig,
  rootSelector: "#zingo-auth-root",
  onSuccess: (user, provider) => {
    console.log("Signed in with:", provider, user.email);
  },
  onError: (error) => {
    console.error(error.message);
  }
});
```

4. Add a mount element in HTML:

```html
<div id="zingo-auth-root"></div>
```

## Template files

Starter template files are included in:
- `/template/index.html`
- `/template/main.js`

Copy them into your project and replace the Firebase config placeholders.

## API

### `createZingoAuth(options)`
Creates Firebase auth helpers and (by default) renders the styled auth UI.

**Options**
- `firebaseConfig` (required): Firebase web config
- `rootSelector` (default `#zingo-auth-root`): where UI renders
- `googleButtonText` (default `"Sign in with Google"`)
- `autoRender` (default `true`)
- `onSuccess(user, provider)` callback
- `onError(error)` callback

**Returns**
- `signInWithGoogle()`
- `signInWithEmail(email, password)`
- `signUpWithEmail(email, password)`
- `signOutUser()`
- `onAuthStateChange(handler)`
- `auth` and `app`

## Local package development

```bash
npm install
npm pack --dry-run
```

## Publish to npm

```bash
npm login
npm publish --access public
```
