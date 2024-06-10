import React, { Suspense, lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import signUp from "./signUp";
const Loading = <div>Loading...</div>;

const Main = lazy(() => import("../pages/Main"));
const ChartPage = lazy(() => import("../pages/ChartPage"));
const ChatRoom = lazy(() => import("../pages/ChatRoom"));
const CalendarPage = lazy(() => import("../pages/CalendarPage"));
const UserInfoPage = lazy(() => import("../components/modals/MyInfo"));
const MemberList = lazy(() => import("../pages/MemberList"));

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
    path: "/chat",
    element: (
      <Suspense fallback={Loading}>
        <ChatRoom />
      </Suspense>
    ),
  },
  {  path: "/calender",
    element: (
      <Suspense fallback={Loading}>
        <CalendarPage />
      </Suspense>
    ),
  },
  {
    path: "/myInfo",
    element: (
      <Suspense fallback={Loading}>
        <UserInfoPage />
      </Suspense>
    ),
  },
  {
    path: "/memberList",
    element: (
      <Suspense fallback={Loading}>
        <MemberList />
      </Suspense>
    ),
  },
  ...signUp.routes,
]);

export default root;
