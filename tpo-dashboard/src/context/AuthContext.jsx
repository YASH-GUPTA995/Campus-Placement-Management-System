import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);
const AUTH_TIMEOUT_MS = 8000;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    api.get("/auth/me", { timeout: AUTH_TIMEOUT_MS })
      .then((r) => {
        if (mounted) setUser(r.data?.user ?? null);
      })
      .catch((err) => {
        if (mounted) {
          if (err?.code !== "ECONNABORTED" && err?.message !== "canceled") {
            setUser(null);
          }
        }
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const logout = async () => {
    try {
      await api.post("/auth/logout", {}, { timeout: AUTH_TIMEOUT_MS });
    } catch (err) {
      console.warn("Logout request failed:", err);
    } finally {
      setUser(null);
      window.location.assign("/login");
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
