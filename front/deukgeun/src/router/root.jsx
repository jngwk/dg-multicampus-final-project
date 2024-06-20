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
const SearchGymPage = lazy(() => import("../pages/SearchGymPage"));
const CenterView = lazy(()=>import("../pages/CenterView"));
const ReviewForm = lazy(() => import("../test/ReviewForm"));
const ReviewList = lazy(() => import("../test/ReviewList"));
<<<<<<< HEAD
const MemberRegister = lazy(() => import("../pages/MemberRegister"));

=======
const TrainerUpdateForm = lazy(() => import("../test/TrainerUpdateForm"));
>>>>>>> develop
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
        path: "stats",
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
        path: "trainer",
        element: <SignUpTrainerPage />,
      },
      {
        path: "search", 
        element: <SearchGymPage /> 
      },
      {
        path: "centerView",
        element: <CenterView />,
      },
      {
        path: "ReviewForm",
        element: <ReviewForm />,
      },
      {
        path: "ReviewList",
        element: <ReviewList gymId={1}/>,
      },
      {
<<<<<<< HEAD
        path: "memberRegister",
        element: <MemberRegister />,
=======
        path: "TrainerUpdateForm",
        element: <TrainerUpdateForm/>,
>>>>>>> develop
      },
    ],
  },
]);

export default root;
