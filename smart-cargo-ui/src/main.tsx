import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import { RouterProvider } from 'react-router-dom'
import { AuthProvider } from './context/AuthProvider'
import router from './router'
import { Toaster } from 'react-hot-toast'



createRoot(document.getElementById('root')!).render(
  <StrictMode>
   
     <AuthProvider>
       < RouterProvider router = {router} />
       <Toaster position="top-right" reverseOrder={false} />
    </AuthProvider>
  </StrictMode>,
)
