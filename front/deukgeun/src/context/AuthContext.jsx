import React, { createContext, useState, useEffect, useContext } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const addUserToSession = (userData) => {
    setUser(userData);
    sessionStorage.setItem("user", JSON.stringify(userData));
  };

  const removeUserFromSession = () => {
    const currentPath = window.location.pathname;
    setUser(null);
    sessionStorage.removeItem("user");
    localStorage.removeItem("authToken");
    console.log("logged out");
    console.log(currentPath);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, addUserToSession, removeUserFromSession }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
