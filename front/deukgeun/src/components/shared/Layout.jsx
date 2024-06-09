import React from "react";
import Header from "./Header";

const Layout = ({ children }) => {
  return (
    <>
      <Header />
      <div className="relative min-h-[90dvh]">{children}</div>
    </>
  );
};

export default Layout;
