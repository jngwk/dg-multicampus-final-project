import React, { Suspense, lazy } from "react";
import { Outlet, createBrowserRouter } from "react-router-dom";
import Layout from "../components/shared/Layout";
import Loader from "../components/shared/Loader";
import Fallback from "../components/shared/Fallback";
// import QuillEditor from "../components/shared/QuillEditor";

const Main = lazy(() => import("../pages/Main"));
const Chart = lazy(() => import("../pages/ChartPage"));
const Chat = lazy(() => import("../pages/ChatRoom"));
const Calendar = lazy(() => import("../pages/CalendarPage"));
const SignUpChoice = lazy(() => import("../pages/SignUpChoicePage"));
const SignUpForm = lazy(() => import("../pages/SignUpPage"));
const QnaForm = lazy(() => import("../pages/QnaForm"));
const ChatTest = lazy(() => import("../components/chat/ChatTest"));
const UserInfoPage = lazy(() => import("../components/modals/UserInfo"));
const MemberList = lazy(() => import("../pages/MemberList"));
const GymSearch = lazy(() => import("../pages/GymSearchPage"));

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
        path: "chart",
        element: <Chart />,
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
        path: "/memberList",
        element: <MemberList />,
      },
      {
        path: "chatTest",
        element: <ChatTest />,
      },
      {
        path: "gymSearch",
        element: <GymSearch />,
      },
    ],
  },

  // ...signUp.routes,
]);

export default root;
