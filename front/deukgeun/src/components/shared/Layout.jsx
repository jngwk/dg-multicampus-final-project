import React from "react";
import Header from "./Header";

const Layout = ({ children }) => {
  return (
    <div>
      <Header />
      <div className="flex justify-center p-10 min-h-[50dvh] w-5/6 mx-auto">
        {children}
      </div>
    </div>
  );
};

export default Layout;
