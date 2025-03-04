import { useEffect, useState } from "react";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import type { User } from '@firebase/auth-types';
import { initializeApp } from "firebase/app";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Dashboard from "./Dashboard";
import LetterEditor from "./LetterEditor";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

function App(): JSX.Element {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async (): Promise<void> => {
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <div className="app">
        {!user ? (
          <div className="login-container">
            <h1>Welcome to Letter App</h1>
            <button onClick={loginWithGoogle} className="login-button">
              Sign in with Google
            </button>
          </div>
        ) : (
          <Routes>
            <Route path="/dashboard" element={<Dashboard user={user} />} />
            <Route path="/editor" element={<LetterEditor user={user} />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        )}
      </div>
    </Router>
  );
}

export default App;
