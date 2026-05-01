import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/useAuth";


const Layout = () => {
 const {isAuthenticating,isLoggedIn} = useAuth()




 if(isAuthenticating){
  
  }


  const hideNavbar = location.pathname === "/" || location.pathname === "/login";


  return (
    <div className="h-screen overflow-hidden">
     
      
      <main className="h-full overflow-y-auto">
        <Outlet />
      </main>
     
    </div>
  );
};

export default Layout;
