import React from "react";
import Header from "./Header";

const Layout = ({ children }) => {
  return (
    <div>
      <Header />
      <div className="relative min-h-[90dvh] w-5/6 mx-auto">{children}</div>
    </div>
  );
};

export default Layout;
