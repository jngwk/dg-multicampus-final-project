import React, { Suspense, lazy } from "react";
import { Outlet, createBrowserRouter } from "react-router-dom";
import signUp from "./signUp";
import PageTransitionWrapper from "../components/PageTransitionWrapper";
import Layout from "../components/shared/Layout";
// import QuillEditor from "../components/shared/QuillEditor";

const Main = lazy(() => import("../pages/Main"));
const Chart = lazy(() => import("../pages/ChartPage"));
const Chat = lazy(() => import("../pages/ChatRoom"));
const Calendar = lazy(() => import("../pages/CalendarPage"));
const SignUpChoice = lazy(() => import("../pages/SignUpChoicePage"));
const SignUpForm = lazy(() => import("../pages/SignUpPage"));
const ContactForm = lazy(() => import("../pages/ContactForm"));
const ChatTest = lazy(() => import("../components/chat/ChatTest"));
const UserInfoPage = lazy(() => import("../components/modals/MyInfo"));

const Loading = <div>Loading...</div>;

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
      <Suspense fallback={Loading}>
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
        path: "contact",
        element: <ContactForm />,
      },
      {
        path: "chatTest",
        element: <ChatTest />,
      },
    ],
  },

  // ...signUp.routes,
]);

export default root;
