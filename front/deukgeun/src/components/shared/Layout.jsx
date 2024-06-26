import React from "react";
import Header from "./Header";

const Layout = ({ children }) => {
  return (
    <div>
      <Header />
      <div className="justify-center min-h-[90dvh] w-full">{children}</div>
    </div>
  );
};

export default Layout;
