import { createBrowserRouter } from "react-router-dom";
import Login from "./pages/LoginPage";

import AdminRoutes from "./pages/AdminRoutes";
import Dashboard from "./pages/Dashboard";
import Layout from "./pages/Layout";
import HubPage from "./pages/HubPage";
import ShipmentPage from "./pages/ship";
import VehicleDirectory from "./pages/vehicle";

import AddUserPagggge from "./pages/AddUserPage";








const router = createBrowserRouter([
  {
    path:"/",
    element:<Layout />,
    children:[
       {path:"/", element: <Login /> },
       {path:"/login", element: <Login /> },
      

       {
         element:<AdminRoutes />,
         children:[
        
            {path:"/dashboard", element: <Dashboard />},
            {path:"/hubs", element: <HubPage />},
            {path:"/shipments", element: <ShipmentPage />},
            {path:"/vehicle", element: <VehicleDirectory />},
            {path:"/users", element: <AddUserPagggge />},


         
         ]
       },

        {
           
          },
      
      
    ],
 },
])

export default router


