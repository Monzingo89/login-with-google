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
    console.log(`Signed in with ${provider}:`, user.email);
  },
  onError: (error) => {
    console.error("Auth error:", error.message);
  }
});
