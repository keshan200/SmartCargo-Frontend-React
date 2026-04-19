import { createBrowserRouter } from "react-router-dom";
import Login from "./pages/LoginPage";

import AdminRoutes from "./pages/AdminRoutes";
import Dashboard from "./pages/Dashboard";
import Layout from "./pages/Layout";
import CargoMap from "./components/Map";
import HubPage from "./pages/HubPage";








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
        
            {path:"/dashboard", element: <HubPage />},

         
         ]
       },

        {
           
          },
      
      
    ],
 },
])

export default router


