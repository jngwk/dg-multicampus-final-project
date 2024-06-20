import React, { Suspense, lazy } from "react";
import { createBrowserRouter } from "react-router-dom";

const Loading = <div>Loading...</div>;

const Main = lazy(() => import("../pages/Main"));
const MembershipStats = lazy(() => import("../pages/MembershipStats"));

const root = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense fallback={Loading}>
        <Main />
      </Suspense>
    ),
  },
  {
    path: "/stats",
    element: (
      <Suspense fallback={Loading}>
        <MembershipStats />
      </Suspense>
    ),
  },
]);

export default root;
