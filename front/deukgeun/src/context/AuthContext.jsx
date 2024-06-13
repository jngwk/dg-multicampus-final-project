import React, { createContext, useState, useEffect, useContext } from "react";
import Cookies from "js-cookie";
import { userInfo } from "../api/userInfoApi";

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

  const logout = async () => {
    Cookies.remove("accessToken");
    setUserData(null);
    sessionStorage.removeItem("isLoggedIn", false);
  };

  return (
    <AuthContext.Provider value={{ userData, loading, logout, fetchUserData }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
