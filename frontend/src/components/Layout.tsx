import React, { useEffect } from "react";
import { Outlet, useNavigate, useSearchParams } from "react-router";
import Header from "./Header";
import Footer from "./Footer";
// import { useAuthStore } from "../../store/UserStore";

const Layout: React.FC = () => {
//   const { setTokenUser } = useAuthStore();
//   const [searchParams] = useSearchParams();
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (searchParams.has("ticket")) {
//       const token = searchParams.get("ticket");

//       if (token) {
//         setTokenUser(token);
//         navigate("/");
//       }
//     }
//   }, []);

  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default Layout;