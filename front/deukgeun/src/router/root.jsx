import React, { Suspense, lazy } from "react";
import { Outlet, createBrowserRouter } from "react-router-dom";
import Fallback from "../components/shared/Fallback";
import Layout from "../components/shared/Layout";
// import QuillEditor from "../components/shared/QuillEditor";

const Main = lazy(() => import("../pages/Main"));
const Chat = lazy(() => import("../pages/ChatRoom"));
const Calendar = lazy(() => import("../pages/CalendarPage"));
const SignUpChoice = lazy(() => import("../pages/SignUpChoicePage"));
const SignUpForm = lazy(() => import("../pages/SignUpPage"));
const QnaForm = lazy(() => import("../pages/QnaForm"));
const ChatTest = lazy(() => import("../components/chat/ChatTest"));
const MemberList = lazy(() => import("../pages/MemberList"));
const PTMemberList = lazy(() => import("../pages/PTMemberList"));
const CenterTrainerList = lazy(() => import("../pages/CenterTrainerList"));
const CenterMemberList = lazy(() => import("../pages/CenterMemberList"));
const MembershipStats = lazy(() => import("../pages/MembershipStats"));
const SignUpTrainerPage = lazy(() => import("../pages/SignUpTrainerPage"));


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
        path: "memberList",
        element: <MemberList />,
      },
      {
        path: "chatTest",
        element: <ChatTest />,
      },
      {
        path: "ptMemberList",
        element: <PTMemberList />,
      },
      {
        path: "centerTrainerList",
        element: <CenterTrainerList />,
      },
      {
        path: "centerMemberList",
        element: <CenterMemberList />,
      },
      {
        path: 'trainer',
        element: <SignUpTrainerPage />,
      },
    ],
  },
]);

  export default root;
