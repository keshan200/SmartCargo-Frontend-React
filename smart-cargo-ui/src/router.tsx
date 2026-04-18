import { createBrowserRouter } from "react-router-dom";
import Login from "./pages/LoginPage";

import AdminRoutes from "./pages/AdminRoutes";
import Dashboard from "./pages/Dashboard";
import Layout from "./pages/Layout";








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

         
         ]
       },

        {
           
          },
      
      
    ],
 },
])

export default router


