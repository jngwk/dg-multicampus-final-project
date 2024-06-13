import React, { createContext, useState, useEffect, useContext } from "react";
import { userInfo } from "../api/userInfoApi";
import { logout } from "../api/loginApi";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sessionStorage.getItem("isLoggedIn")) {
      setLoading(false);
    } else {
      fetchUserData();
    }
  }, []);

  const fetchUserData = async () => {
    console.log("Before fetch in AUTH", userData);
    if (!userData && sessionStorage.getItem("isLoggedIn")) {
      setLoading(true);
      try {
        const data = await userInfo();
        setUserData(data.user);
        console.log(data.user);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setLoading(false);
      }
    }
    setLoading(false);
  };

  const removeCookieAndLogOut = async () => {
    try {
      const response = await logout();
      setUserData(null);
      sessionStorage.removeItem("isLoggedIn", false);
      console.log(response);
    } catch (error) {
      console.error("Error logging out");
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{ userData, loading, removeCookieAndLogOut, fetchUserData }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
