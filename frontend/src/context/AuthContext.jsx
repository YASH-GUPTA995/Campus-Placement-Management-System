import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);
const AUTH_TIMEOUT_MS = 8000;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchMe = async () => {
      try {
        const { data } = await api.get("/auth/me", { timeout: AUTH_TIMEOUT_MS });
        if (mounted) {
          setUser(data.user ?? null);
          setProfile(data.profile ?? null);
        }
      } catch (err) {
        if (mounted) {
          setUser(null);
          setProfile(null);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchMe();
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
      setProfile(null);
      window.location.assign("/login");
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, setUser, setProfile, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
