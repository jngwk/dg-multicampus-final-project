import React, { Suspense, lazy } from "react";
import { Outlet, createBrowserRouter } from "react-router-dom";
import Fallback from "../components/shared/Fallback";
import Layout from "../components/shared/Layout";
// import QuillEditor from "../components/shared/QuillEditor";
import TestChart from '../components/membership/MembershipChart1'; // Adjusted import name

  const Main = lazy(() => import("../pages/Main"));
  const Chat = lazy(() => import("../pages/ChatRoom"));
  const Calendar = lazy(() => import("../pages/CalendarPage"));
  const SignUpChoice = lazy(() => import("../pages/SignUpChoicePage"));
  const SignUpForm = lazy(() => import("../pages/SignUpPage"));
  const QnaForm = lazy(() => import("../pages/QnaForm"));
  const ChatTest = lazy(() => import("../components/chat/ChatTest"));
  const UserInfoPage = lazy(() => import("../components/modals/UserInfo"));
  const MemberList = lazy(() => import("../pages/MemberList"));
  const MembershipStats = lazy(() => import("../pages/MembershipStats"));

const root = createBrowserRouter([
  {
    path: "/",
    element: (
      // <Layout>
      //   <PageTransitionWrapper>
      //     <Suspense fallback={Loading}>
      //       <Outlet />
      //     </Suspense>
      //   </PageTransitionWrapper>
      // </Layout>
      <Suspense fallback={<Fallback />}>
        <Layout>
          <Outlet />
        </Layout>
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: <Main />,
      },
      {
        path: "chat",
        element: <Chat />,
      },
      {
        path: "calendar",
        element: <Calendar />,
      },
      {
        path: "signUp",
        children: [
          {
            index: true,
            element: <SignUpChoice />,
          },
          {
            path: "form",
            element: <SignUpForm />,
          },
        ],
      },
      {
        path: "qna",
        element: <QnaForm />,
      },
      {
        path: 'stats',
        element: <MembershipStats />,
      },
      {
        path: "/memberList",
        element: <MemberList />,
      },
      {
        path: "chatTest",
        element: <ChatTest />,
      },
    ],
  },
]);

  export default root;
