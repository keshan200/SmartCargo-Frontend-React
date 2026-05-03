import { useEffect, useState } from "react"


import { AuthContext } from "./AuthContext"

import apiClient, { setHeader } from "./apiClient"
import type { IUser } from "../types/User"
import router from "../router"




interface AuthProviderProps{
   children :React.ReactNode
}


export const AuthProvider  = ({children}:AuthProviderProps) => {
   
   const [isLoggedIn , setIsLoggedIn] = useState<boolean>(false)
   const [accessToken , setAccessToken] =  useState<string>("")
   const [isAuthenticating , setIsAuthenticating] =  useState<boolean>(true)
   const [user, setUser] = useState<IUser | null>(null)
   

  const login = (token: string, userData: IUser) => { 
  setIsLoggedIn(true);
  setAccessToken(token);
  setUser(userData); 
 };
   
   const logout =  () => setIsLoggedIn(false)


   useEffect(()=>{
      setHeader(accessToken)
   },[accessToken])

  
   useEffect(() => {
    const tryRefresh =  async () => {
        try{
         
            const result =  await apiClient .post("/auth/refresh-token")
            setAccessToken(result.data.accessToken)
            setIsLoggedIn(true)
            setUser(result.data.user);

            const currentPath = window.location.pathname

            if(children === "/login" || currentPath === "/signup" || currentPath === "/"){
                console.log ("currentPath" , currentPath)
                router.navigate("/dashboard")
            }

        }catch(error:any){
              setAccessToken("")
              setIsLoggedIn(false)
        }finally{
            setIsAuthenticating(false)
        }
    }

    tryRefresh()
   },[])


    return<AuthContext.Provider value={{isLoggedIn,login,logout,isAuthenticating,user,setUser}}>{children}</AuthContext.Provider>

}