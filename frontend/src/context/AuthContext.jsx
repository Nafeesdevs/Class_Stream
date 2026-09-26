import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import authService from "../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load current user from session cookie on app mount
  const refreshUser = useCallback(async () => {
    try {
      const data = await authService.getCurrentUser();
      if (data && data.success) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    if (data && data.success) {
      setUser(data.user);
      await refreshUser();
      return data;
    }
    throw new Error(data?.message || "Login failed");
  };

  const register = async (name, email, password) => {
    const data = await authService.register(name, email, password);
    if (data && data.success) {
      setUser(data.user);
      await refreshUser();
      return data;
    }
    throw new Error(data?.message || "Registration failed");
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (e) {
      console.warn("Logout request failed:", e);
    } finally {
      setUser(null);
    }
  };

  const updateUserProfile = async (profileData) => {
    const data = await authService.updateProfile(profileData);
    if (data && data.success) {
      setUser(data.user);
      await refreshUser();
      return data.user;
    }
    throw new Error(data?.message || "Update profile failed");
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        isAdmin,
        login,
        register,
        logout,
        refreshUser,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
