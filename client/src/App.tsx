import { useEffect, useState } from "react";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import type { User } from 'firebase/auth';
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {!user ? (
          <div className="login-container">
            <h1 className="text-4xl font-bold mb-8">Welcome to Letter App</h1>
            <button
              onClick={loginWithGoogle}
              className="login-button flex items-center gap-2"
            >
              <img
                src="https://www.google.com/favicon.ico"
                alt="Google"
                className="w-5 h-5"
              />
              Sign in with Google
            </button>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <nav className="mb-8">
              <ul className="flex gap-4">
                <li>
                  <a href="/dashboard" className="text-blue-600 hover:text-blue-800">
                    Dashboard
                  </a>
                </li>
                <li>
                  <a href="/editor" className="text-blue-600 hover:text-blue-800">
                    Letter Editor
                  </a>
                </li>
              </ul>
            </nav>
            <Routes>
              <Route path="/dashboard" element={<Dashboard user={user} />} />
              <Route path="/editor" element={<LetterEditor user={user} />} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
        )}
      </div>
    </Router>
  );
}

export default App;
