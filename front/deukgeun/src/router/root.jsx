import React, { Suspense, lazy } from "react";
import { Outlet, createBrowserRouter } from "react-router-dom";
import Fallback from "../components/shared/Fallback";
import Layout from "../components/shared/Layout";
import CustomParticles from "../components/shared/CustomParticles";
import { LoginModalProvider } from "../context/LoginModalContext";
// import QuillEditor from "../components/shared/QuillEditor";

const Main = lazy(() => import("../pages/Main"));
const Chat = lazy(() => import("../pages/ChatRoom"));
const Calendar = lazy(() => import("../pages/CalendarPage"));
const SignUpChoice = lazy(() => import("../pages/SignUpChoicePage"));
const SignUpForm = lazy(() => import("../pages/SignUpPage"));
const FindPassword = lazy(()=> import("../components/modals/FindPassword"));
const QnaForm = lazy(() => import("../pages/QnaForm"));
const MemberList = lazy(() => import("../pages/MemberList"));
const GymSearch = lazy(() => import("../pages/GymSearchPage"));

const PTMemberList = lazy(() => import("../pages/PTMemberList"));
const CenterTrainerList = lazy(() => import("../pages/CenterTrainerList"));
const CenterMemberList = lazy(() => import("../pages/CenterMemberList"));
const MembershipStats = lazy(() => import("../pages/MembershipStats"));
const SignUpTrainerPage = lazy(() => import("../pages/SignUpTrainerPage"));
const CenterView = lazy(() => import("../pages/CenterView"));
const ReviewForm = lazy(() => import("../test/ReviewForm"));
const ReviewList = lazy(() => import("../test/ReviewList"));
const MemberRegister = lazy(() => import("../pages/MemberRegister"));
const TrainerUpdateForm = lazy(() => import("../test/TrainerUpdateForm"));
const PtRegister = lazy(() => import("../pages/PtRegister")); 
const GymSet = lazy(() => import("../pages/GymSet"));
const TrainerSet = lazy(() => import("../pages/TrainerSet"));
const QnaList = lazy(() => import("../pages/QnaList"));
const GymInfo = lazy(()=> import("../pages/GymInfo"));
const PtSessionRegister = lazy(() => import("../pages/PtSessionForm"));

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
        <LoginModalProvider>
          <Layout>
            <Outlet />
          </Layout>
        </LoginModalProvider>
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
            element: (
              <>
                <CustomParticles />
                <SignUpChoice />
              </>
            ),
          },
          {
            path: "form",
            element: (
              <>
                <CustomParticles />
                <SignUpForm />
              </>
            ),
          },
        ],
      },
      {
        path: "find-password",
        element: <FindPassword />,
      },
      {
        path: "qna",
        element: (
          <>
            <CustomParticles />
            <QnaForm />
          </>
        ),
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
        path: "gymSearch",
        element: <GymSearch />,
      },
      {
        path: "trainer",
        element: <SignUpTrainerPage />,
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
        path: "memberRegister",
        element: <MemberRegister />,
      },
      {
        path: "TrainerUpdateForm",
        element: <TrainerUpdateForm/>,
      },
      {
        path: "MemberRegister",
        element: <MemberRegister />,
      },
      {
        path: "PtRegister",
        element: <PtRegister />,
      },
      {
        path: "GymSet/:gymId",
        element: <GymSet />,
      },
      {
        path: "trainerset",
        element: <TrainerSet />,
      },
      {
        path: "qnaList",
        element: <QnaList />,
      },
      {
        path: "GymInfo",
        element: <GymInfo />,
      },
      {
        path: "PtSessionRegister",
        element: <PtSessionRegister />,
      },
    ],
  },
]);

export default root;