import { Outlet } from "react-router-dom"

import Sidebar from "../components/SideBar"
import Navbar from "../components/Navbar";
import AccessDenied from "./AccessDenied";
import { useAuth } from "../context/useAuth";
import LoadingScreen from "../components/Loading";



const AdminRoutes =  () => {
    const { isLoggedIn, isAuthenticating } = useAuth();
 
 if(isAuthenticating)return<div><LoadingScreen></LoadingScreen></div>

    return(
        
       <div className = 'flex h-screen overflow-hidden'>
           {isLoggedIn ? (
        <>

        
          <div className='flex-shrink-0'>
            <Sidebar />
          </div>

          <div className=' flex-1 overflow-y-auto bg-gray-50'>
            <Navbar />
            <Outlet />
          </div>
        </>
      ) : (
        <AccessDenied />
      )}
       </div>
    )


}

export default AdminRoutes