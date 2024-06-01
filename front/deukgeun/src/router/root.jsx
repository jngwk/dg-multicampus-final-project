import React, { Suspense, lazy } from "react";
import { createBrowserRouter } from "react-router-dom";

const Loading = <div>Loading...</div>;

const Main = lazy(() => import("../pages/Main"));
const Profile = lazy(()=> import("../components/modals/MyInfo"));

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
    path: "/",
    element: (
      <Suspense fallback={Loading}>
        <Main />
      </Suspense>
    ),
  },
  {
    path: "/myinfo",
    element: (
      <Suspense fallback={Loading}>
        <Profile />
      </Suspense>
    ),
  },
]);

export default root;
