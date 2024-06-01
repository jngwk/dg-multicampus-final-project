import React, { Suspense, lazy } from "react";
import { createBrowserRouter } from "react-router-dom";

const Loading = <div>Loading...</div>;

const Main = lazy(() => import("../pages/Main"));
<<<<<<< HEAD
const Profile = lazy(()=> import("../components/modals/MyInfo"));
=======
const ChartPage = lazy(() => import("../pages/ChartPage"));
>>>>>>> develop

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
    path: "/chart",
    element: (
      <Suspense fallback={Loading}>
        <ChartPage />
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
