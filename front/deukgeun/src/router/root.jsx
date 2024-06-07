import React, { Suspense, lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import signUp from "./signUp";
const Loading = <div>Loading...</div>;

const Main = lazy(() => import("../pages/Main"));
const ChartPage = lazy(() => import("../pages/ChartPage"));
const CalendarPage = lazy(() => import("../pages/CalendarPage"));

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
    path: "/calender",
    element: (
      <Suspense fallback={Loading}>
        <CalendarPage />
      </Suspense>
    ),
  },
  ...signUp.routes,
]);

export default root;
