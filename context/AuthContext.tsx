"use client";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext({ user: null, loading: true });

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const start = Date.now();
      try {
        console.log("🔍 AUTH: Checking session...");
        const res = await fetch("/api/me"); // Create a simple route to verify the JWT cookie
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          console.log(`✅ AUTH: User logged in (${Date.now() - start}ms)`);
        } else {
          console.log("ℹ️ AUTH: No active session found.");
        }
      } catch (err) {
        console.error("❌ AUTH: Error checking session", err);
      } finally {
        setLoading(false);
      }
    };
    checkUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
