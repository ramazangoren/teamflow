import { createBrowserRouter } from "react-router";
import HomePage from "./pages/HomePage/HomePage";
import LoginPage from "./pages/LoginPage/LoginPage";
// import AgenciesPage from "./pages/Agencies/AgenciesPage";
import Layout from "./components/Layout";
import NotFound from "./pages/router/NotFound";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import DashboardPage from "./pages/DashboardPage/DashboardPage";
import ClosetPage from "./pages/ClosetPage/ClosetPage";
import OutfitSuggestionsPage from "./pages/OutfitSuggestionsPage/OutfitSuggestionsPage";
import Profile from "./pages/Profile/Profile";
import Favorites from "./pages/Favorites/Favorites";
import MyOutfits from "./pages/MyOutfits/MyOutfits";

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
        path: "dashboard",
        Component: DashboardPage, // still working on it's resposiveness
      },
      {
        path: "closet",
        Component: ClosetPage, // still working on it's resposiveness
      },
      {
        path: "outfits",
        Component: OutfitSuggestionsPage, // still working on it's resposiveness
      },
      {
        path: "profile",
        Component: Profile, // still working on it's resposiveness
      },
      {
        path: "favorites",
        Component: Favorites, // still working on it's resposiveness
      },
      {
        path: "myoutfits",
        Component: MyOutfits, // still working on it's resposiveness
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
]);

export default router;
