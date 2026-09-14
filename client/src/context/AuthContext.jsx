import { createContext, useContext, useEffect, useState } from "react";
import { signInWithPopup, signOut } from "firebase/auth";
import api from "../api/axios";
import { auth, googleProvider } from "../config/firebase";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // On load, ask the server who we are using the httpOnly cookie.
    api
      .get("/auth/me")
      .then((res) => setUser(res.data.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    setUser(res.data.user);
  };

  const register = async (name, email, password) => {
    const res = await api.post("/auth/register", { name, email, password });
    setUser(res.data.user);
  };

  const loginWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    const idToken = await result.user.getIdToken();
    const res = await api.post("/auth/google", { token: idToken });
    setUser(res.data.user);
    return res.data.user;
  };

  const googleLogin = async (token) => {
    const res = await api.post("/auth/google", { token });
    setUser(res.data.user);
  };

  const updateProfile = async (data) => {
    const res = await api.put("/auth/me", data);
    setUser(res.data.user);
    return res.data;
  };

  const updatePassword = async (data) => {
    const res = await api.put("/auth/password", data);
    return res.data;
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch {
      // Ignore client firebase signout errors
    }
    await api.post("/auth/logout");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        googleLogin,
        loginWithGoogle,
        updateProfile,
        updatePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
