import React, { Suspense, lazy } from "react";
import { createBrowserRouter } from "react-router-dom";

const Loading = <div>Loading...</div>;

const Main = lazy(() => import("../pages/Main"));
const ChartPage = lazy(() => import("../pages/ChartPage"));

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
]);

export default root;
