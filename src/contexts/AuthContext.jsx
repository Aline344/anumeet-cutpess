import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../services/firebase';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = auth.getCurrentUser();
    setCurrentUser(user);
    setLoading(false);
  }, []);

  const login = (email, password) => {
    setLoading(true);
    try {
      const user = auth.login(email, password);
      setCurrentUser(user);
      return user;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = (name, email, password, role = "customer") => {
    setLoading(true);
    try {
      const user = auth.signup(name, email, password, role);
      setCurrentUser(user);
      return user;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    auth.logout();
    setCurrentUser(null);
  };

  const updateProfile = (name, email, role = null) => {
    const users = JSON.parse(localStorage.getItem("ak_users")) || [];
    const idx = users.findIndex(u => u.id === currentUser.id);
    if (idx !== -1) {
      users[idx].name = name;
      users[idx].email = email;
      if (role) {
        users[idx].role = role;
      }
      localStorage.setItem("ak_users", JSON.stringify(users));
      
      const updated = { ...currentUser, name, email };
      if (role) {
        updated.role = role;
      }
      sessionStorage.setItem("ak_current_user", JSON.stringify(updated));
      setCurrentUser(updated);
      return true;
    }
    return false;
  };

  const value = {
    currentUser,
    login,
    signup,
    logout,
    updateProfile,
    isAdmin: currentUser?.role === 'admin',
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
