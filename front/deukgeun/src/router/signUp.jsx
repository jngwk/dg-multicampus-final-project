import React, { Suspense, lazy } from "react";
import { createBrowserRouter } from "react-router-dom";

const Loading = <div>Loading...</div>;

const SignUpChoicePage = lazy(() => import("../pages/SignUpChoicePage"));
const SignUpPage = lazy(() => import("../pages/SignUpPage"));

const signUpRouter = createBrowserRouter([
  {
    id: "signUpChoice",
    path: "/signUp/choose",
    element: (
      <Suspense fallback={Loading}>
        <SignUpChoicePage />
      </Suspense>
    ),
  },
  {
    id: "signUp",
    path: "/signUp",
    element: (
      <Suspense fallback={Loading}>
        <SignUpPage />
      </Suspense>
    ),
  },
]);

export default signUpRouter;
