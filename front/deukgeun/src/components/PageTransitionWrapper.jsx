import React from "react";
import { useLocation, Outlet } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";

const PageTransitionWrapper = () => {
  const location = useLocation();

  return (
    <TransitionGroup>
      <CSSTransition
        key={location.key}
        // classNames={location.pathname === "/calendar" ? "slide" : ""}
        classNames="slide"
        timeout={500}
      >
        <div className="transition-wrapper">
          <Outlet />
        </div>
      </CSSTransition>
    </TransitionGroup>
  );
};

export default PageTransitionWrapper;
