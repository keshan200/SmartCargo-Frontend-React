import { Outlet } from "react-router-dom"

import Sidebar from "../components/SideBar"
import Navbar from "../components/Navbar";
import LoadingScreen from "../components/Loading";



const AdminRoutes =  () => {
    
const isLoggedIn = true; 
  const isAuthenticating = false;
 
 if(isAuthenticating)return<div>Loading........</div>

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
        <div className="w-full h-full flex justify-center items-center">
          {/**unauthorized oahe */}
          <LoadingScreen />
        </div>
      )}
       </div>
    )


}

export default AdminRoutes