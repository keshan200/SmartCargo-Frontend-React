import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import LoadingScreen from "./Loading";


const RoleGate = ({ allowedRoles }: { allowedRoles: string[] }) => {
  const { user, isLoggedIn, isAuthenticating } = useAuth();

  if (isAuthenticating) return <LoadingScreen />;
  if (!isLoggedIn) return <Navigate to="/login" replace />;

  const hasAccess = user && allowedRoles.includes(user.role);

  return hasAccess ? <Outlet /> : <Navigate to="/dashboard" replace />;
};

export default RoleGate;