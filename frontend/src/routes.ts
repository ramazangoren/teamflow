import { createBrowserRouter } from "react-router";
import HomePage from "./pages/HomePage/HomePage";
import LoginPage from "./pages/LoginPage/LoginPage";
// import AgenciesPage from "./pages/Agencies/AgenciesPage";
import Layout from "./components/Layout";
import NotFound from "./pages/router/NotFound";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import ResetPasswordPage from "./pages/Resetpasswordpage/Resetpasswordpage";
import ForgotPasswordPage from "./pages/Forgotpasswordpage/Forgotpasswordpage";
import Dashboard from "./pages/Dashboard/Dashboard";
import Tasks from "./pages/Tasks/Tasks";
import Teams from "./pages/Teams/Teams";
import Calendar from "./pages/Calendar/Calendar";
import Notifications from "./pages/Notifications/Notifications";


const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      {
        index: true,
        Component: HomePage,
      },
      {
        path: "/dashboard",
        Component: Dashboard,
      },
      {
        path: "/tasks",
        Component: Tasks,
      },
      {
        path: "/teams",
        Component: Teams,
      },
      {
        path: "/calendar",
        Component: Calendar,
      },
      // {
      //   path: "/tasks/new",
      //   Component: NewTask,
      // },
      {
        path: "/notifications",
        Component: Notifications,
      },
    ],
  },
  {
    path: "/register",
    Component: RegisterPage,
  },
  {
    path: "/login",
    Component: LoginPage,
  },
  {
    path: "*",
    Component: NotFound,
  },
  {
    path: "/forgot-password",
    Component: ForgotPasswordPage,
  },
  {
    path: "reset-password",
    Component: ResetPasswordPage,
  },
]);

export default router;
