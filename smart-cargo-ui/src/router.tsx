import { createBrowserRouter } from "react-router-dom";
import Login from "./pages/LoginPage";

import AdminRoutes from "./pages/AdminRoutes";
import Dashboard from "./pages/Dashboard";
import Layout from "./pages/Layout";
import HubPage from "./pages/HubPage";
import ShipmentPage from "./pages/ship";
import TrackingPage from "./pages/TrackingPage";
import VehicleDirectory from "./pages/vehicle";

import AddUserPagggge from "./pages/AddUserPage";
import RoleGate from "./components/RoleGate";
import AccessDenied from "./pages/AccessDenied";
import ConsignmentPage from "./pages/Consignmentpage";
import IncomingConsignmentTracker from "./pages/Incomingconsignmentpage";








const router = createBrowserRouter([
  {
    path:"/",
    element:<Layout />,
    children:[
       {path:"/", element: <Login /> },
       {path:"/login", element: <Login /> },
       {path:"/access-denied", element: <AccessDenied /> },
      

       {
         element:<AdminRoutes />,
         children:[

          {
           element: <RoleGate allowedRoles={["CUSTOMER"]} />,
           children: [
               
             ],
          },
        
            {path:"/dashboard", element: <Dashboard />},
            {path:"/hubs", element: <HubPage />},
            {path:"/shipments", element: <ShipmentPage />},
            {path:"/tracking", element: <TrackingPage />},
            {path:"/consigments", element: <ConsignmentPage />},
            {path:"/vehicle", element: <VehicleDirectory />},
            {path:"/users", element: <IncomingConsignmentTracker />},


         
         ]
       },

        {
           
          },
      
      
    ],
 },
])

export default router


